"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.crud.crud_feedback import crud_feedback
from app.models.feedback import Feedback, FeedbackCategory
from app.schemas.feedback import FeedbackCreate, FeedbackListResponse, FeedbackRead

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post(
    "",
    response_model=FeedbackRead,
    status_code=status.HTTP_201_CREATED,
    summary="Submit user feedback",
)
async def create_feedback(
    feedback_data: FeedbackCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> Feedback:
    """
    Submit new user feedback.

    No authentication required - anyone can submit feedback.

    - **username**: Your name (2-100 characters)
    - **email**: Your email address for follow-up
    - **category**: Type of feedback (General/Bug Report/Feature Request/Improvement/Other)
    - **message**: Your feedback message (10-5000 characters)
    """
    # Create the feedback in database
    feedback = await crud_feedback.create(db=db, object=feedback_data)
    await db.commit()
    await db.refresh(feedback)

    return feedback


@router.get(
    "",
    response_model=FeedbackListResponse,
    summary="List all feedback",
)
async def list_feedback(
    db: Annotated[AsyncSession, Depends(async_get_db)],
    category: Annotated[FeedbackCategory | None, Query(alias="category")] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> FeedbackListResponse:
    """
    List all feedback entries with optional filtering.

    No authentication required - feedback is publicly viewable.

    - **category**: Filter by feedback category (optional)
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return (1-100)
    """
    # Build filters
    filters = {}
    if category:
        filters["category"] = category

    # Get feedback entries
    feedback_data = await crud_feedback.get_multi(
        db=db, offset=skip, limit=limit, schema_to_select=FeedbackRead, **filters
    )

    # Get total count
    total = await crud_feedback.count(db=db, **filters)

    return FeedbackListResponse(total=total, items=feedback_data["data"])


@router.get(
    "/{feedback_id}",
    response_model=FeedbackRead,
    summary="Get feedback by ID",
)
async def get_feedback(
    feedback_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> Feedback:
    """
    Get a single feedback entry by its ID.

    No authentication required.
    """
    feedback = await crud_feedback.get(db=db, id=feedback_id, schema_to_select=FeedbackRead)

    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Feedback with ID {feedback_id} not found")

    return feedback
