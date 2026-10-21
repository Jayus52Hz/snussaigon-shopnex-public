import { Text } from "@medusajs/ui";

type LineItemOptionsProps = {
    "data-testid"?: string;
    "data-value"?: any;
    variant:
        | {
              options?: { option: string; value: string }[];
              title?: string;
          }
        | undefined;
};

const LineItemOptions = ({
    "data-testid": dataTestid,
    "data-value": dataValue,
    variant,
}: LineItemOptionsProps) => {
    const formattedOptions = variant?.options
        ?.map(({ value }) => value)
        .join(" / ");
    return (
        <div
            className="text-ui-fg-subtle w-full"
            data-testid={dataTestid}
            data-value={dataValue}
        >
            <Text
                className="text-ui-fg-subtle w-full"
                data-testid={dataTestid}
                data-value={dataValue}
            >
                Variants: {formattedOptions}
            </Text>
        </div>
    );
};

export default LineItemOptions;
