"use client";

import { Button, Pill } from "@payloadcms/ui";
import { useKBar } from "kbar";

import "./QuickActions.scss";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const baseClass = "quick-actions";

export const QuickActions = ({ position }: { position: "actions" }) => {
    const { query } = useKBar();
    const [shortcutKey, setShortcutKey] = useState("Ctrl");

    useEffect(() => {
        const isMac =
            typeof window !== "undefined" && /Mac/i.test(navigator.platform);
        setShortcutKey(isMac ? "⌘" : "Ctrl");
    }, []);

    return (
        <Button
            buttonStyle="none"
            className={`${baseClass} position-${position}`}
            onClick={() => query.toggle()}
        >
            <div className="quick-actions__wrap">
                <Search size={24} />
                <input
                    className="search-filter__input"
                    placeholder="Search..."
                    type="text"
                />
                <Pill className="shortcut-key">{shortcutKey} + K</Pill>
            </div>
        </Button>
    );
};
