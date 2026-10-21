import useToggleState from "@/hooks/use-toggle-state";
import { Disclosure } from "@headlessui/react";
import { Badge, Button, clx } from "@medusajs/ui";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

type AccountInfoProps = {
    children?: React.ReactNode;
    clearState: () => void;
    currentInfo: React.ReactNode | string;
    "data-testid"?: string;
    errorMessage?: string;
    isError?: boolean;
    isSuccess?: boolean;
    label: string;
};

const AccountInfo = ({
    children,
    clearState,
    currentInfo,
    "data-testid": dataTestid,
    errorMessage = "An error occurred, please try again",
    isError,
    isSuccess,
    label,
}: AccountInfoProps) => {
    const { close, state, toggle } = useToggleState();

    const { pending } = useFormStatus();

    const handleToggle = () => {
        clearState();
        setTimeout(() => toggle(), 100);
    };

    useEffect(() => {
        if (isSuccess) {
            close();
        }
    }, [isSuccess, close]);

    return (
        <div className="text-small-regular" data-testid={dataTestid}>
            <div className="flex items-end justify-between">
                <div className="flex flex-col">
                    <span className="uppercase text-ui-fg-base">{label}</span>
                    <div className="flex items-center flex-1 basis-0 justify-start gap-x-4">
                        {typeof currentInfo === "string" ? (
                            <span
                                className="font-semibold"
                                data-testid="current-info"
                            >
                                {currentInfo}
                            </span>
                        ) : (
                            currentInfo
                        )}
                    </div>
                </div>
                <div>
                    <Button
                        className="w-[100px] min-h-[25px] py-1"
                        data-active={state}
                        data-testid="edit-button"
                        onClick={handleToggle}
                        type={state ? "reset" : "button"}
                        variant="secondary"
                    >
                        {state ? "Cancel" : "Edit"}
                    </Button>
                </div>
            </div>

            {/* Success state */}
            <Disclosure>
                <Disclosure.Panel
                    className={clx(
                        "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
                        {
                            "max-h-[1000px] opacity-100": isSuccess,
                            "max-h-0 opacity-0": !isSuccess,
                        }
                    )}
                    data-testid="success-message"
                    static
                >
                    <Badge className="p-2 my-4" color="green">
                        <span>{label} updated successfully</span>
                    </Badge>
                </Disclosure.Panel>
            </Disclosure>

            {/* Error state  */}
            <Disclosure>
                <Disclosure.Panel
                    className={clx(
                        "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
                        {
                            "max-h-[1000px] opacity-100": isError,
                            "max-h-0 opacity-0": !isError,
                        }
                    )}
                    data-testid="error-message"
                    static
                >
                    <Badge className="p-2 my-4" color="red">
                        <span>{errorMessage}</span>
                    </Badge>
                </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
                <Disclosure.Panel
                    className={clx(
                        "transition-[max-height,opacity] duration-300 ease-in-out overflow-visible",
                        {
                            "max-h-[1000px] opacity-100": state,
                            "max-h-0 opacity-0": !state,
                        }
                    )}
                    static
                >
                    <div className="flex flex-col gap-y-2 py-4">
                        <div>{children}</div>
                        <div className="flex items-center justify-end mt-2">
                            <Button
                                className="w-full small:max-w-[140px]"
                                data-testid="save-button"
                                isLoading={pending}
                                type="submit"
                            >
                                Save changes
                            </Button>
                        </div>
                    </div>
                </Disclosure.Panel>
            </Disclosure>
        </div>
    );
};

export default AccountInfo;
