"use client";

import type { User } from "@shopnex/types";

import React, { useActionState, useEffect } from "react";

import AccountInfo from "../account-info";
import Input from "../input";

type MyInformationProps = {
    customer: User;
};

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
    const [successState, setSuccessState] = React.useState(false);

    // TODO: It seems we don't support updating emails now?
    const updateCustomerEmail = (
        _currentState: Record<string, unknown>,
        formData: FormData
    ) => {
        const customer = {
            email: formData.get("email") as string,
        };

        try {
            // await updateCustomer(customer)
            return { error: null, success: true };
        } catch (error: any) {
            console.error(error);
            return { error: error.toString(), success: false };
        }
    };

    const [state, formAction] = useActionState(updateCustomerEmail, {
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
        <form action={formAction} className="w-full">
            <AccountInfo
                clearState={clearState}
                currentInfo={`${customer.email}`}
                data-testid="account-email-editor"
                errorMessage={state.error}
                isError={!!state.error}
                isSuccess={successState}
                label="Email"
            >
                <div className="grid grid-cols-1 gap-y-2">
                    <Input
                        autoComplete="email"
                        data-testid="email-input"
                        defaultValue={customer.email}
                        label="Email"
                        name="email"
                        required
                        type="email"
                    />
                </div>
            </AccountInfo>
        </form>
    );
};

export default ProfileEmail;
