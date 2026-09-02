from __future__ import annotations

from openai import OpenAI

from .utils import safe_json


class LLM:
    def __init__(self, api_key: str, model: str):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com",
            timeout=600.0,
        )

        self.model = model


    def _extract_text(self, response) -> str:
        """
        Safely extract final assistant text from a DeepSeek
        Responses API response.
        """

        # Normal OpenAI-compatible helper
        text = getattr(response, "output_text", None)

        if text:
            text = text.strip()

            if text:
                return text


        # Fallback: manually inspect message output
        collected = []

        for item in getattr(response, "output", []) or []:

            if getattr(item, "type", None) != "message":
                continue

            for content in getattr(item, "content", []) or []:

                if getattr(content, "type", None) != "output_text":
                    continue

                value = getattr(content, "text", None)

                if value:
                    collected.append(value)


        text = "\n".join(collected).strip()

        if text:
            return text


        # If DeepSeek returned no final answer,
        # provide useful debugging instead of JSONDecodeError.
        status = getattr(response, "status", "unknown")
        error = getattr(response, "error", None)
        incomplete = getattr(
            response,
            "incomplete_details",
            None,
        )

        raise RuntimeError(
            "DeepSeek returned no final output text. "
            f"status={status}, "
            f"error={error}, "
            f"incomplete_details={incomplete}"
        )


    def text(
        self,
        prompt: str,
        web: bool = False,
    ) -> str:

        kwargs = {
            "model": self.model,
            "input": prompt,
        }

        if web:
            kwargs["tools"] = [
                {
                    "type": "web_search"
                }
            ]


        response = self.client.responses.create(
            **kwargs
        )


        return self._extract_text(response)


    def json(
        self,
        prompt: str,
        web: bool = False,
    ):

        kwargs = {
            "model": self.model,

            "input": (
                prompt
                + "\n\n"
                + "Return the response as one valid JSON object."
            ),

            # DeepSeek native JSON mode
            "text": {
                "format": {
                    "type": "json_object"
                }
            },
        }


        if web:
            kwargs["tools"] = [
                {
                    "type": "web_search"
                }
            ]


        response = self.client.responses.create(
            **kwargs
        )


        text = self._extract_text(response)


        return safe_json(text)
