"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import logging

from google import genai

from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for interacting with Google Gemini AI API."""

    def __init__(self, api_key: str | None = None, model: str | None = None):
        """
        Initialize Gemini service.

        Args:
            api_key: Gemini API key (defaults to settings.GEMINI_API_KEY)
            model: Model name (defaults to settings.GEMINI_MODEL)
        """
        self.api_key: str = api_key or settings.GEMINI_API_KEY
        self.model_name: str = model or settings.GEMINI_MODEL

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not configured. Please set it in your .env file.")

        # Initialize the Gemini client
        self.client = genai.Client(api_key=self.api_key)

    async def generate_advice(self, prompt: str, max_tokens: int = 2000) -> str:
        """
        Generate AI advice based on the provided prompt.

        Args:
            prompt: The prompt to send to Gemini
            max_tokens: Maximum number of tokens in the response (default: 2000)

        Returns:
            Generated advice text

        Raises:
            Exception: If the API call fails
        """
        try:
            logger.info(f"Generating advice with model: {self.model_name}")
            logger.debug(f"Prompt length: {len(prompt)} characters")

            # Generate content using the new SDK (no token limit)
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "temperature": 0.7,
                },
            )

            # Check if response exists
            if not response:
                raise Exception("Gemini API returned no response")

            # Try to extract text
            text = None

            # Method 1: Direct text property (convenience method)
            if hasattr(response, "text") and response.text:
                text = response.text
                logger.info("Extracted text using response.text")

            # Method 2: From candidates (new SDK structure)
            elif hasattr(response, "candidates") and response.candidates:
                if len(response.candidates) > 0:
                    candidate = response.candidates[0]
                    logger.info(f"Candidate: {candidate}")

                    if hasattr(candidate, "content") and candidate.content:
                        logger.info(f"Content: {candidate.content}")

                        if hasattr(candidate.content, "parts") and candidate.content.parts:
                            # Extract text from first part
                            first_part = candidate.content.parts[0]
                            logger.info(f"First part: {first_part}")

                            if hasattr(first_part, "text"):
                                text = first_part.text
                                logger.info(f"Extracted text from candidates[0].content.parts[0].text")

            if not text:
                logger.error(f"Response structure: {response}")
                raise Exception("Gemini API returned response but no text content found")

            logger.info(f"Successfully generated advice ({len(text)} characters)")
            return text

        except Exception as e:
            logger.error(f"Failed to generate advice: {str(e)}")
            import traceback

            logger.error(f"Traceback: {traceback.format_exc()}")
            raise Exception(f"Gemini API error: {str(e)}")
