"use client";

import type { User } from "@shopnex/types";
import type React from "react";

import { createContext, use, useCallback, useEffect, useState } from "react";

// Generic type for API requests
type APIRequest<T> = (args: T) => Promise<any>;

// Specific API function types
type Create = APIRequest<{
    email: string;
    password: string;
    passwordConfirm: string;
}>;
type ForgotPassword = APIRequest<{ email: string }>;
type Login = APIRequest<{ email: string; password: string }>;
type Logout = () => Promise<void>;
type ResetPassword = APIRequest<{
    password: string;
    passwordConfirm: string;
    token: string;
}>;

export type AuthContextType = {
    create: Create;
    forgotPassword: ForgotPassword;
    login: Login;
    logout: Logout;
    resetPassword: ResetPassword;
    setUser: (user: null | User) => void;
    // Derived status: 'loggedIn' if user exists, else 'loggedOut'
    status: "loggedIn" | "loggedOut";
    updateUser: (updates: Partial<User>) => Promise<void>;
    user: null | User;
};

// Utility function for API calls
const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch ${url}: ${errorText}`);
        }
        return await res.json();
    } catch (err) {
        console.error(err);
        throw new Error(
            err instanceof Error ? err.message : "An unexpected error occurred."
        );
    }
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<null | User>(null);
    // Derived status: if user exists then loggedIn, else loggedOut.
    const status: "loggedIn" | "loggedOut" = user ? "loggedIn" : "loggedOut";

    const create: Create = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(`/api/users/create`, {
            body: JSON.stringify({
                email: args.email,
                password: args.password,
                passwordConfirm: args.passwordConfirm,
            }),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data?.loginUser?.user || null);
    }, []);

    const login: Login = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(`/api/users/login`, {
            body: JSON.stringify({
                email: args.email,
                password: args.password,
            }),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data.user);
        return data.user;
    }, []);

    const updateUser = useCallback(async (updates: Partial<User>) => {
        const data = await fetchWithErrorHandling(
            `/api/users/update/${updates?.id}`,
            {
                body: JSON.stringify(updates),
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                method: "PUT",
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data.user); // Update local state after a successful update
    }, []);

    const logout: Logout = useCallback(async () => {
        const data = await fetchWithErrorHandling(`/api/users/logout`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        // You might check for specific data response if needed.
        setUser(null);
    }, []);

    const forgotPassword: ForgotPassword = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(
            `/api/users/forgot-password`,
            {
                body: JSON.stringify({ email: args.email }),
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                method: "POST",
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        // Optionally update the user if your response includes it:
        setUser(data?.loginUser?.user || null);
    }, []);

    const resetPassword: ResetPassword = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(`/api/users/reset-password`, {
            body: JSON.stringify({
                password: args.password,
                passwordConfirm: args.passwordConfirm,
                token: args.token,
            }),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data?.loginUser?.user || null);
    }, []);

    // Fetch current user on mount
    useEffect(() => {
        let isMounted = true;

        const fetchMe = async () => {
            try {
                const data = await fetchWithErrorHandling(`/api/users/me`, {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    method: "GET",
                });
                if (isMounted) {
                    setUser(data.user || null);
                }
            } catch (e) {
                if (isMounted) {
                    setUser(null);
                }
            }
        };
        void fetchMe();

        // Cleanup if needed when component unmounts
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext
            value={{
                create,
                forgotPassword,
                login,
                logout,
                resetPassword,
                setUser,
                status,
                updateUser,
                user,
            }}
        >
            {children}
        </AuthContext>
    );
};

export const useAuth = () => use(AuthContext);
