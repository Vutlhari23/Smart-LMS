from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .... import crud, schemas
from ....dependencies import get_db, require_role, get_current_active_user

router = APIRouter()

@router.post("/", response_model=schemas.EnrollmentRead)
def enroll_course(enrollment_in: schemas.EnrollmentCreate, db: Session = Depends(get_db), current_user=Depends(require_role("student"))):
    course = crud.get_course(db, enrollment_in.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return crud.enroll_student(db, student_id=current_user.id, course_id=enrollment_in.course_id)

@router.get("/me", response_model=List[schemas.EnrollmentRead])
def my_enrollments(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    return [enrollment for enrollment in current_user.enrollments]
