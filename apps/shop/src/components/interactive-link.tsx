import { ArrowUpRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import Link from "next/link";

type InteractiveLinkProps = {
    children?: React.ReactNode;
    href: string;
    onClick?: () => void;
};

const InteractiveLink = ({
    children,
    href,
    onClick,
    ...props
}: InteractiveLinkProps) => {
    return (
        <Link
            className="flex gap-x-1 items-center group"
            href={href}
            onClick={onClick}
            {...props}
        >
            <Text className="text-ui-fg-interactive">{children}</Text>
            <ArrowUpRightMini
                className="group-hover:rotate-45 ease-in-out duration-150"
                color="var(--fg-interactive)"
            />
        </Link>
    );
};

export default InteractiveLink;
