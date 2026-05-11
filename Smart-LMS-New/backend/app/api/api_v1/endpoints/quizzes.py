from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .... import crud, schemas, models
from ....dependencies import get_db, require_role, get_current_active_user

router = APIRouter()

@router.get("/attempts", response_model=List[schemas.QuizAttemptRead])
def list_attempts(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == "lecturer":
        return db.query(models.QuizAttempt).join(models.Quiz).join(models.Course).filter(models.Course.lecturer_id == current_user.id).all()
    return current_user.quiz_attempts

@router.post("/attempt", response_model=schemas.QuizAttemptRead)
def submit_quiz(attempt_in: schemas.QuizAttemptCreate, current_user=Depends(require_role("student")), db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, attempt_in.quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    existing_attempt = db.query(models.QuizAttempt).filter(models.QuizAttempt.quiz_id == attempt_in.quiz_id, models.QuizAttempt.student_id == current_user.id).first()
    if existing_attempt and existing_attempt.completed:
        raise HTTPException(status_code=400, detail="Quiz already submitted")
    attempt = crud.grade_quiz_attempt(db, current_user.id, attempt_in.quiz_id, attempt_in.answers)
    if not attempt:
        raise HTTPException(status_code=500, detail="Unable to grade quiz")
    return attempt

@router.post("/", response_model=schemas.QuizRead)
def create_quiz(quiz_in: schemas.QuizCreate, current_user=Depends(require_role("lecturer")), db: Session = Depends(get_db)):
    course = crud.get_course(db, quiz_in.course_id)
    if not course or course.lecturer_id != current_user.id:
        raise HTTPException(status_code=404, detail="Course not found or access denied")
    return crud.create_quiz(db, quiz_in)

@router.get("/", response_model=List[schemas.QuizRead])
def list_quizzes(course_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.list_quizzes(db, course_id=course_id)

@router.get("/{quiz_id}", response_model=schemas.QuizRead)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz
