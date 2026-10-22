#!/usr/bin/env python3
"""Small streaming chat server; only the standard library is required to run it."""
from __future__ import annotations
import hashlib, json, os, re, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
KB = ROOT / "kb"
PORT = int(os.getenv("PORT", "8787"))
MAX_BODY, MAX_MESSAGE = 64_000, 2_000
PHONE = re.compile(r"(?<!\d)(?:\+?84|0)[\s.-]?\d{8,10}(?!\d)")

def read(name):
    try: return (KB / name).read_text(encoding="utf-8")
    except FileNotFoundError: return ""

def mask(value):
    value = re.sub(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", "[email]", value)
    value = PHONE.sub("[sđt]", value)
    return re.sub(r"\b\d{9,}\b", "[số]", value)

def find_context(message):
    catalog = read("catalog_compact.md")
    terms = {x.lower() for x in re.findall(r"[\wÀ-ỹ-]{3,}", message.lower())}
    rows = catalog.splitlines()
    hits = [line for line in rows if line.startswith(tuple(str(i) for i in range(10))) and
            len(terms & set(line.lower().split()))]
    return "\n".join(hits[:3])

def ask_anthropic(messages):
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key: return None
    body = json.dumps({"model": os.getenv("MODEL", "claude-sonnet-5-5"), "max_tokens": 1200,
        "system": read("../bot/system_prompt.md") + "\n\n" + read("shop_policies.md") + "\n\n" + read("faqs.md"),
        "messages": messages}).encode()
    req = Request("https://api.anthropic.com/v1/messages", data=body, method="POST", headers={
        "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01"})
    with urlopen(req, timeout=60) as response:
        data = json.load(response)
    return "".join(x.get("text", "") for x in data.get("content", []) if x.get("type") == "text").strip()

def fallback(message):
    if not read("catalog_compact.md"):
        return "Dạ hiện hệ thống đang cập nhật dữ liệu sản phẩm. Anh/chị nhắn Zalo 0896 561 023 để shop hỗ trợ ạ."
    if re.search(r"^(hi|hello|alo)\b", message, re.I):
        return "Dạ, em chào anh/chị, chào mừng anh/chị đến với Snus Sài Gòn. Anh/chị cứ thoải mái xem sản phẩm, cần tư vấn gì cứ nhắn em nhé."
    return "Dạ em chưa đủ thông tin để trả lời chính xác câu này. Anh/chị nhắn Zalo 0896 561 023 để shop hỗ trợ thêm ạ."

class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        raw = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status); self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(raw))); self.end_headers(); self.wfile.write(raw)
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/chat/health": return self.send_json(200, {"ok": True, "kb": (KB / "catalog_compact.md").exists()})
        if path == "/chat/api/config": return self.send_json(200, {"enabled": True, "zalo": "https://zalo.me/0896561023"})
        if path == "/chat/widget.js":
            data = (ROOT / "server/static/widget.js").read_bytes()
            self.send_response(200); self.send_header("content-type", "application/javascript"); self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data); return
        self.send_error(404)
    def do_POST(self):
        if urlparse(self.path).path != "/chat/api/message": return self.send_error(404)
        try:
            length = int(self.headers.get("content-length", "0"));
            if length > MAX_BODY: return self.send_error(413)
            body = json.loads(self.rfile.read(length)); message = str(body.get("message", "")).strip()
            if not message or len(message) > MAX_MESSAGE: return self.send_json(400, {"error": "invalid message"})
            context = find_context(message)
            prior = body.get("history", [])[-8:]
            if context: prior.append({"role": "user", "content": "PRODUCT DETAILS:\n" + context + "\n\n" + message})
            else: prior.append({"role": "user", "content": message})
            answer = ask_anthropic(prior) or fallback(message)
            payload = ("event: message\ndata: " + json.dumps({"text": answer}, ensure_ascii=False) + "\n\n" +
                       "event: done\ndata: {}\n\n").encode()
            self.send_response(200); self.send_header("content-type", "text/event-stream; charset=utf-8"); self.send_header("cache-control", "no-cache"); self.send_header("content-length", str(len(payload))); self.end_headers(); self.wfile.write(payload)
        except Exception as exc:
            self.send_json(500, {"error": "server error", "detail": mask(str(exc))})
    def log_message(self, fmt, *args): pass

if __name__ == "__main__":
    ThreadingHTTPServer((os.getenv("HOST", "127.0.0.1"), PORT), Handler).serve_forever()
