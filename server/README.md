# Chat server

Run `python scripts/scan_catalog.py`, then set `ANTHROPIC_API_KEY` and run `python server/app.py`. The server exposes `/chat/api/message`, `/chat/api/config`, `/chat/health`, and `/chat/widget.js`. Without a key it remains safe and returns a conservative fallback.

For the storefront locally, set `NEXT_PUBLIC_CHAT_WIDGET_SRC=/chat/widget.js` in `apps/shop/.env.local`, keep the chat server on port `8787`, and run `pnpm dev:shop`. `apps/shop/next.config.ts` proxies `/chat/*` to the local server, so the browser stays same-origin and no CORS setup is needed. Keep the API key server-side; never put it in `NEXT_PUBLIC_*` variables.
