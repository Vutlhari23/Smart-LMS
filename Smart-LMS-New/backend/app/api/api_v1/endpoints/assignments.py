from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .... import crud, schemas, models
from ....dependencies import get_db, require_role, get_current_active_user

router = APIRouter()

@router.post("/submit", response_model=schemas.SubmissionRead)
def submit_assignment(submission_in: schemas.SubmissionCreate, current_user=Depends(require_role("student")), db: Session = Depends(get_db)):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == submission_in.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return crud.submit_assignment(db, submission_in, current_user.id)

@router.get("/submissions", response_model=List[schemas.SubmissionRead])
def view_submissions(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == "lecturer":
        query = db.query(models.Submission).join(models.Assignment).join(models.Course).filter(models.Course.lecturer_id == current_user.id)
        return query.all()
    return current_user.submissions

@router.put("/submissions/{submission_id}", response_model=schemas.SubmissionRead)
def grade_assignment_submission(submission_id: int, submission_in: schemas.SubmissionUpdate, current_user=Depends(require_role("lecturer")), db: Session = Depends(get_db)):
    submission = db.query(models.Submission).join(models.Assignment).join(models.Course).filter(
        models.Submission.id == submission_id,
        models.Course.lecturer_id == current_user.id,
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found or access denied")
    updated = crud.grade_submission(db, submission_id, grade=submission_in.grade, feedback=submission_in.feedback)
    if not updated:
        raise HTTPException(status_code=500, detail="Unable to update submission")
    return updated

@router.post("/", response_model=schemas.AssignmentRead)
def create_assignment(assignment_in: schemas.AssignmentCreate, current_user=Depends(require_role("lecturer")), db: Session = Depends(get_db)):
    course = crud.get_course(db, assignment_in.course_id)
    if not course or course.lecturer_id != current_user.id:
        raise HTTPException(status_code=404, detail="Course not found or access denied")
    return crud.create_assignment(db, assignment_in)

@router.get("/", response_model=List[schemas.AssignmentRead])
def list_assignments(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == "lecturer":
        return crud.get_assignments(db, lecturer_id=current_user.id)
    return crud.get_assignments(db, student_id=current_user.id)
