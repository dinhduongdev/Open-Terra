from fastcrud import FastCRUD

from app.core.db.token_blacklist import TokenBlacklist
from app.core.schemas import TokenBlacklistCreate, TokenBlacklistRead, TokenBlacklistUpdate

CRUDTokenBlacklist = FastCRUD[
    TokenBlacklist,
    TokenBlacklistCreate,
    TokenBlacklistUpdate,
    TokenBlacklistUpdate,
    TokenBlacklistUpdate,
    TokenBlacklistRead,
]
crud_token_blacklist = CRUDTokenBlacklist(TokenBlacklist)
