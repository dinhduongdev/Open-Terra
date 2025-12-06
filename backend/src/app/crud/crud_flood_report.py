"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from fastcrud import FastCRUD

from app.models.report import FloodReport
from app.schemas.flood_report import (
    FloodReportCreate,
    FloodReportRead,
    FloodReportUpdate,
)

CRUDFloodReport = FastCRUD[
    FloodReport,
    FloodReportCreate,
    FloodReportUpdate,
    FloodReportUpdate,
    FloodReportUpdate,
    FloodReportRead,
]
crud_flood_reports = CRUDFloodReport(FloodReport)
