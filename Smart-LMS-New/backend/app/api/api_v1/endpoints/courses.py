from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .... import crud, models, schemas
from ....dependencies import get_db, require_role, get_current_active_user

router = APIRouter()

@router.get("/my", response_model=List[schemas.CourseRead])
def my_courses(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == "lecturer":
        return db.query(models.Course).filter(models.Course.lecturer_id == current_user.id).all()
    return [enrollment.course for enrollment in current_user.enrollments]

@router.get("/", response_model=List[schemas.CourseRead])
def list_courses(db: Session = Depends(get_db)):
    return crud.get_courses(db)

@router.post("/", response_model=schemas.CourseRead)
def create_course(course_in: schemas.CourseCreate, current_user=Depends(require_role("lecturer")), db: Session = Depends(get_db)):
    return crud.create_course(db, course_in, lecturer_id=current_user.id)

@router.get("/{course_id}", response_model=schemas.CourseRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
