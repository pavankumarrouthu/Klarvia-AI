"""
Inference-only model module.

Place your inference code here. If your original notebook had training code,
move it to a separate file (e.g., train_only.py) and keep only inference here.

Expose functions:

    def load_resources():
        'Load weights, tokenizers, or any artifacts required for inference.'

    def get_reply(text: str) -> str:
        'Return a reply string for the given input text.'

If you already have these functions, replace the stubs. Otherwise, this file
acts as a starting point that echoes input.
"""

from typing import Optional
import os

_pipeline = None  # HF pipeline placeholder
_sk_model = None  # scikit-learn-like model
_unsloth_model = None
_unsloth_tokenizer = None
_unsloth_device = "cpu"
_strategy = "echo"  # one of: echo|transformers|sklearn|unsloth

# Global state for inference resources (optional)
_READY: bool = False


def load_resources() -> bool:
    """Load minimal inference resources.

    TODO: Replace this with your actual model loader from your notebook.
    If your notebook used Unsloth/LoRA etc., move the loading code here and
    keep it strictly inference-only. Do NOT include training loops.
    """
    global _READY, _pipeline, _sk_model, _unsloth_model, _unsloth_tokenizer, _unsloth_device, _strategy
    try:
        # 1) scikit-learn via JOBLIB_PATH/SKLEARN_MODEL_PATH
        skl_path = os.getenv("SKLEARN_MODEL_PATH") or os.getenv("JOBLIB_PATH")
        if skl_path and os.path.exists(skl_path):
            try:
                import joblib
                _sk_model = joblib.load(skl_path)
                _strategy = "sklearn"
                _READY = True
                print(f"[model] Loaded scikit-learn model from: {skl_path}")
                return True
            except Exception as e:
                print(f"[model] scikit load failed: {e}")

        # 2) Unsloth (LoRA etc.)
        unsloth_path = os.getenv("UNSLOTH_MODEL_PATH")
        impl = os.getenv("MODEL_IMPL", "").lower()
        if impl == "unsloth" or unsloth_path:
            try:
                from unsloth import FastLanguageModel
                import torch
                path = unsloth_path or os.getenv("MODEL_NAME", "")
                if not path:
                    raise RuntimeError("UNSLOTH_MODEL_PATH or MODEL_NAME required for Unsloth")
                max_seq_length = int(os.getenv("MAX_SEQ_LENGTH", "4096"))
                dtype = None  # let library decide
                load_in_4bit = os.getenv("LOAD_IN_4BIT", "false").lower() == "true"

                _unsloth_model, _unsloth_tokenizer = FastLanguageModel.from_pretrained(
                    model_name=path,
                    max_seq_length=max_seq_length,
                    dtype=dtype,
                    load_in_4bit=load_in_4bit,
                )
                FastLanguageModel.for_inference(_unsloth_model)
                _unsloth_device = "cuda" if hasattr(torch, "cuda") and torch.cuda.is_available() else "cpu"
                _strategy = "unsloth"
                _READY = True
                print(f"[model] Loaded Unsloth model: {path} on {_unsloth_device}")
                return True
            except Exception as e:
                print(f"[model] Unsloth load failed: {e}")

        # 3) Transformers pipeline (default)
        model_name = os.getenv("MODEL_NAME", "sshleifer/tiny-gpt2")
        try:
            from transformers import pipeline
            _pipeline = pipeline("text-generation", model=model_name)
            _strategy = "transformers"
            _READY = True
            print(f"[model] Loaded HF pipeline: {model_name}")
            return True
        except Exception as hf_err:
            print(f"[model] HF pipeline load failed ({hf_err}); using echo fallback")
            _pipeline = None
            _strategy = "echo"
            _READY = True  # Serve echo replies at least
            return True
    except Exception as e:
        print(f"[model] load_resources failed: {e}")
        _READY = False
        return False


def inference_ready() -> bool:
    return _READY


def get_reply(text: str) -> str:
    """Generate a reply for input text.

    TODO: Replace with your real inference function from the notebook, e.g.,
    tokenize → generate → decode. Keep only inference code here.
    """
    try:
        if _strategy == "sklearn" and _sk_model is not None:
            try:
                pred = _sk_model.predict([text])[0]
                return str(pred)
            except Exception as e:
                return f"[sklearn inference error] {e}"

        if _strategy == "unsloth" and _unsloth_model is not None and _unsloth_tokenizer is not None:
            try:
                import torch
                messages = [{"role": "user", "content": text}]
                inputs = _unsloth_tokenizer.apply_chat_template(
                    messages,
                    tokenize=True,
                    add_generation_prompt=True,
                    return_tensors="pt",
                ).to(_unsloth_device)

                with torch.no_grad():
                    generated = _unsloth_model.generate(
                        input_ids=inputs,
                        max_new_tokens=int(os.getenv("MAX_NEW_TOKENS", "128")),
                        use_cache=True,
                        temperature=float(os.getenv("TEMPERATURE", "0.7")),
                        top_p=float(os.getenv("TOP_P", "0.9")),
                        pad_token_id=_unsloth_tokenizer.eos_token_id,
                    )
                assistant_ids = generated[0, inputs.shape[1]:]
                assistant_text = _unsloth_tokenizer.decode(assistant_ids, skip_special_tokens=True).strip()
                return assistant_text
            except Exception as e:
                return f"[unsloth inference error] {e}"

        if _strategy == "transformers" and _pipeline is not None:
            try:
                out = _pipeline(text, max_new_tokens=int(os.getenv("MAX_NEW_TOKENS", "64")), do_sample=False)
                if out and isinstance(out, list) and "generated_text" in out[0]:
                    return out[0]["generated_text"]
                return str(out)
            except Exception as e:
                return f"[transformers inference error] {e}"

        # Echo fallback
        return f"I would answer: {text}"
    except Exception as e:
        return f"[inference error] {e}"
