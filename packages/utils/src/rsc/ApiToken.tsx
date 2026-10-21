"use client";

import { PasswordField } from "@payloadcms/ui";
import React from "react";

interface ApiTokenProps {
    field: any;
    path: string;
}

export function ApiToken({ field, path }: ApiTokenProps) {
    return (
        <PasswordField
            autoComplete="new-password"
            field={field}
            indexPath=""
            parentPath=""
            parentSchemaPath=""
            path={path}
            schemaPath="password"
        />
    );
}
