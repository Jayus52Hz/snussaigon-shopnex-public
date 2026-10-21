import { IMAGE_REMOTE_PATTERNS } from "./image-hosts";

// Dịch vụ ảnh tạm (placeholder) — coi như chưa có ảnh.
const PLACEHOLDER_HOSTS = ["placehold.co", "via.placeholder.com", "placehold.it", "dummyimage.com"];

/**
 * URL ảnh dùng được để hiển thị, hoặc undefined nếu: rỗng, là ảnh tạm
 * (placehold.co…), hoặc host không nằm trong IMAGE_REMOTE_PATTERNS
 * (next/image sẽ báo lỗi / ảnh vỡ). Path tương đối ("/...") luôn dùng được.
 * Nơi gọi hiện khung mặc định khi nhận undefined.
 */
export function usableImageUrl(url: null | string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith("/") && !url.startsWith("//")) return url;
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return undefined;
    }
    const host = parsed.hostname.toLowerCase();
    if (PLACEHOLDER_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return undefined;
    const protocol = parsed.protocol.replace(":", "");
    const allowed = IMAGE_REMOTE_PATTERNS.some((p) => p.protocol === protocol && p.hostname === host);
    return allowed ? url : undefined;
}
