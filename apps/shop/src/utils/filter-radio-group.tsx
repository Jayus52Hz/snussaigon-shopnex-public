import { EllipseMiniSolid } from "@medusajs/icons";
import { clx, Label, RadioGroup, Text } from "@medusajs/ui";

type FilterRadioGroupProps = {
    "data-testid"?: string;
    handleChange: (...args: any[]) => void;
    items: {
        label: string;
        value: string;
    }[];
    title: string;
    value: any;
};

const FilterRadioGroup = ({
    "data-testid": dataTestId,
    handleChange,
    items,
    title,
    value,
}: FilterRadioGroupProps) => {
    return (
        <div className="flex gap-x-3 flex-col gap-y-3">
            <Text className="txt-compact-small-plus text-ui-fg-muted">
                {title}
            </Text>
            <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
                {items?.map((i) => (
                    <div
                        className={clx("flex gap-x-2 items-center", {
                            "ml-[-23px]": i.value === value,
                        })}
                        key={i.value}
                    >
                        {i.value === value && <EllipseMiniSolid />}
                        <RadioGroup.Item
                            checked={i.value === value}
                            className="hidden peer"
                            id={i.value}
                            value={i.value}
                        />
                        <Label
                            className={clx(
                                "!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer",
                                {
                                    "text-ui-fg-base": i.value === value,
                                }
                            )}
                            data-active={i.value === value}
                            data-testid="radio-label"
                            htmlFor={i.value}
                        >
                            {i.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterRadioGroup;
