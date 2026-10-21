import type React from "react";

import { clx } from "@medusajs/ui";

type OptionSelectProps = {
    "data-testid"?: string;
    disabled?: boolean;
    optionName: string;
    options: string;
    optionValue: string[];
    title: string;
    updateOption: (option: string, value: string) => void;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
    "data-testid": dataTestId,
    disabled,
    optionName,
    options,
    optionValue,
    title,
    updateOption,
}) => {
    return (
        <div className="flex flex-col gap-y-3">
            <span className="text-sm">Select {title}</span>
            <div
                className="flex flex-wrap justify-between gap-2"
                data-testid={dataTestId}
            >
                {optionValue.map((value: string) => (
                    <button
                        className={clx(
                            "border border-ui-border-base bg-ui-bg-subtle text-small-regular rounded p-2 flex-1",
                            {
                                "border-ui-border-interactive":
                                    options === value,
                                "hover:shadow-elevation-card-rest transition-shadow duration-150":
                                    options !== value,
                            }
                        )}
                        data-testid="option-button"
                        disabled={disabled}
                        key={value}
                        onClick={() => updateOption(optionName, value)}
                        type="button"
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OptionSelect;
