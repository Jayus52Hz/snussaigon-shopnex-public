import { parseCookies } from "payload";
import { isNumber } from "payload/shared";

/**
 * A function that takes request headers and an idType and returns the current tenant ID from the cookie
 *
 * @param headers Headers, usually derived from req.headers or next/headers
 * @returns string | number | null
 */
export function getTenantFromCookie(headers: Headers): null | number {
    const cookies = parseCookies(headers);
    const selectedTenant = cookies.get("payload-tenant") || null;
    return selectedTenant ? parseFloat(selectedTenant) : null;
}
