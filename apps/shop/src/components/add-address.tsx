"use client";

import useToggleState from "@/hooks/use-toggle-state";
import { Plus } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";
import { useEffect, useState } from "react";

import Input from "./input";
import Modal from "./modal";
import { SubmitButton } from "./submit-button";

const AddAddress = () => {
    const [successState, setSuccessState] = useState(false);
    const { close: closeModal, open, state } = useToggleState(false);

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

    return (
        <>
            <button
                className="border border-ui-border-base rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
                data-testid="add-address-button"
                onClick={open}
                type="button"
            >
                <span className="text-base-semi">New address</span>
                <Plus />
            </button>

            <Modal close={close} data-testid="add-address-modal" isOpen={state}>
                <Modal.Title>
                    <Heading className="mb-2">Add address</Heading>
                </Modal.Title>
                <form>
                    <Modal.Body>
                        <div className="flex flex-col gap-y-2">
                            <div className="grid grid-cols-2 gap-x-2">
                                <Input
                                    autoComplete="given-name"
                                    data-testid="first-name-input"
                                    label="First name"
                                    name="first_name"
                                    required
                                />
                                <Input
                                    autoComplete="family-name"
                                    data-testid="last-name-input"
                                    label="Last name"
                                    name="last_name"
                                    required
                                />
                            </div>
                            <Input
                                autoComplete="organization"
                                data-testid="company-input"
                                label="Company"
                                name="company"
                            />
                            <Input
                                autoComplete="address-line1"
                                data-testid="address-1-input"
                                label="Address"
                                name="address_1"
                                required
                            />
                            <Input
                                autoComplete="address-line2"
                                data-testid="address-2-input"
                                label="Apartment, suite, etc."
                                name="address_2"
                            />
                            <div className="grid grid-cols-[144px_1fr] gap-x-2">
                                <Input
                                    autoComplete="postal-code"
                                    data-testid="postal-code-input"
                                    label="Postal code"
                                    name="postal_code"
                                    required
                                />
                                <Input
                                    autoComplete="locality"
                                    data-testid="city-input"
                                    label="City"
                                    name="city"
                                    required
                                />
                            </div>
                            <Input
                                autoComplete="address-level1"
                                data-testid="state-input"
                                label="Province / State"
                                name="province"
                            />

                            <Input
                                autoComplete="phone"
                                data-testid="phone-input"
                                label="Phone"
                                name="phone"
                            />
                        </div>
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

export default AddAddress;
