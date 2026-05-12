from datetime import datetime
from sqlalchemy.orm import Session

from . import models, schemas
from .core.security import verify_password, get_password_hash, create_access_token


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_create: schemas.UserCreate):
    hashed_password = get_password_hash(user_create.password)
    user = models.User(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=hashed_password,
        role=user_create.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token_for_user(user: models.User):
    data = {"sub": user.email, "role": user.role}
    return create_access_token(data)


def create_course(db: Session, course: schemas.CourseCreate, lecturer_id: int):
    obj = models.Course(**course.dict(), lecturer_id=lecturer_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Course).offset(skip).limit(limit).all()


def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()


def enroll_student(db: Session, student_id: int, course_id: int):
    enrollment = models.Enrollment(student_id=student_id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def create_assignment(db: Session, assignment_in: schemas.AssignmentCreate):
    assignment = models.Assignment(**assignment_in.dict())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


def submit_assignment(db: Session, submission_in: schemas.SubmissionCreate, student_id: int):
    submission = models.Submission(**submission_in.dict(), student_id=student_id)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def grade_submission(db: Session, submission_id: int, grade: float | None = None, feedback: str | None = None):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        return None
    if grade is not None:
        submission.grade = grade
    if feedback is not None:
        submission.feedback = feedback
    db.commit()
    db.refresh(submission)
    return submission


def get_assignments(db: Session, student_id: int = None, lecturer_id: int = None):
    query = db.query(models.Assignment)
    if lecturer_id is not None:
        query = query.join(models.Course).filter(models.Course.lecturer_id == lecturer_id)
    elif student_id is not None:
        query = query.join(models.Course).join(models.Enrollment).filter(models.Enrollment.student_id == student_id)
    return query.all()


def get_assignment(db: Session, assignment_id: int):
    return db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()


def create_quiz(db: Session, quiz_in: schemas.QuizCreate):
    quiz = models.Quiz(
        course_id=quiz_in.course_id,
        title=quiz_in.title,
        description=quiz_in.description,
        duration_minutes=quiz_in.duration_minutes,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    for question_in in quiz_in.questions:
        question = models.Question(**question_in.dict(), quiz_id=quiz.id)
        db.add(question)
    db.commit()
    db.refresh(quiz)
    return quiz


def get_quiz(db: Session, quiz_id: int):
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()


def list_quizzes(db: Session, course_id: int = None):
    query = db.query(models.Quiz)
    if course_id:
        query = query.filter(models.Quiz.course_id == course_id)
    return query.all()


def grade_quiz_attempt(db: Session, student_id: int, quiz_id: int, answers: list[dict]):
    quiz = get_quiz(db, quiz_id)
    if not quiz:
        return None
    attempt = models.QuizAttempt(quiz_id=quiz_id, student_id=student_id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    score = 0

    for answer in answers:
        question = (
            db.query(models.Question)
            .filter(models.Question.id == answer.get("question_id"))
            .first()
        )

        if not question:
            print("Question not found:", answer.get("question_id"))
            continue

        chosen_option = str(answer.get("chosen_option")).strip()

        # Get the correct option field name
        correct_option_key = question.correct_option.lower()

        # Get the actual correct answer text
        correct_answer = getattr(question, correct_option_key)

        correct = (
            chosen_option.strip().lower()
            == str(correct_answer).strip().lower()
        )

        print("---------------")
        print("Question ID:", question.id)
        print("Chosen Answer:", chosen_option)
        print("Correct Option Key:", correct_option_key)
        print("Correct Answer:", correct_answer)
        print("Is Correct:", correct)
        print("Marks:", question.marks)
        print("---------------")

        if correct:
            score += question.marks

        result = models.Result(
            attempt_id=attempt.id,
            question_id=question.id,
            chosen_option=chosen_option,
            correct=correct,
        )

        db.add(result)

    print("Final Score:", score)

    attempt.score = score
    attempt.completed = True

    db.commit()
    db.refresh(attempt)

    return attempt


def create_proctoring_log(db: Session, log_in: schemas.ProctoringLogCreate, student_id: int):
    log = models.ProctoringLog(**log_in.dict(), student_id=student_id)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_proctoring_logs(db: Session, student_id: int):
    return db.query(models.ProctoringLog).filter(models.ProctoringLog.student_id == student_id).all()
