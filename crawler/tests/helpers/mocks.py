"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from typing import Any

from fastapi.encoders import jsonable_encoder

from src.app import models
from tests.conftest import fake


def get_current_user(user: models.User) -> dict[str, Any]:
    return jsonable_encoder(user)


def oauth2_scheme() -> str:
    token = fake.sha256()
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token  # type: ignore
