"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

class CacheIdentificationInferenceError(Exception):
    def __init__(self, message: str = "Could not infer id for resource being cached.") -> None:
        self.message = message
        super().__init__(self.message)


class InvalidRequestError(Exception):
    def __init__(self, message: str = "Type of request not supported.") -> None:
        self.message = message
        super().__init__(self.message)


class MissingClientError(Exception):
    def __init__(self, message: str = "Client is None.") -> None:
        self.message = message
        super().__init__(self.message)
