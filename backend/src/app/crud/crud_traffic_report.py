"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from fastcrud import FastCRUD

from app.models.report import TrafficReport
from app.schemas.traffic_report import (
    TrafficReportCreate,
    TrafficReportRead,
    TrafficReportUpdate,
)

CRUDTrafficReport = FastCRUD[
    TrafficReport,
    TrafficReportCreate,
    TrafficReportUpdate,
    TrafficReportUpdate,
    TrafficReportUpdate,
    TrafficReportRead,
]
crud_traffic_reports = CRUDTrafficReport(TrafficReport)
