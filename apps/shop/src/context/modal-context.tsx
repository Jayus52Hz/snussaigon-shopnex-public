"use client";

import React, { createContext, use } from "react";

interface ModalContext {
    close: () => void;
}

const ModalContext = createContext<ModalContext | null>(null);

interface ModalProviderProps {
    children?: React.ReactNode;
    close: () => void;
}

export const ModalProvider = ({ children, close }: ModalProviderProps) => {
    return (
        <ModalContext
            value={{
                close,
            }}
        >
            {children}
        </ModalContext>
    );
};

export const useModal = () => {
    const context = use(ModalContext);
    if (context === null) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
