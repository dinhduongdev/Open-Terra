"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, Field

from app.core.schemas import TimestampSchema


class TierBase(BaseModel):
    name: Annotated[str, Field(examples=["free"])]


class Tier(TimestampSchema, TierBase):
    pass


class TierRead(TierBase):
    id: int
    created_at: datetime


class TierCreate(TierBase):
    pass


class TierCreateInternal(TierCreate):
    pass


class TierUpdate(BaseModel):
    name: str | None = None


class TierUpdateInternal(TierUpdate):
    updated_at: datetime


class TierDelete(BaseModel):
    pass
