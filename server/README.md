# Chat server

Run `python scripts/scan_catalog.py`, then `python server/app.py`. The server exposes `/chat/api/message`, `/chat/api/config`, `/chat/health`, and `/chat/widget.js`. Set `ANTHROPIC_API_KEY` for the Anthropic transport; without it the server remains safe and returns a conservative fallback. Keep it behind nginx and do not expose the process directly.
