"use client";

import type { User } from "@shopnex/types";

import React, { useActionState, useEffect } from "react";

import AccountInfo from "../account-info";
import Input from "../input";

type MyInformationProps = {
    customer: User;
    updateCustomer: (customer: User) => void;
};

const ProfileName: React.FC<MyInformationProps> = ({
    customer,
    updateCustomer,
}) => {
    const [successState, setSuccessState] = React.useState(false);

    const updateCustomerName = (
        _currentState: Record<string, unknown>,
        formData: FormData
    ) => {
        const updatedCustomer = {
            ...customer,
            firstName: formData.get("first_name") as string,
            lastName: formData.get("last_name") as string,
        };

        try {
            // updateCustomer(updatedCustomer)
            return { error: null, success: true };
        } catch (error: any) {
            console.error(error);
            return { error: error.toString(), success: false };
        }
    };

    const [state, formAction] = useActionState(updateCustomerName, {
        error: false,
        success: false,
    });

    const clearState = () => {
        setSuccessState(false);
    };

    useEffect(() => {
        setSuccessState(state.success);
    }, [state]);

    return (
        <form action={formAction} className="w-full overflow-visible">
            <AccountInfo
                clearState={clearState}
                currentInfo={`${(customer as any).firstName} ${(customer as any).lastName}`}
                data-testid="account-name-editor"
                isError={!!state?.error}
                isSuccess={successState}
                label="Name"
            >
                <div className="grid grid-cols-2 gap-x-4">
                    <Input
                        data-testid="first-name-input"
                        defaultValue={(customer as any).firstName ?? ""}
                        label="First name"
                        name="first_name"
                        required
                    />
                    <Input
                        data-testid="last-name-input"
                        defaultValue={(customer as any).lastName ?? ""}
                        label="Last name"
                        name="last_name"
                        required
                    />
                </div>
            </AccountInfo>
        </form>
    );
};

export default ProfileName;
