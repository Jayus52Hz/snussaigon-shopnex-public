"use client";

import type { Dictionary, Locale } from "./dictionaries";
import { dictionaries } from "./dictionaries";
import { createContext, useContext } from "react";

interface LocaleContextValue {
    dict: Dictionary;
    locale: Locale;
}

const LocaleContext = createContext<LocaleContextValue>({
    dict: dictionaries.vi,
    locale: "vi",
});

export function LocaleProvider({
    children,
    locale,
}: {
    children: React.ReactNode;
    locale: Locale;
}) {
    return (
        <LocaleContext.Provider
            value={{ dict: dictionaries[locale], locale }}
        >
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}

export function useT() {
    const { dict } = useContext(LocaleContext);
    return dict;
}
