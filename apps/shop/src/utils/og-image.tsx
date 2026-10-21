import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

import { OG_SIZE } from "@/utils/og-url";

/**
 * Khung ảnh OG 1200×630 dùng chung cho route `app/og/product` và `app/og/brand`.
 * Satori (next/og) chỉ nhận inline style → màu hex lấy theo token `--color-saigon-*` trong globals.css.
 */

const COLOR = {
    base: "#0d0d0d", // --color-saigon-base
    red: "#d63d1e", // --color-saigon-red
    grey: "#6b6b6b", // --color-saigon-grey
    soft: "#f5f5f2", // --color-saigon-bg-soft (đường chia 2 cột)
    white: "#ffffff",
};

// Be Vietnam Pro (OFL) — font của site, đủ dấu tiếng Việt. Đọc 1 lần cho mỗi process.
const FONT_DIR = join(process.cwd(), "src/assets/fonts");
let fontsPromise: Promise<{ data: Buffer; name: string; style: "normal"; weight: 400 | 700 }[]> | null = null;
function loadFonts() {
    fontsPromise ??= Promise.all([
        readFile(join(FONT_DIR, "BeVietnamPro-Regular.ttf")),
        readFile(join(FONT_DIR, "BeVietnamPro-Bold.ttf")),
    ])
        .then(([regular, bold]) => [
            { name: "Be Vietnam Pro", data: regular, weight: 400 as const, style: "normal" as const },
            { name: "Be Vietnam Pro", data: bold, weight: 700 as const, style: "normal" as const },
        ])
        .catch((err) => {
            fontsPromise = null; // lần sau đọc lại
            throw err;
        });
    return fontsPromise;
}

/** Encode URL ảnh CDN (tên file có dấu cách…) mà không encode lại phần đã encode. */
function encodeImageUrl(url: string): string {
    try {
        return encodeURI(decodeURI(url));
    } catch {
        return encodeURI(url);
    }
}

export type OgImage = { src: string; width: number; height: number };

/**
 * Tải ảnh và đổi sang PNG data URI (satori không đọc được webp), co vừa khung `box`.
 * Lỗi / timeout → undefined: ảnh OG vẫn ra, chỉ thiếu ảnh.
 */
export async function loadImageDataUri(
    url: string | undefined,
    box: { width: number; height: number },
): Promise<OgImage | undefined> {
    if (!url) return undefined;
    try {
        const res = await fetch(encodeImageUrl(url), { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return undefined;
        const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
            .resize({ ...box, fit: "inside" })
            .png()
            .toBuffer({ resolveWithObject: true });
        return { src: `data:image/png;base64,${data.toString("base64")}`, width: info.width, height: info.height };
    } catch {
        return undefined;
    }
}

const IMAGE_BOX = { width: 520, height: 520 };

export function loadProductImage(url: string | undefined) {
    return loadImageDataUri(url, IMAGE_BOX);
}

/**
 * Bố cục chung: trái = ảnh SP (nền trắng như ảnh gốc); phải = `children` (nội dung riêng từng loại);
 * cuối cột phải = tên miền.
 */
export async function renderOgImage({
    image,
    children,
}: {
    image?: OgImage;
    children: React.ReactNode;
}): Promise<ImageResponse> {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    background: COLOR.white,
                    fontFamily: "Be Vietnam Pro",
                    color: COLOR.base,
                }}
            >
                <div
                    style={{
                        width: 630,
                        height: 630,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: `2px solid ${COLOR.soft}`,
                    }}
                >
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image.src} alt="" width={image.width} height={image.height} />
                    ) : null}
                </div>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "64px 56px 56px",
                        borderTop: `10px solid ${COLOR.red}`,
                    }}
                >
                    {children}
                    <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: COLOR.grey }}>
                        snussaigon.com
                    </div>
                </div>
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: await loadFonts(),
            // URL có ?v=hash dữ liệu → cache 1 ngày là đủ an toàn (mặc định next/og là immutable 1 năm).
            headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
        },
    );
}

export const ogText = {
    // Satori coi Fragment là 1 node xếp ngang → nội dung cột phải phải bọc div cột.
    stack: { display: "flex", flexDirection: "column" as const },
    eyebrow: { fontSize: 28, fontWeight: 700, color: COLOR.red, textTransform: "uppercase" as const, letterSpacing: 1 },
    // Tối đa 3 dòng: cắt bằng maxHeight (lineClamp của satori làm lệch bố cục flex).
    title: (text: string) => {
        const fontSize = text.length > 40 ? 52 : 60;
        return {
            display: "flex",
            fontSize,
            fontWeight: 700,
            lineHeight: 1.15,
            marginTop: 20,
            maxHeight: Math.ceil(fontSize * 1.15 * 3),
            overflow: "hidden" as const,
        };
    },
    price: { display: "flex", alignItems: "baseline", marginTop: 36, fontSize: 56, fontWeight: 700, color: COLOR.red },
    oldPrice: { fontSize: 32, fontWeight: 400, color: COLOR.grey, textDecoration: "line-through", marginLeft: 20 },
};
