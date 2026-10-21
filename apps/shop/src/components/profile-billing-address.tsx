"use client";

import React, { useActionState, useEffect, useMemo } from "react";

import AccountInfo from "./account-info";
import Input from "./input";
import NativeSelect from "./native-select";

type MyInformationProps = {
    customer: any;
    regions: any[];
};

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
    customer,
    regions,
}) => {
    const regionOptions = useMemo(() => {
        return (
            regions
                ?.map((region) => {
                    return region.countries?.map((country: any) => ({
                        label: country.display_name,
                        value: country.iso_2,
                    }));
                })
                .flat() || []
        );
    }, [regions]);

    const [successState, setSuccessState] = React.useState(false);

    const billingAddress = customer.addresses?.find(
        (addr: any) => addr.is_default_billing
    );

    const initialState: Record<string, any> = {
        error: false,
        isDefaultBilling: true,
        isDefaultShipping: false,
        success: false,
    };

    if (billingAddress) {
        initialState.addressId = billingAddress.id;
    }

    const [state, formAction] = useActionState(
        billingAddress
            ? () => {
                  // TODO: Add logic for updating an existing address
              }
            : () => {
                  // TODO: Add logic for adding a new address
              },
        initialState as any
    );

    const clearState = () => {
        setSuccessState(false);
    };

    useEffect(() => {
        setSuccessState(state.success);
    }, [state]);

    const currentInfo = useMemo(() => {
        if (!billingAddress) {
            return "No billing address";
        }

        const country =
            regionOptions?.find(
                (country) => country?.value === billingAddress.country_code
            )?.label || billingAddress.country_code?.toUpperCase();

        return (
            <div
                className="flex flex-col font-semibold"
                data-testid="current-info"
            >
                <span>
                    {billingAddress.first_name} {billingAddress.last_name}
                </span>
                <span>{billingAddress.company}</span>
                <span>
                    {billingAddress.address_1}
                    {billingAddress.address_2
                        ? `, ${billingAddress.address_2}`
                        : ""}
                </span>
                <span>
                    {billingAddress.postal_code}, {billingAddress.city}
                </span>
                <span>{country}</span>
            </div>
        );
    }, [billingAddress, regionOptions]);

    return (
        <form
            action={formAction}
            className="w-full"
            onReset={() => clearState()}
        >
            <input name="addressId" type="hidden" value={billingAddress?.id} />
            <AccountInfo
                clearState={clearState}
                currentInfo={currentInfo}
                data-testid="account-billing-address-editor"
                isError={!!state.error}
                isSuccess={successState}
                label="Billing address"
            >
                <div className="grid grid-cols-1 gap-y-2">
                    <div className="grid grid-cols-2 gap-x-2">
                        <Input
                            data-testid="billing-first-name-input"
                            defaultValue={
                                billingAddress?.first_name || undefined
                            }
                            label="First name"
                            name="first_name"
                            required
                        />
                        <Input
                            data-testid="billing-last-name-input"
                            defaultValue={
                                billingAddress?.last_name || undefined
                            }
                            label="Last name"
                            name="last_name"
                            required
                        />
                    </div>
                    <Input
                        data-testid="billing-company-input"
                        defaultValue={billingAddress?.company || undefined}
                        label="Company"
                        name="company"
                    />
                    <Input
                        data-testid="billing-address-1-input"
                        defaultValue={billingAddress?.address_1 || undefined}
                        label="Address"
                        name="address_1"
                        required
                    />
                    <Input
                        data-testid="billing-address-2-input"
                        defaultValue={billingAddress?.address_2 || undefined}
                        label="Apartment, suite, etc."
                        name="address_2"
                    />
                    <div className="grid grid-cols-[144px_1fr] gap-x-2">
                        <Input
                            data-testid="billing-postcal-code-input"
                            defaultValue={
                                billingAddress?.postal_code || undefined
                            }
                            label="Postal code"
                            name="postal_code"
                            required
                        />
                        <Input
                            data-testid="billing-city-input"
                            defaultValue={billingAddress?.city || undefined}
                            label="City"
                            name="city"
                            required
                        />
                    </div>
                    <Input
                        data-testid="billing-province-input"
                        defaultValue={billingAddress?.province || undefined}
                        label="Province"
                        name="province"
                    />
                    <NativeSelect
                        data-testid="billing-country-code-select"
                        defaultValue={billingAddress?.country_code || undefined}
                        name="country_code"
                        required
                    >
                        <option value="">-</option>
                        {regionOptions.map((option, i) => {
                            return (
                                <option key={i} value={option?.value}>
                                    {option?.label}
                                </option>
                            );
                        })}
                    </NativeSelect>
                </div>
            </AccountInfo>
        </form>
    );
};

export default ProfileBillingAddress;
