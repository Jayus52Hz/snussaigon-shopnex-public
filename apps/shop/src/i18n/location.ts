/**
 * Server-only selected-location helpers.
 *
 * Pure helpers + constants live in `location-constants.ts` and are
 * re-exported below, so any module previously using `@/i18n/location` for
 * `LOCATION_COOKIE` / `locationWhereClause` / `locationManyWhereClause`
 * keeps working. Anything that needs `getSelectedLocation()` MUST stay in
 * a Server Component / Route Handler context.
 */

import { cookies } from "next/headers";

export {
    LOCATION_COOKIE,
    locationManyWhereClause,
    locationWhereClause,
} from "./location-constants";

/**
 * Read the user's currently-selected store location from the request cookie.
 * Returns `null` when no location is selected — services should fall back
 * to all/unfiltered content in that case.
 *
 * Use only in Server Components / route handlers (relies on `next/headers`).
 */
export async function getSelectedLocation(): Promise<null | string> {
    try {
        const cookieStore = await cookies();
        const value = cookieStore.get("selected-location")?.value;
        return value && value.length > 0 ? value : null;
    } catch {
        return null;
    }
}
