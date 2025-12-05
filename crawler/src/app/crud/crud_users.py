"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from fastcrud import FastCRUD

from app.models.user import User
from app.schemas.user import UserCreateInternal, UserDelete, UserRead, UserUpdate, UserUpdateInternal

CRUDUser = FastCRUD[User, UserCreateInternal, UserUpdate, UserUpdateInternal, UserDelete, UserRead]
crud_users = CRUDUser(User)
