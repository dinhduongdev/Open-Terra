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

from sqlalchemy import JSON, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from uuid6 import uuid7

from app.core.db.database import Base


class ReportStatus(str, Enum):
    """Status of a user report."""

    REPORTED = "Reported"
    VERIFIED = "Verified"


class Severity(str, Enum):
    """Severity level of a report."""

    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class TrafficReport(Base):
    """User-submitted traffic congestion report."""

    __tablename__ = "traffic_report"

    # Primary key and UUID (auto-generated, init=False)
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, init=False)

    # Required fields (must come first in dataclass)
    reporter_username: Mapped[str] = mapped_column(String(100))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    street_name: Mapped[str] = mapped_column(String(255))
    severity: Mapped[Severity] = mapped_column(String(20))

    # Fields with defaults
    uuid: Mapped[uuid_pkg.UUID] = mapped_column(UUID(as_uuid=True), default_factory=uuid7, unique=True)
    status: Mapped[ReportStatus] = mapped_column(String(20), default=ReportStatus.REPORTED)
    description: Mapped[str | None] = mapped_column(Text, default=None)
    photo_urls: Mapped[list[str] | None] = mapped_column(JSON, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    verified_by_user_id: Mapped[int | None] = mapped_column(ForeignKey("user.id"), default=None, init=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)


class FloodReport(Base):
    """User-submitted flood/water level report."""

    __tablename__ = "flood_report"

    # Primary key and UUID (auto-generated, init=False)
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, init=False)

    # Required fields (must come first in dataclass)
    reporter_username: Mapped[str] = mapped_column(String(100))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    street_name: Mapped[str] = mapped_column(String(255))
    severity: Mapped[Severity] = mapped_column(String(20))

    # Fields with defaults
    uuid: Mapped[uuid_pkg.UUID] = mapped_column(UUID(as_uuid=True), default_factory=uuid7, unique=True)
    status: Mapped[ReportStatus] = mapped_column(String(20), default=ReportStatus.REPORTED)
    description: Mapped[str | None] = mapped_column(Text, default=None)
    photo_urls: Mapped[list[str] | None] = mapped_column(JSON, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    verified_by_user_id: Mapped[int | None] = mapped_column(ForeignKey("user.id"), default=None, init=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
