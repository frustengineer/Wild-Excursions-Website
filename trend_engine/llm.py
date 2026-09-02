from __future__ import annotations

import time

from openai import OpenAI

from .utils import safe_json


class LLM:
    def __init__(self, api_key: str, model: str):
        """
        DeepSeek LLM client.

        The DeepSeek API is compatible with the OpenAI SDK.
        """

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

        # ---------------------------------------------------------
        # Standard Responses API output_text helper
        # ---------------------------------------------------------
        text = getattr(response, "output_text", None)

        if text:
            text = text.strip()

            if text:
                return text


        # ---------------------------------------------------------
        # Fallback:
        # manually inspect response.output message items
        # ---------------------------------------------------------
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


        # ---------------------------------------------------------
        # Better debugging if DeepSeek returns no final text
        # ---------------------------------------------------------
        status = getattr(
            response,
            "status",
            "unknown",
        )

        error = getattr(
            response,
            "error",
            None,
        )

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
        """
        Generate normal text.

        When web=True, DeepSeek is forced to perform
        server-side live web search.
        """

        kwargs = {
            "model": self.model,
            "input": prompt,
            "max_output_tokens": 8000,
        }


        # ---------------------------------------------------------
        # LIVE WEB SEARCH
        # ---------------------------------------------------------
        if web:

            kwargs["tools"] = [
                {
                    "type": "web_search"
                }
            ]

            # Force the research call to actually search the web
            kwargs["tool_choice"] = {
                "type": "web_search"
            }


        response = self.client.responses.create(
            **kwargs
        )


        return self._extract_text(response)


    def json(
        self,
        prompt: str,
        web: bool = False,
    ):
        """
        Generate and parse a JSON response.

        Automatically retries if DeepSeek occasionally returns
        empty or malformed JSON.
        """

        json_prompt = (
            prompt
            + "\n\n"
            + "Return exactly one valid JSON object. "
            + "Do not return markdown. "
            + "Do not use ```json fences. "
            + "Do not include explanatory text before or after "
            + "the JSON object."
        )


        kwargs = {
            "model": self.model,

            "input": json_prompt,

            # -----------------------------------------------------
            # DeepSeek Responses API JSON mode
            # -----------------------------------------------------
            "text": {
                "format": {
                    "type": "json_object"
                }
            },

            # Large enough for detailed SEO research JSON
            "max_output_tokens": 8000,
        }


        # ---------------------------------------------------------
        # LIVE WEB SEARCH
        # ---------------------------------------------------------
        if web:

            kwargs["tools"] = [
                {
                    "type": "web_search"
                }
            ]

            # Make sure research does not rely only
            # on model knowledge.
            kwargs["tool_choice"] = {
                "type": "web_search"
            }


        # ---------------------------------------------------------
        # RETRY HANDLING
        #
        # DeepSeek documentation notes that JSON mode can
        # occasionally return empty output.
        # ---------------------------------------------------------
        max_attempts = 3

        last_error = None


        for attempt in range(
            1,
            max_attempts + 1,
        ):

            try:

                response = self.client.responses.create(
                    **kwargs
                )


                text = self._extract_text(
                    response
                )


                if not text.strip():
                    raise RuntimeError(
                        "DeepSeek returned an empty JSON response."
                    )


                result = safe_json(
                    text
                )


                return result


            except Exception as exc:

                last_error = exc


                if attempt >= max_attempts:
                    break


                print(
                    "[trend-engine] "
                    f"DeepSeek JSON attempt "
                    f"{attempt}/{max_attempts} failed: "
                    f"{exc}"
                )

                print(
                    "[trend-engine] "
                    "Retrying DeepSeek JSON request..."
                )


                # Small delay before retry
                time.sleep(2)


                # Strengthen instruction on retry
                kwargs["input"] = (
                    json_prompt
                    + "\n\n"
                    + "IMPORTANT: Your previous response was "
                    + "empty or invalid. "
                    + "You MUST return one complete valid JSON "
                    + "object in this response."
                )


        # ---------------------------------------------------------
        # All retries failed
        # ---------------------------------------------------------
        raise RuntimeError(
            "DeepSeek failed to return valid JSON "
            f"after {max_attempts} attempts. "
            f"Last error: {last_error}"
        )
