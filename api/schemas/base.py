# -*- coding: utf-8 -*-

from typing import Optional, Dict, Tuple, Any, Annotated
from pydantic import BaseModel, Field
from pydantic._internal._model_construction import ModelMetaclass


class AllOptional(ModelMetaclass):
    def __new__(
        self, name: str, bases: Tuple[type], namespaces: Dict[str, Any], **kwargs
    ):
        annotations: dict = namespaces.get("__annotations__", {})

        for base in bases:
            for base_ in base.__mro__:
                if base_ is BaseModel:
                    break
                annotations.update(base_.__annotations__)

        for field in annotations:
            if not field.startswith("__"):
                annotations[field] = Annotated[Optional[annotations[field]], Field(default=None)]

        for item in ['id', 'uuid']:
            if item in annotations:
                annotations.pop(item)

        namespaces["__annotations__"] = annotations

        return super().__new__(self, name, bases, namespaces, **kwargs)


class BaseStateModel(BaseModel):
    state: bool