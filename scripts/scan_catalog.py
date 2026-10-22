#!/usr/bin/env python3
"""Build the chatbot knowledge base from snussaigon.com's public REST API."""
from __future__ import annotations

import argparse, html, json, re, sys
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
KB = ROOT / "kb"
RAW = ROOT / "data" / "raw"
API = "https://snussaigon.com/api"

def get(collection: str, **params):
    params.setdefault("limit", 100)
    params.setdefault("depth", 1)
    url = f"{API}/{collection}?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "snussaigon-chatbot-kb/1.0"})
    with urlopen(req, timeout=30) as response:
        return json.load(response)

def all_docs(collection: str, **params):
    page, docs = 1, []
    while True:
        data = get(collection, page=page, **params)
        docs.extend(data.get("docs", []))
        if page >= data.get("totalPages", page):
            return docs
        page += 1

def text(value):
    if isinstance(value, dict):
        value = value.get("root", value.get("children", value.get("text", "")))
    if isinstance(value, list):
        return " ".join(text(x) for x in value)
    value = re.sub(r"<[^>]+>", " ", str(value or ""))
    return re.sub(r"\s+", " ", html.unescape(value)).strip()

def money(value):
    try: return f"{int(float(value)):,}".replace(",", ".") + "đ"
    except (TypeError, ValueError): return "-"

def scan():
    products = all_docs("products", locale="vi", sort="id")
    faqs = all_docs("faqs", locale="all", depth=0)
    policies = all_docs("policies", locale="vi", depth=0)
    shipping = all_docs("shipping", depth=1)
    promotions = all_docs("promotions", depth=1)
    locations = all_docs("store-locations", depth=0)
    payments = all_docs("payments", depth=1)
    for name, value in {"products": products, "faqs": faqs, "policies": policies,
                        "shipping": shipping, "promotions": promotions,
                        "store-locations": locations, "payments": payments}.items():
        path = RAW / f"{name}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")

    visible = [p for p in products if p.get("visible", True)]
    rows, chunks = [], []
    for p in visible:
        variants = p.get("variants") or []
        stock = sum(int(v.get("stockCount") or 0) for v in variants)
        status = "không bán" if p.get("notForSale") else ("hết hàng" if stock <= 0 else "còn hàng")
        price = next((v.get("price") for v in variants if v.get("price") is not None), None)
        title = p.get("title") or ""
        row = " | ".join([str(p.get("id", "-")), title, str(p.get("brand", "-")),
            str(p.get("flavor", "-")), ",".join(str(x) for x in (p.get("flavorCategory") or [])) or "-",
            str(p.get("nicotine_mg", "-")), str(p.get("format", "-")), str(p.get("portion_count", "-")),
            str(p.get("origin_country", "-")), money(price), str(stock), status])
        rows.append(row)
        attrs = [f"- Link: https://snussaigon.com/{p.get('handle','')}", f"- Trạng thái: {status}",
                 f"- Giá: {money(price)}", f"- Tồn kho: {stock}"]
        for key, label in (("brand", "Thương hiệu"), ("flavor", "Vị"), ("nicotine_mg", "Nicotine mg"),
                           ("format", "Định dạng"), ("portion_count", "Số túi/hộp"), ("origin_country", "Xuất xứ")):
            if p.get(key) not in (None, ""): attrs.append(f"- {label}: {p[key]}")
        chunks.append("## " + title + "\n" + "\n".join(attrs) + "\n\n" + text(p.get("intro")) + "\n" + text(p.get("description")))
    KB.mkdir(exist_ok=True)
    (KB / "catalog_compact.md").write_text("# CATALOG\n" + "\n".join(rows) + "\n", encoding="utf-8")
    (KB / "products.md").write_text("\n\n".join(chunks) + "\n", encoding="utf-8")
    faq_lines = ["# FAQ"] + [f"## {text(x.get('question'))}\n{text(x.get('answer'))}" for x in faqs]
    (KB / "faqs.md").write_text("\n\n".join(faq_lines) + "\n", encoding="utf-8")
    policy_lines = ["# SHOP POLICIES"]
    for x in locations + promotions + shipping + payments + policies:
        title = text(x.get("title") or x.get("name") or x.get("handle") or "Policy")
        policy_lines.append(f"## {title}\n{text(x.get('description') or x.get('notes') or x.get('note') or x)}")
    (KB / "shop_policies.md").write_text("\n\n".join(policy_lines) + "\n", encoding="utf-8")
    print(f"wrote {len(rows)} products, {len(faqs)} FAQs and {len(policies)} policies")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--from-raw", action="store_true", help="reserved for deterministic offline re-rendering")
    parser.parse_args()
    try: scan()
    except Exception as exc:
        print(f"scan failed: {exc}", file=sys.stderr); raise
