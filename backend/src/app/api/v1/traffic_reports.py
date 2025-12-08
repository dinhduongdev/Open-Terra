"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.api.dependencies import get_current_user
from app.crud.crud_traffic_report import crud_traffic_reports
from app.models.report import ReportStatus, TrafficReport
from app.models.user import User
from app.publishers.orion_ld_publisher import orion_ld_publisher
from app.schemas.traffic_report import (
    TrafficReportCreate,
    TrafficReportListResponse,
    TrafficReportRead,
    TrafficReportUpdate,
)

router = APIRouter(prefix="/traffic-reports", tags=["Traffic Reports"])


@router.post(
    "",
    response_model=TrafficReportRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new traffic report",
)
async def create_traffic_report(
    report_data: TrafficReportCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> TrafficReport:
    """
    Create a new traffic congestion report.

    No authentication required - users only need to provide a username.
    """
    # Create the report in database
    report = await crud_traffic_reports.create(db=db, object=report_data)
    await db.commit()
    await db.refresh(report)

    return report


@router.get(
    "",
    response_model=TrafficReportListResponse,
    summary="List traffic reports",
)
async def list_traffic_reports(
    db: Annotated[AsyncSession, Depends(async_get_db)],
    status_filter: Annotated[ReportStatus | None, Query(alias="status")] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> TrafficReportListResponse:
    """
    List traffic reports with optional filtering.

    - **status**: Filter by report status (Reported/Verified)
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    # Build filters
    filters = {}
    if status_filter:
        filters["status"] = status_filter

    # Get reports
    reports_data = await crud_traffic_reports.get_multi(db=db, offset=skip, limit=limit, **filters)

    # Get total count
    total = await crud_traffic_reports.count(db=db, **filters)

    return TrafficReportListResponse(total=total, items=reports_data["data"])


@router.get(
    "/{report_id}",
    response_model=TrafficReportRead,
    summary="Get a traffic report by ID",
)
async def get_traffic_report(
    report_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> TrafficReport:
    """Get a single traffic report by its ID."""
    report = await crud_traffic_reports.get(db=db, id=report_id)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Traffic report with ID {report_id} not found"
        )

    return report


@router.patch(
    "/{report_id}/verify",
    response_model=TrafficReportRead,
    summary="Verify a traffic report",
)
async def verify_traffic_report(
    report_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> TrafficReport:
    """
    Verify a traffic report and sync to Orion-LD Context Broker.

    No authentication required - anyone can verify reports.
    When verified, the report is published to Orion-LD as TrafficFlowObserved entity.
    """
    # Get the report as model object
    result = await db.execute(select(TrafficReport).where(TrafficReport.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Traffic report with ID {report_id} not found"
        )

    # Check if already verified
    if report.status == ReportStatus.VERIFIED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Report is already verified")

    # Update report status
    report.status = ReportStatus.VERIFIED
    report.verified_by_user_id = None
    report.verified_at = datetime.now(UTC)
    report.updated_at = datetime.now(UTC)

    await db.commit()
    await db.refresh(report)

    # Publish to Orion-LD
    try:
        entity_id = f"TrafficReport-{report.uuid}"
        result = orion_ld_publisher.publish(entity=report, entity_id=entity_id, entity_type="TrafficFlowObserved")

        if result.get("status") == "error":
            # Log error but don't fail the verification
            print(f"Warning: Failed to publish to Orion-LD: {result.get('error')}")
    except Exception as e:
        # Log error but don't fail the verification
        print(f"Warning: Exception publishing to Orion-LD: {e}")

    return report
