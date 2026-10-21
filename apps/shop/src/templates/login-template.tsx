"use client";

import Login from "@/components/login";
import Register from "@/components/register";
import { useState } from "react";

const LoginTemplate = () => {
    const [currentView, setCurrentView] = useState("sign-in");

    return (
        <div className="w-full flex justify-start px-8 py-8">
            {currentView === "sign-in" ? (
                <Login setCurrentView={setCurrentView} />
            ) : (
                <Register setCurrentView={setCurrentView} />
            )}
        </div>
    );
};

export default LoginTemplate;
