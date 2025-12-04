from typing import Generic, TypeVar, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    """Generic API response schema."""

    success: bool = Field(
        ..., 
        description="Indicates if the API request was successful",
        example=True
    )
    
    code: int = Field(
        ...,
        description="HTTP status code of the response",
        example=200
    )
    
    message: str = Field(
        ...,
        description="A message providing more details about the response",
        example="Request processed successfully"
    )
    
    error: Optional[str] = Field(
        None,
        description="Error code for debugging (null if success)",
        example="RESOURCE_NOT_FOUND"
    )
    
    result: Optional[T] = Field(
        None,
        description="Response data (null if error)"
    )
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "success": True,
                    "code": 200,
                    "message": "Weather data retrieved successfully",
                    "error": None,
                    "result": {
                        "temperature": 25.5,
                        "humidity": 60
                    }
                },
                {
                    "success": False,
                    "code": 404,
                    "message": "Weather entity not found",
                    "error": "NOT_FOUND",
                    "result": None
                }
            ]
        }
    
    @classmethod
    def success(
        cls,
        data: T,
        message: str = "Request successful",
        code: int = 200
    ) -> "APIResponse[T]":
        """Create a successful response."""
        return cls(
            success=True,
            code=code,
            message=message,
            error=None,
            result=data
        )
    
    @classmethod
    def fail(
        cls,
        message: str,
        error_code: str = "ERROR",
        code: int = 500,
        result: Optional[T] = None
    ) -> "APIResponse[T]":
        """Create a failed response."""
        return cls(
            success=False,
            code=code,
            message=message,
            error=error_code,
            result=result
        )