import type { FieldHook, TextField } from "payload";

const encryptKey: FieldHook = ({ req, value }) =>
    value ? req.payload.encrypt(value as string) : undefined;
const decryptKey: FieldHook = ({ req, value }) =>
    value ? req.payload.decrypt(value as string) : undefined;

export const EncryptedField = (textFieldOverrides: TextField): TextField => {
    return {
        ...(textFieldOverrides ?? {}),
        admin: {
            ...(textFieldOverrides?.admin ?? {}),
            components: {
                Field: "@shopnex/utils/rsc#ApiToken",
            },
        },
        hooks: {
            ...(textFieldOverrides?.hooks ?? {}),
            afterRead: [decryptKey],
            beforeChange: [encryptKey],
        },
    };
};
