from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseRead(CourseBase):
    id: int
    lecturer_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class EnrollmentCreate(BaseModel):
    course_id: int

class EnrollmentRead(BaseModel):
    id: int
    course_id: int
    student_id: int
    enrolled_at: datetime

    class Config:
        orm_mode = True

class AssignmentBase(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentRead(AssignmentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SubmissionCreate(BaseModel):
    assignment_id: int
    content: Optional[str] = None
    file_path: Optional[str] = None

class SubmissionRead(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content: Optional[str]
    grade: Optional[float]
    feedback: Optional[str]
    submitted_at: datetime
    file_path: Optional[str]

    class Config:
        orm_mode = True

class SubmissionUpdate(BaseModel):
    grade: Optional[float] = None
    feedback: Optional[str] = None

class QuestionCreate(BaseModel):
    prompt: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    marks: int

class QuestionRead(QuestionCreate):
    id: int
    quiz_id: int

    class Config:
        orm_mode = True

class QuizBase(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    duration_minutes: int = 10

class QuizCreate(QuizBase):
    questions: List[QuestionCreate]

class QuizRead(QuizBase):
    id: int
    created_at: datetime
    questions: List[QuestionRead] = []

    class Config:
        orm_mode = True

class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: List[dict]

class QuizAttemptRead(BaseModel):
    id: int
    quiz_id: int
    student_id: int
    score: float
    completed: bool
    submitted_at: datetime

    class Config:
        orm_mode = True

class ProctoringLogCreate(BaseModel):
    quiz_attempt_id: Optional[int] = None
    event: str
    details: Optional[str] = None

class ProctoringLogRead(BaseModel):
    id: int
    student_id: int
    quiz_attempt_id: Optional[int]
    timestamp: datetime
    event: str
    details: Optional[str]

    class Config:
        orm_mode = True
