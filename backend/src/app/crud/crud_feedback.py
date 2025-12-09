"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from fastcrud import FastCRUD

from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackRead

CRUDFeedback = FastCRUD[
    Feedback,
    FeedbackCreate,
    FeedbackCreate,
    FeedbackCreate,
    FeedbackCreate,
    FeedbackRead,
]
crud_feedback = CRUDFeedback(Feedback)
