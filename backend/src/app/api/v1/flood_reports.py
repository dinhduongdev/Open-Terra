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
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.api.dependencies import get_current_user
from app.crud.crud_flood_report import crud_flood_reports
from app.models.report import FloodReport, ReportStatus
from app.models.user import User
from app.publishers.orion_ld_publisher import orion_ld_publisher
from app.schemas.flood_report import (
    FloodReportCreate,
    FloodReportListResponse,
    FloodReportRead,
    FloodReportUpdate,
)

router = APIRouter(prefix="/flood-reports", tags=["Flood Reports"])


@router.post(
    "",
    response_model=FloodReportRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new flood report",
)
async def create_flood_report(
    report_data: FloodReportCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> FloodReport:
    """
    Create a new flood/water level report.

    No authentication required - users only need to provide a username.
    """
    # Create the report in database
    report = await crud_flood_reports.create(db=db, object=report_data)
    await db.commit()
    await db.refresh(report)

    return report


@router.get(
    "",
    response_model=FloodReportListResponse,
    summary="List flood reports",
)
async def list_flood_reports(
    db: Annotated[AsyncSession, Depends(async_get_db)],
    status_filter: Annotated[ReportStatus | None, Query(alias="status")] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> FloodReportListResponse:
    """
    List flood reports with optional filtering.

    - **status**: Filter by report status (Reported/Verified)
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    # Build filters
    filters = {}
    if status_filter:
        filters["status"] = status_filter

    # Get reports
    reports = await crud_flood_reports.get_multi(db=db, offset=skip, limit=limit, **filters)

    # Get total count
    total = await crud_flood_reports.count(db=db, **filters)

    return FloodReportListResponse(total=total, items=reports)


@router.get(
    "/{report_id}",
    response_model=FloodReportRead,
    summary="Get a flood report by ID",
)
async def get_flood_report(
    report_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> FloodReport:
    """Get a single flood report by its ID."""
    report = await crud_flood_reports.get(db=db, id=report_id)

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Flood report with ID {report_id} not found")

    return report


@router.patch(
    "/{report_id}/verify",
    response_model=FloodReportRead,
    summary="Verify a flood report (Admin only)",
)
async def verify_flood_report(
    report_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> FloodReport:
    """
    Verify a flood report and sync to Orion-LD Context Broker.

    Only accessible by authenticated admin users.
    When verified, the report is published to Orion-LD as WaterObserved entity.
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin users can verify reports")

    # Get the report
    report = await crud_flood_reports.get(db=db, id=report_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Flood report with ID {report_id} not found")

    # Check if already verified
    if report.status == ReportStatus.VERIFIED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Report is already verified")

    # Update report status
    update_data = FloodReportUpdate(
        status=ReportStatus.VERIFIED,
        verified_by_user_id=current_user.id,
        verified_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    report = await crud_flood_reports.update(db=db, object=update_data, id=report_id)
    await db.commit()
    await db.refresh(report)

    # Publish to Orion-LD
    try:
        entity_id = f"FloodReport-{report.uuid}"
        result = orion_ld_publisher.publish(entity=report, entity_id=entity_id, entity_type="FloodMonitoring")

        if result.get("status") == "error":
            # Log error but don't fail the verification
            print(f"Warning: Failed to publish to Orion-LD: {result.get('error')}")
    except Exception as e:
        # Log error but don't fail the verification
        print(f"Warning: Exception publishing to Orion-LD: {e}")

    return report
