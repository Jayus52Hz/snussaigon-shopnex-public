"use client";

import type React from "react";

import useToggleState from "@/hooks/use-toggle-state";
import { PencilSquare as Edit, Trash } from "@medusajs/icons";
import { Button, clx, Heading, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";

import Spinner from "./icons/spinner";
import Input from "./input";
import Modal from "./modal";
import { SubmitButton } from "./submit-button";

type EditAddressProps = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    address: any;
    isActive?: boolean;
};

const EditAddress: React.FC<EditAddressProps> = ({
    address,
    isActive = false,
}) => {
    const [removing, setRemoving] = useState(false);
    const [successState, setSuccessState] = useState(false);
    const { close: closeModal, open, state } = useToggleState(false);

    //   const [formState, formAction] = useActionState(updateCustomerAddress, {
    //     success: false,
    //     error: null,
    //     addressId: address.id,
    //   })

    const close = () => {
        setSuccessState(false);
        closeModal();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (successState) {
            close();
        }
    }, [successState]);

    //   useEffect(() => {
    //     if (formState.success) {
    //       setSuccessState(true)
    //     }
    //   }, [formState])

    const removeAddress = () => {
        setRemoving(true);
        // await deleteCustomerAddress(address.id)
        setRemoving(false);
    };

    return (
        <>
            <div
                className={clx(
                    "border rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors",
                    {
                        "border-gray-900": isActive,
                    }
                )}
                data-testid="address-container"
            >
                <div className="flex flex-col">
                    <Heading
                        className="text-left text-base-semi"
                        data-testid="address-name"
                    >
                        {address.first_name} {address.last_name}
                    </Heading>
                    {address.company && (
                        <Text
                            className="txt-compact-small text-ui-fg-base"
                            data-testid="address-company"
                        >
                            {address.company}
                        </Text>
                    )}
                    <Text className="flex flex-col text-left text-base-regular mt-2">
                        <span data-testid="address-address">
                            {address.address_1}
                            {address.address_2 && (
                                <span>, {address.address_2}</span>
                            )}
                        </span>
                        <span data-testid="address-postal-city">
                            {address.postal_code}, {address.city}
                        </span>
                        <span data-testid="address-province-country">
                            {address.province && `${address.province}, `}
                            {address.country_code?.toUpperCase()}
                        </span>
                    </Text>
                </div>
                <div className="flex items-center gap-x-4">
                    <button
                        className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
                        data-testid="address-edit-button"
                        onClick={open}
                        type="button"
                    >
                        <Edit />
                        Edit
                    </button>
                    <button
                        className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
                        data-testid="address-delete-button"
                        onClick={removeAddress}
                        type="button"
                    >
                        {removing ? <Spinner /> : <Trash />}
                        Remove
                    </button>
                </div>
            </div>

            <Modal
                close={close}
                data-testid="edit-address-modal"
                isOpen={state}
            >
                <Modal.Title>
                    <Heading className="mb-2">Edit address</Heading>
                </Modal.Title>
                <form>
                    <input name="addressId" type="hidden" value={address.id} />
                    <Modal.Body>
                        <div className="grid grid-cols-1 gap-y-2">
                            <div className="grid grid-cols-2 gap-x-2">
                                <Input
                                    autoComplete="given-name"
                                    data-testid="first-name-input"
                                    defaultValue={
                                        address.first_name || undefined
                                    }
                                    label="First name"
                                    name="first_name"
                                    required
                                />
                                <Input
                                    autoComplete="family-name"
                                    data-testid="last-name-input"
                                    defaultValue={
                                        address.last_name || undefined
                                    }
                                    label="Last name"
                                    name="last_name"
                                    required
                                />
                            </div>
                            <Input
                                autoComplete="organization"
                                data-testid="company-input"
                                defaultValue={address.company || undefined}
                                label="Company"
                                name="company"
                            />
                            <Input
                                autoComplete="address-line1"
                                data-testid="address-1-input"
                                defaultValue={address.address_1 || undefined}
                                label="Address"
                                name="address_1"
                                required
                            />
                            <Input
                                autoComplete="address-line2"
                                data-testid="address-2-input"
                                defaultValue={address.address_2 || undefined}
                                label="Apartment, suite, etc."
                                name="address_2"
                            />
                            <div className="grid grid-cols-[144px_1fr] gap-x-2">
                                <Input
                                    autoComplete="postal-code"
                                    data-testid="postal-code-input"
                                    defaultValue={
                                        address.postal_code || undefined
                                    }
                                    label="Postal code"
                                    name="postal_code"
                                    required
                                />
                                <Input
                                    autoComplete="locality"
                                    data-testid="city-input"
                                    defaultValue={address.city || undefined}
                                    label="City"
                                    name="city"
                                    required
                                />
                            </div>
                            <Input
                                autoComplete="address-level1"
                                data-testid="state-input"
                                defaultValue={address.province || undefined}
                                label="Province / State"
                                name="province"
                            />
                            {/* <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              /> */}
                            <Input
                                autoComplete="phone"
                                data-testid="phone-input"
                                defaultValue={address.phone || undefined}
                                label="Phone"
                                name="phone"
                            />
                        </div>
                        {/* {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">{formState.error}</div>
            )} */}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex gap-3 mt-6">
                            <Button
                                className="h-10"
                                data-testid="cancel-button"
                                onClick={close}
                                type="reset"
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                            <SubmitButton data-testid="save-button">
                                Save
                            </SubmitButton>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default EditAddress;
