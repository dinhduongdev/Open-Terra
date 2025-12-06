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

from pydantic import BaseModel, ConfigDict, Field

from app.models.report import ReportStatus, Severity


class TrafficReportBase(BaseModel):
    """Base schema for traffic reports."""

    reporter_username: Annotated[str, Field(min_length=2, max_length=100, examples=["john_doe"])]
    latitude: Annotated[float, Field(ge=-90, le=90, examples=[10.7769])]
    longitude: Annotated[float, Field(ge=-180, le=180, examples=[106.7009])]
    street_name: Annotated[str, Field(min_length=1, max_length=255, examples=["Nguyen Hue Street"])]
    severity: Annotated[Severity, Field(examples=[Severity.MEDIUM])]
    description: Annotated[str | None, Field(default=None, max_length=2000, examples=["Heavy traffic congestion"])]
    photo_urls: Annotated[list[str] | None, Field(default=None, examples=[["https://example.com/photo1.jpg"]])]


class TrafficReportCreate(TrafficReportBase):
    """Schema for creating a new traffic report."""

    model_config = ConfigDict(extra="forbid")


class TrafficReportRead(BaseModel):
    """Schema for reading traffic report data."""

    id: int
    uuid: UUID
    reporter_username: str
    latitude: float
    longitude: float
    street_name: str
    status: ReportStatus
    severity: Severity
    description: str | None
    photo_urls: list[str] | None
    created_at: datetime
    updated_at: datetime | None
    verified_by_user_id: int | None
    verified_at: datetime | None


class TrafficReportUpdate(BaseModel):
    """Schema for updating traffic report (internal use)."""

    status: ReportStatus | None = None
    updated_at: datetime | None = None
    verified_by_user_id: int | None = None
    verified_at: datetime | None = None


class TrafficReportVerify(BaseModel):
    """Schema for verifying a traffic report."""

    model_config = ConfigDict(extra="forbid")
    # No fields needed - verification is triggered by admin action


class TrafficReportListResponse(BaseModel):
    """Response schema for list of traffic reports."""

    total: int = Field(..., description="Total number of traffic reports", examples=[10])
    items: list[TrafficReportRead] = Field(..., description="List of traffic reports")
