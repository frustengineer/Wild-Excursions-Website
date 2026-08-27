from __future__ import annotations
from openai import OpenAI
from .utils import safe_json


class LLM:
    def __init__(self, api_key: str, model: str):
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def text(self, prompt: str, web: bool = False) -> str:
        kwargs = {"model": self.model, "input": prompt}
        if web:
            kwargs["tools"] = [{"type": "web_search"}]
        response = self.client.responses.create(**kwargs)
        return response.output_text.strip()

    def json(self, prompt: str, web: bool = False):
        return safe_json(self.text(prompt + "\n\nReturn ONLY valid JSON. No markdown fences.", web=web))
