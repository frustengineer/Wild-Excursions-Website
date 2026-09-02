from __future__ import annotations

import time

from openai import OpenAI

from .utils import safe_json


class LLM:
    def __init__(self, api_key: str, model: str):
        """
        DeepSeek client for the Wild Excursions Trend SEO engine.
        """

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com",
            timeout=600.0,
        )

        self.model = model


    def _extract_text(self, response) -> str:
        """
        Extract final assistant text safely from a
        DeepSeek Responses API response.
        """

        # Normal Responses API helper
        text = getattr(response, "output_text", None)

        if text:
            text = text.strip()

            if text:
                return text


        # Fallback: inspect output items manually
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


        # Helpful diagnostics
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

        When web=True, the web-search tool is made available.
        The research prompt tells DeepSeek to use live web search.
        """

        kwargs = {
            "model": self.model,
            "input": prompt,

            # Disable expensive internal reasoning for
            # straightforward SEO research/generation.
            "reasoning": {
                "effort": "none"
            },

            "max_output_tokens": 16000,
        }


        if web:
            kwargs["tools"] = [
                {
                    "type": "web_search"
                }
            ]

            # IMPORTANT:
            # Do NOT force tool_choice=web_search.
            #
            # Let DeepSeek search and then produce
            # a normal final response.
            kwargs["tool_choice"] = "auto"


        response = self.client.responses.create(
            **kwargs
        )


        return self._extract_text(
            response
        )


    def json(
        self,
        prompt: str,
        web: bool = False,
    ):
        """
        Generate reliable structured JSON.

        Includes:
        - JSON output mode
        - live web-search availability
        - thinking disabled
        - larger output budget
        - automatic retries
        """

        json_prompt = (
            prompt
            + "\n\n"
            + "You MUST return one complete valid JSON object. "
            + "Return JSON only. "
            + "Do not use markdown. "
            + "Do not use ```json fences. "
            + "Do not add commentary before or after the JSON. "
            + "Keep values concise enough that the entire JSON "
            + "object can be completed."
        )


        kwargs = {
            "model": self.model,

            "input": json_prompt,

            # DeepSeek JSON output mode
            "text": {
                "format": {
                    "type": "json_object"
                }
            },

            # Thinking is enabled by default on V4 Flash.
            # Disable it here because reasoning tokens were
            # exhausting max_output_tokens before final JSON.
            "reasoning": {
                "effort": "none"
            },

            # Larger safety margin for research JSON.
            "max_output_tokens": 16000,
        }


        if web:
            kwargs["tools"] = [
                {
                    "type": "web_search"
                }
            ]

            # Let DeepSeek decide when it has enough research
            # and then produce its final JSON response.
            kwargs["tool_choice"] = "auto"


        max_attempts = 3
        last_error = None


        for attempt in range(
            1,
            max_attempts + 1,
        ):

            try:

                print(
                    "[trend-engine] "
                    f"DeepSeek JSON request "
                    f"{attempt}/{max_attempts}"
                )


                response = self.client.responses.create(
                    **kwargs
                )


                # Log useful response information
                status = getattr(
                    response,
                    "status",
                    "unknown",
                )

                usage = getattr(
                    response,
                    "usage",
                    None,
                )

                print(
                    "[trend-engine] "
                    f"DeepSeek response status: {status}"
                )

                if usage:
                    input_tokens = getattr(
                        usage,
                        "input_tokens",
                        "?"
                    )

                    output_tokens = getattr(
                        usage,
                        "output_tokens",
                        "?"
                    )

                    print(
                        "[trend-engine] "
                        f"DeepSeek tokens: "
                        f"input={input_tokens}, "
                        f"output={output_tokens}"
                    )


                text = self._extract_text(
                    response
                )


                if not text.strip():

                    raise RuntimeError(
                        "DeepSeek returned an empty response."
                    )


                result = safe_json(
                    text
                )


                if not isinstance(
                    result,
                    (dict, list),
                ):

                    raise ValueError(
                        "DeepSeek JSON response was not "
                        "an object or array."
                    )


                return result


            except Exception as exc:

                last_error = exc


                print(
                    "[trend-engine] "
                    f"DeepSeek JSON attempt "
                    f"{attempt}/{max_attempts} failed: "
                    f"{exc}"
                )


                if attempt >= max_attempts:
                    break


                print(
                    "[trend-engine] "
                    "Retrying DeepSeek JSON request..."
                )


                time.sleep(3)


                # Strengthen the response instruction
                # for the retry.
                kwargs["input"] = (
                    json_prompt
                    + "\n\n"
                    + "IMPORTANT RETRY: "
                    + "The previous response could not be parsed. "
                    + "Return ONE COMPLETE JSON OBJECT only. "
                    + "Keep the response concise. "
                    + "Do not truncate any JSON strings."
                )


        raise RuntimeError(
            "DeepSeek failed to return valid JSON "
            f"after {max_attempts} attempts. "
            f"Last error: {last_error}"
        )
