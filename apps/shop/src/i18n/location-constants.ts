/**
 * Client-safe location helpers — constants + pure functions that DO NOT
 * import `next/headers`, so they're free to be reached from Client
 * Components (or from server modules that any client transitively imports).
 *
 * The actual cookie reader lives in `location.ts` (server-only).
 */

export const LOCATION_COOKIE = "selected-location";

/**
 * Build a Payload `where` clause that filters docs by either:
 *  - having `location` equal to the selected location, OR
 *  - having no `location` set at all (treated as "applies everywhere")
 *
 * Pass the locationId returned by `getSelectedLocation()`. When locationId
 * is null/undefined the clause returns `undefined` so callers can spread it
 * without affecting the query.
 */
export function locationWhereClause(
    locationId: null | string | undefined,
    fieldName = "location"
) {
    if (!locationId) return undefined;
    return {
        or: [
            { [fieldName]: { equals: locationId } },
            { [fieldName]: { exists: false } },
        ],
    };
}

/**
 * Variant of `locationWhereClause` for collections where the location field
 * is `hasMany: true` (e.g. Products — sold at multiple stores). Uses Payload
 * `in` operator which on hasMany relationships matches when any of the
 * referenced IDs equals the provided value.
 */
export function locationManyWhereClause(
    locationId: null | string | undefined,
    fieldName = "locations"
) {
    if (!locationId) return undefined;
    return {
        or: [
            { [fieldName]: { in: [locationId] } },
            { [fieldName]: { exists: false } },
        ],
    };
}
