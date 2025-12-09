"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.feedback import FeedbackCategory


class FeedbackBase(BaseModel):
    """Base schema for feedback."""

    username: Annotated[str, Field(min_length=2, max_length=100, examples=["John Doe"])]
    email: Annotated[EmailStr, Field(examples=["user@example.com"])]
    category: Annotated[FeedbackCategory, Field(examples=[FeedbackCategory.FEATURE_REQUEST])]
    message: Annotated[str, Field(min_length=10, max_length=5000, examples=["I love this platform!"])]


class FeedbackCreate(FeedbackBase):
    """Schema for creating new feedback."""

    model_config = ConfigDict(extra="forbid")


class FeedbackRead(BaseModel):
    """Schema for reading feedback data."""

    id: int
    uuid: UUID
    username: str
    email: str
    category: FeedbackCategory
    message: str
    created_at: datetime
    updated_at: datetime | None


class FeedbackListResponse(BaseModel):
    """Response schema for list of feedback."""

    total: int = Field(..., description="Total number of feedback entries", examples=[10])
    items: list[FeedbackRead] = Field(..., description="List of feedback entries")
