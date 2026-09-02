from __future__ import annotations

import time
from typing import Any

from openai import OpenAI

from .utils import safe_json


class LLM:
    """
    DeepSeek LLM client for the Wild Excursions
    Daily Trend SEO automation.

    Architecture:

    Normal text:
        Prompt
          -> DeepSeek
          -> Text

    Live research JSON:
        Prompt
          -> DeepSeek Web Search
          -> Search results
          -> DeepSeek research synthesis
          -> DeepSeek JSON formatter
          -> Parsed Python dict

    Web search is intentionally NOT repeated when
    JSON formatting needs to retry.
    """

    def __init__(
        self,
        api_key: str,
        model: str,
    ):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com",
            timeout=600.0,
        )

        self.model = model


    # ============================================================
    # RESPONSE HELPERS
    # ============================================================

    def _extract_response_text(
        self,
        response,
    ) -> str:
        """
        Extract assistant output_text from a
        DeepSeek Responses API response.
        """

        # Normal SDK convenience property
        text = getattr(
            response,
            "output_text",
            None,
        )

        if text:
            text = str(text).strip()

            if text:
                return text


        # Manual fallback
        collected: list[str] = []

        for item in (
            getattr(response, "output", None)
            or []
        ):
            item_type = getattr(
                item,
                "type",
                None,
            )

            if item_type != "message":
                continue


            for content in (
                getattr(item, "content", None)
                or []
            ):
                content_type = getattr(
                    content,
                    "type",
                    None,
                )

                if content_type != "output_text":
                    continue


                value = getattr(
                    content,
                    "text",
                    None,
                )

                if value:
                    collected.append(
                        str(value)
                    )


        return "\n".join(
            collected
        ).strip()


    def _response_item_types(
        self,
        response,
    ) -> list[str]:
        """
        Return response output item types for debugging.
        """

        result: list[str] = []

        for item in (
            getattr(response, "output", None)
            or []
        ):
            item_type = getattr(
                item,
                "type",
                None,
            )

            if item_type:
                result.append(
                    str(item_type)
                )

        return result


    def _item_to_dict(
        self,
        item: Any,
    ) -> dict:
        """
        Convert an OpenAI SDK response item into
        a plain dictionary so it can be passed back
        into the stateless DeepSeek Responses API.
        """

        if isinstance(item, dict):
            return item


        if hasattr(item, "model_dump"):
            return item.model_dump(
                exclude_none=True
            )


        if hasattr(item, "dict"):
            return item.dict(
                exclude_none=True
            )


        raise TypeError(
            "Unable to serialize DeepSeek "
            f"response item: {type(item)}"
        )


    # ============================================================
    # USAGE LOGGING
    # ============================================================

    def _log_response_usage(
        self,
        response,
        label: str,
    ) -> None:
        """
        Log Responses API token usage.
        """

        usage = getattr(
            response,
            "usage",
            None,
        )

        if not usage:
            return


        input_tokens = getattr(
            usage,
            "input_tokens",
            0,
        )

        output_tokens = getattr(
            usage,
            "output_tokens",
            0,
        )

        total_tokens = getattr(
            usage,
            "total_tokens",
            0,
        )


        print(
            "[trend-engine] "
            f"{label} tokens: "
            f"input={input_tokens}, "
            f"output={output_tokens}, "
            f"total={total_tokens}"
        )


    def _log_chat_usage(
        self,
        response,
        label: str,
    ) -> None:
        """
        Log Chat Completions token usage.
        """

        usage = getattr(
            response,
            "usage",
            None,
        )

        if not usage:
            return


        input_tokens = getattr(
            usage,
            "prompt_tokens",
            0,
        )

        output_tokens = getattr(
            usage,
            "completion_tokens",
            0,
        )

        total_tokens = getattr(
            usage,
            "total_tokens",
            0,
        )


        print(
            "[trend-engine] "
            f"{label} tokens: "
            f"input={input_tokens}, "
            f"output={output_tokens}, "
            f"total={total_tokens}"
        )


    # ============================================================
    # NORMAL TEXT GENERATION
    # ============================================================

    def _plain_text(
        self,
        prompt: str,
    ) -> str:
        """
        Normal DeepSeek text generation without web search.
        """

        response = self.client.responses.create(
            model=self.model,

            input=prompt,

            reasoning={
                "effort": "none"
            },

            max_output_tokens=8000,

            temperature=0.2,
        )


        self._log_response_usage(
            response,
            "DeepSeek text",
        )


        text = self._extract_response_text(
            response
        )


        if not text:
            raise RuntimeError(
                "DeepSeek returned no text. "
                f"status={getattr(response, 'status', 'unknown')}, "
                f"items={self._response_item_types(response)}, "
                f"incomplete={getattr(response, 'incomplete_details', None)}"
            )


        return text


    # ============================================================
    # LIVE WEB SEARCH
    # ============================================================

    def _run_web_search(
        self,
        prompt: str,
    ) -> tuple[str | None, list[dict]]:
        """
        Perform ONE live DeepSeek server-side web research run.

        Returns:

        (
            optional final assistant text,
            completed web_search_call items
        )

        Search calls are saved so they can be passed into
        another Responses API request without running the
        search again.
        """

        research_prompt = (
            prompt
            + "\n\n"
            + "IMPORTANT RESEARCH INSTRUCTION:\n"
            + "Perform current live web research before answering.\n"
            + "Prefer official government, forest department, "
            + "park authority, NTCA, tourism/booking portals, "
            + "recognized conservation sources and reputable news.\n"
            + "Use travel/competitor sites only as secondary evidence.\n"
            + "Do not invent facts, prices, permit dates, rules, "
            + "statistics, sightings or policies."
        )


        response = self.client.responses.create(
            model=self.model,

            input=research_prompt,

            tools=[
                {
                    "type": "web_search"
                }
            ],

            # Force at least one real web search.
            tool_choice={
                "type": "web_search"
            },

            reasoning={
                "effort": "none"
            },

            # This request primarily performs search.
            # Final synthesis happens separately below.
            max_output_tokens=6000,

            temperature=0.2,
        )


        self._log_response_usage(
            response,
            "DeepSeek web search",
        )


        final_text = self._extract_response_text(
            response
        )


        search_calls: list[dict] = []


        for item in (
            getattr(response, "output", None)
            or []
        ):
            if (
                getattr(item, "type", None)
                != "web_search_call"
            ):
                continue


            status = getattr(
                item,
                "status",
                None,
            )


            # Only reuse completed search calls.
            if status not in {
                None,
                "completed",
            }:
                continue


            search_calls.append(
                self._item_to_dict(item)
            )


        print(
            "[trend-engine] "
            f"DeepSeek web search completed. "
            f"search_calls={len(search_calls)}, "
            f"output_items={self._response_item_types(response)}"
        )


        return (
            final_text or None,
            search_calls,
        )


    # ============================================================
    # WEB RESEARCH SYNTHESIS
    # ============================================================

    def _research_with_web(
        self,
        prompt: str,
    ) -> str:
        """
        Research using DeepSeek web search.

        The search happens ONCE.

        If DeepSeek already returned a proper final message,
        use it.

        Otherwise, pass the web_search_call items back into
        DeepSeek and explicitly request synthesis with no new
        web search.
        """

        max_search_attempts = 2
        last_error: Exception | None = None


        for attempt in range(
            1,
            max_search_attempts + 1,
        ):
            try:

                print(
                    "[trend-engine] "
                    f"DeepSeek live web search "
                    f"{attempt}/{max_search_attempts}"
                )


                (
                    direct_text,
                    search_calls,
                ) = self._run_web_search(
                    prompt
                )


                # If the first response already produced
                # meaningful assistant text, use it.
                if (
                    direct_text
                    and len(direct_text) >= 500
                ):
                    print(
                        "[trend-engine] "
                        "DeepSeek returned research synthesis "
                        "with the search response."
                    )

                    return direct_text


                # We need search calls to continue without
                # performing another search.
                if not search_calls:
                    raise RuntimeError(
                        "DeepSeek performed no reusable "
                        "web_search_call."
                    )


                print(
                    "[trend-engine] "
                    "Synthesizing existing DeepSeek "
                    "web search results..."
                )


                continuation_input: list[dict] = [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ]


                # DeepSeek documentation allows web_search_call
                # items to be passed back as input.
                continuation_input.extend(
                    search_calls
                )


                continuation_input.append(
                    {
                        "role": "user",
                        "content": (
                            "Using the web search results above, "
                            "produce the final research brief now.\n\n"

                            "Do NOT perform another web search.\n"

                            "Include only information supported by "
                            "the research results.\n"

                            "Clearly distinguish VERIFIED, "
                            "UNVERIFIED and CONFLICTING claims.\n"

                            "Include source names and URLs when "
                            "available.\n"

                            "Be concise but complete.\n"

                            "Do not output JSON yet."
                        ),
                    }
                )


                synthesis = (
                    self.client.responses.create(
                        model=self.model,

                        input=continuation_input,

                        # No tools are provided here.
                        # Therefore no second web search occurs.

                        reasoning={
                            "effort": "none"
                        },

                        max_output_tokens=10000,

                        temperature=0.2,
                    )
                )


                self._log_response_usage(
                    synthesis,
                    "DeepSeek research synthesis",
                )


                research_text = (
                    self._extract_response_text(
                        synthesis
                    )
                )


                if not research_text:
                    raise RuntimeError(
                        "DeepSeek synthesis produced no final text. "
                        f"status={getattr(synthesis, 'status', 'unknown')}, "
                        f"items={self._response_item_types(synthesis)}, "
                        f"incomplete={getattr(synthesis, 'incomplete_details', None)}"
                    )


                print(
                    "[trend-engine] "
                    "Live web research synthesis completed."
                )


                return research_text


            except Exception as exc:

                last_error = exc


                print(
                    "[trend-engine] "
                    f"Web research attempt "
                    f"{attempt}/{max_search_attempts} "
                    f"failed: {exc}"
                )


                if attempt < max_search_attempts:

                    print(
                        "[trend-engine] "
                        "Retrying live research..."
                    )

                    time.sleep(3)


        raise RuntimeError(
            "DeepSeek live research failed after "
            f"{max_search_attempts} attempts. "
            f"Last error: {last_error}"
        )


    # ============================================================
    # JSON GENERATION
    # ============================================================

    def _json_from_text(
        self,
        prompt: str,
    ):
        """
        Convert supplied information into strict JSON.

        Uses Chat Completions JSON mode WITHOUT web search.

        JSON retries therefore do not repeat expensive
        web searches.
        """

        system_prompt = (
            "You are the structured-data formatter for the "
            "Wild Excursions SEO automation.\n"

            "Your response MUST be valid JSON.\n"

            "Return exactly one complete JSON object.\n"

            "Never use markdown code fences.\n"

            "Never write commentary before or after JSON.\n"

            "Never truncate a JSON string.\n"

            "Keep text values concise while preserving "
            "important factual information.\n"

            'Example valid JSON: {"status":"ok"}'
        )


        max_attempts = 3
        last_error: Exception | None = None


        current_prompt = prompt


        for attempt in range(
            1,
            max_attempts + 1,
        ):
            try:

                print(
                    "[trend-engine] "
                    f"DeepSeek JSON formatting "
                    f"{attempt}/{max_attempts}"
                )


                response = (
                    self.client.chat.completions.create(
                        model=self.model,

                        messages=[
                            {
                                "role": "system",
                                "content": system_prompt,
                            },
                            {
                                "role": "user",
                                "content": current_prompt,
                            },
                        ],

                        response_format={
                            "type": "json_object"
                        },

                        max_tokens=16000,

                        temperature=0.1,

                        # DeepSeek Chat Completions format
                        # requires thinking configuration
                        # through extra_body.
                        extra_body={
                            "thinking": {
                                "type": "disabled"
                            }
                        },
                    )
                )


                self._log_chat_usage(
                    response,
                    "DeepSeek JSON formatter",
                )


                if not response.choices:
                    raise RuntimeError(
                        "DeepSeek JSON response "
                        "contained no choices."
                    )


                message = (
                    response.choices[0].message
                )


                content = getattr(
                    message,
                    "content",
                    None,
                )


                if not content:
                    raise RuntimeError(
                        "DeepSeek JSON mode "
                        "returned empty content."
                    )


                text = str(
                    content
                ).strip()


                if not text:
                    raise RuntimeError(
                        "DeepSeek JSON response "
                        "was blank."
                    )


                result = safe_json(
                    text
                )


                if not isinstance(
                    result,
                    dict,
                ):
                    raise ValueError(
                        "DeepSeek returned JSON, "
                        "but the root value was not an object."
                    )


                print(
                    "[trend-engine] "
                    "DeepSeek JSON validated successfully."
                )


                return result


            except Exception as exc:

                last_error = exc


                print(
                    "[trend-engine] "
                    f"JSON formatting attempt "
                    f"{attempt}/{max_attempts} "
                    f"failed: {exc}"
                )


                if attempt >= max_attempts:
                    break


                time.sleep(2)


                current_prompt = (
                    prompt
                    + "\n\n"
                    + "IMPORTANT RETRY:\n"
                    + "The previous output could not be parsed.\n"
                    + "Return ONE COMPLETE VALID JSON OBJECT only.\n"
                    + "Keep values concise.\n"
                    + "Do not use markdown.\n"
                    + "Do not truncate strings."
                )


        raise RuntimeError(
            "DeepSeek failed to produce valid JSON "
            f"after {max_attempts} attempts. "
            f"Last error: {last_error}"
        )


    # ============================================================
    # PUBLIC TEXT METHOD
    # ============================================================

    def text(
        self,
        prompt: str,
        web: bool = False,
    ) -> str:
        """
        Public text-generation interface.
        """

        if web:
            return self._research_with_web(
                prompt
            )


        return self._plain_text(
            prompt
        )


    # ============================================================
    # PUBLIC JSON METHOD
    # ============================================================

    def json(
        self,
        prompt: str,
        web: bool = False,
    ):
        """
        Public JSON-generation interface.

        If web=False:
            Prompt
              -> JSON formatter

        If web=True:
            Prompt
              -> LIVE WEB SEARCH
              -> Research synthesis
              -> JSON formatter

        JSON retry NEVER repeats web research.
        """

        if not web:

            json_prompt = (
                prompt
                + "\n\n"
                + "Return the requested result "
                + "as one valid JSON object."
            )


            return self._json_from_text(
                json_prompt
            )


        # --------------------------------------------------------
        # STEP 1:
        # Do live research ONCE
        # --------------------------------------------------------

        research_text = (
            self._research_with_web(
                prompt
            )
        )


        # --------------------------------------------------------
        # STEP 2:
        # Convert research to requested JSON
        # WITHOUT another web search
        # --------------------------------------------------------

        json_prompt = (
            prompt
            + "\n\n"

            + "LIVE WEB RESEARCH RESULTS:\n"
            + "--------------------------------\n"
            + research_text
            + "\n"
            + "--------------------------------\n\n"

            + "Using the LIVE WEB RESEARCH RESULTS above, "
            + "produce the JSON object requested by the "
            + "original instructions.\n\n"

            + "Do not perform additional research.\n"

            + "Do not invent information missing from "
            + "the research.\n"

            + "Label uncertain claims appropriately.\n"

            + "Return exactly one complete JSON object."
        )


        return self._json_from_text(
            json_prompt
                )
