import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";

type StyledRichTextProps = {
    data?: null | SerializedEditorState;
    properties?: {
        [key: string]: number | string;
    };
};

const createJSXConverters =
    (
        properties: StyledRichTextProps["properties"]
    ): JSXConvertersFunction<DefaultNodeTypes> =>
    ({ defaultConverters }) => ({
        ...defaultConverters,
        link: ({ node, nodesToJSX }) => {
            if (node.fields?.linkType === "custom") {
                return (
                    <Link
                        className="hover:underline"
                        href={`${node.fields.url}`}
                    >
                        {nodesToJSX({ nodes: node.children })}
                    </Link>
                );
            }
        },
        paragraph: ({ node, nodesToJSX }) => {
            let children = nodesToJSX({ nodes: node.children });

            if (properties) {
                children = children.map((child) => {
                    if (typeof child === "string") {
                        return Object.entries(properties).reduce(
                            (updatedChild, [key, value]) =>
                                updatedChild.replace(
                                    new RegExp(`{{${key}}}`, "g"),
                                    value.toString()
                                ),
                            child
                        );
                    }
                    return child;
                });
            }

            return <p>{children.length ? children : <br />}</p>;
        },
    });

export const StyledRichText = ({ data, properties }: StyledRichTextProps) => {
    if (!data) {
        return null;
    }

    return (
        <RichText converters={createJSXConverters(properties)} data={data} />
    );
};
