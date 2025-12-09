"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import uuid as uuid_pkg
from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from uuid6 import uuid7

from app.core.db.database import Base


class FeedbackCategory(str, Enum):
    """Category of user feedback."""

    GENERAL = "General"
    BUG_REPORT = "Bug Report"
    FEATURE_REQUEST = "Feature Request"
    IMPROVEMENT = "Improvement"
    OTHER = "Other"


class Feedback(Base):
    """User-submitted feedback."""

    __tablename__: str = "feedback"

    # Primary key (auto-generated)
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, init=False)
    uuid: Mapped[uuid_pkg.UUID] = mapped_column(UUID(as_uuid=True), default_factory=uuid7, unique=True, init=False)

    # Required fields
    username: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255))
    category: Mapped[FeedbackCategory] = mapped_column(String(50))
    message: Mapped[str] = mapped_column(Text)

    # Fields with defaults
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default_factory=lambda: datetime.now(UTC), init=False
    )
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
