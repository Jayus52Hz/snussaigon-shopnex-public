"use client";

import type {
    KBarOptions} from "kbar";

import {
    KBarAnimator,
    KBarPortal,
    KBarPositioner,
    KBarProvider,
    KBarResults,
    KBarSearch,
    useMatches
} from "kbar";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import "./CommandBar.scss";

import type { PluginHooks, QuickAction } from "../../types";

function RenderResults() {
    const { results } = useMatches();
    return (
        <div className={"popup-button-list action-button-list"}>
            <KBarResults
                items={results}
                onRender={({ active, item }) => {
                    if (typeof item === "string") {
                        return (
                            <div className="group-title" key={item}>
                                {item}
                            </div>
                        );
                    }

                    return (
                        <div
                            aria-selected={active}
                            className={`action-button ${active ? "active" : ""}`}
                            key={item.id}
                            role="option"
                        >
                            {item.icon && (
                                <span
                                    aria-hidden="true"
                                    className="action-icon"
                                >
                                    {item.icon}
                                </span>
                            )}
                            <span className="action-name">{item.name}</span>
                            {item.subtitle && (
                                <span className="action-subtitle">
                                    {item.subtitle}
                                </span>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}

type CommandBarProps = {
    actions: QuickAction[];
    children: React.ReactNode;
    hooks?: PluginHooks;
    kbarOptions?: KBarOptions;
};

const baseClass = "CommandBar";

export function CommandBar({
    actions,
    children,
    hooks,
    kbarOptions,
}: CommandBarProps) {
    const router = useRouter();

    const handleActionPerform = useCallback(
        async (action: QuickAction) => {
            try {
                if (hooks?.onActionExecute) {
                    await hooks.onActionExecute(action);
                }

                if (action.link) {
                    router.push(action.link);
                }
            } catch (error) {
                console.error("Error executing action:", error);
            }
        },
        [hooks, router]
    );

    const allActions = actions.map((action) => ({
        ...action,
        perform: () => handleActionPerform(action),
    }));

    return (
        <KBarProvider actions={allActions} options={kbarOptions}>
            <KBarPortal>
                <KBarPositioner className={baseClass}>
                    <KBarAnimator className={`${baseClass}__animator`}>
                        <div className="list-controls__wrapper">
                            <Search />
                            <KBarSearch
                                className={"search-filter__input"}
                                placeholder="Search..."
                            />
                        </div>
                        <RenderResults />
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
            {children}
        </KBarProvider>
    );
}
