import {
    type CountryCode,
    getCountries,
    getCountryCallingCode,
    isSupportedCountry,
    parsePhoneNumberFromString,
} from "libphonenumber-js";

export type CountryOption = {
    iso: CountryCode;
    callingCode: string; // "+84"
    name: string; // "Vietnam" (localized)
    flag: string; // 🇻🇳
};

export type PhoneValue = {
    countryCode: string; // "+84"
    countryIso: string; // "VN"
    phoneRaw: string; // what the customer typed
    phoneE164: string; // "+84901234567" — empty until valid
};

/** Regional-indicator flag emoji from an ISO 3166-1 alpha-2 code. */
function isoToFlag(iso: string): string {
    return iso
        .toUpperCase()
        .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const _cache: Record<string, CountryOption[]> = {};

/** Full list of dialable countries with localized names + flags, sorted A→Z. */
export function getCountryOptions(locale = "en"): CountryOption[] {
    const key = locale === "vi" ? "vi" : "en";
    if (_cache[key]) return _cache[key];

    let displayNames: Intl.DisplayNames | null = null;
    try {
        displayNames = new Intl.DisplayNames([key], { type: "region" });
    } catch {
        displayNames = null;
    }

    const list = getCountries()
        .map((iso): CountryOption | null => {
            let calling = "";
            try {
                calling = getCountryCallingCode(iso);
            } catch {
                return null;
            }
            let name = iso as string;
            try {
                name = displayNames?.of(iso) || iso;
            } catch {
                name = iso;
            }
            return { iso, callingCode: `+${calling}`, name, flag: isoToFlag(iso) };
        })
        .filter((c): c is CountryOption => !!c)
        .sort((a, b) => a.name.localeCompare(b.name));

    _cache[key] = list;
    return list;
}

/** Resolve a default country ISO from the browser locale; fall back to VN. */
export function detectDefaultCountryIso(): CountryCode {
    if (typeof navigator !== "undefined") {
        const langs = [navigator.language, ...(navigator.languages || [])];
        for (const l of langs) {
            const m = /[-_]([A-Za-z]{2})$/.exec(l || "");
            if (m) {
                const iso = m[1].toUpperCase();
                if (isSupportedCountry(iso)) return iso as CountryCode;
            }
        }
    }
    return "VN";
}

/**
 * Normalize a loosely-typed phone number to E.164 using the selected country.
 * - Accepts national format (leading 0 ok), no "+" required.
 * - If input starts with "+", parse as international regardless of country.
 * - isPossible() = plausible length/format (lenient). isValid() = matches an
 *   assigned number plan (strict). We block submit only on impossible numbers.
 */
export function normalizePhone(
    raw: string,
    iso: CountryCode,
): { e164: string | null; isValid: boolean; isPossible: boolean } {
    const input = (raw || "").trim();
    if (!input) return { e164: null, isValid: false, isPossible: false };
    try {
        const pn = parsePhoneNumberFromString(
            input,
            input.startsWith("+") ? undefined : iso,
        );
        if (!pn) return { e164: null, isValid: false, isPossible: false };
        return {
            e164: pn.number,
            isValid: pn.isValid(),
            isPossible: pn.isPossible(),
        };
    } catch {
        return { e164: null, isValid: false, isPossible: false };
    }
}

/** Build the structured value stored on the order. */
export function buildPhoneValue(raw: string, iso: CountryCode): PhoneValue {
    let callingCode = "";
    try {
        callingCode = `+${getCountryCallingCode(iso)}`;
    } catch {
        callingCode = "";
    }
    const { e164 } = normalizePhone(raw, iso);
    return {
        countryCode: callingCode,
        countryIso: iso,
        phoneRaw: raw,
        phoneE164: e164 || "",
    };
}
