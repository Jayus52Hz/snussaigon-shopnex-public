import crypto from "crypto";

type TokenPayload = string;
type EncryptedData = {
    content: string;
    iv: string;
    tag: string;
};

const getKey = (rawKey: string): Buffer => {
    return crypto.createHash("sha256").update(rawKey).digest();
};

export const encryptToken = (token: TokenPayload): string => {
    const key = getKey(process.env.ENCRYPTION_KEY!);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([
        cipher.update(token, "utf8"),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    const result: EncryptedData = {
        content: encrypted.toString("hex"),
        iv: iv.toString("hex"),
        tag: tag.toString("hex"),
    };

    return Buffer.from(JSON.stringify(result)).toString("base64");
};

export const decryptToken = (encryptedToken: string): string => {
    if (!encryptedToken) {
        throw new Error("Encrypted token cannot be null or empty");
    }

    const key = getKey(process.env.ENCRYPTION_KEY!);

    try {
        const decoded = JSON.parse(
            Buffer.from(encryptedToken, "base64").toString("utf8")
        ) as EncryptedData;

        const iv = Buffer.from(decoded.iv, "hex");
        const tag = Buffer.from(decoded.tag, "hex");
        const content = Buffer.from(decoded.content, "hex");

        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([
            decipher.update(content),
            decipher.final(),
        ]);

        return decrypted.toString("utf8");
    } catch (error: any) {
        throw new Error(`Failed to decrypt token: ${error.message}`);
    }
};
