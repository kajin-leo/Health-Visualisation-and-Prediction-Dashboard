# hooks_attcat.py
from typing import List, Dict, Any
import torch
from torch import nn

class AttnHiddenCollector:
    def __init__(self, model: nn.Module, capture_grads: bool = False, store_on_cpu: bool = True):
        self.model = model
        self.capture_grads = capture_grads
        self.store_on_cpu = store_on_cpu
        self._handles: List[Any] = []
        self.hidden_per_layer: List[Dict[str, Any]] = []   # [{'name': str, 'output': Tensor}, ...]
        self.attn_per_layer: List[Dict[str, Any]] = []     # [{'name': str, 'weights': Tensor|None}, ...]

    def _maybe_move(self, x):
        if x is None:
            return None
        return x.detach().cpu() if self.store_on_cpu and not self.capture_grads else x

    def _mk_attn_hook(self, name: str):
        def hook(module: nn.Module, inputs, output):
            attn_w = None
            if isinstance(output, (tuple, list)) and len(output) >= 2:
                attn_w = output[1]
            self.attn_per_layer.append({
                'name': name,
                'weights': self._maybe_move(attn_w)
            })
        return hook

    def _mk_hidden_hook(self, name: str):
        def hook(module: nn.Module, inputs, output):
            out = output
            if self.capture_grads:
                try:
                    out.retain_grad()
                except Exception:
                    pass
            self.hidden_per_layer.append({
                'name': name,
                'output': self._maybe_move(out)
            })
        return hook

    def register(self):
        for full_name, module in self.model.named_modules():
            if isinstance(module, nn.MultiheadAttention):
                h = module.register_forward_hook(self._mk_attn_hook(full_name))
                self._handles.append(h)
            if hasattr(module, 'self_attn') and not isinstance(module, nn.MultiheadAttention):
                h = module.register_forward_hook(self._mk_hidden_hook(full_name))
                self._handles.append(h)
        return self

    def clear_buffers(self):
        self.hidden_per_layer.clear()
        self.attn_per_layer.clear()

    def remove(self):
        for h in self._handles:
            try:
                h.remove()
            except Exception:
                pass
        self._handles.clear()
