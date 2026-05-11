from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .... import crud, schemas
from ....dependencies import get_db, get_current_active_user

router = APIRouter()

@router.post("/logs", response_model=schemas.ProctoringLogRead)
def create_log(log_in: schemas.ProctoringLogCreate, current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.create_proctoring_log(db, log_in, current_user.id)

@router.get("/logs", response_model=List[schemas.ProctoringLogRead])
def get_logs(current_user=Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_proctoring_logs(db, student_id=current_user.id)
