import AccountLayout from "@/templates/account-layout";
import LoginTemplate from "@/templates/login-template";
import { payloadSdk } from "@/utils/payload-sdk";
import { Toaster } from "@medusajs/ui";
import { headers as nextHeaders } from "next/headers";

export default async function AccountPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headers = await nextHeaders();
    const { user } =
        (await payloadSdk.me({
            collection: "users",
        })) || {};

    if (user == null) {
        return (
            <div className="flex-1 h-full bg-white max-w-md mx-auto max-h-md py-12">
                <LoginTemplate />
            </div>
        );
    }
    return (
        <AccountLayout>
            {children}
            <Toaster />
        </AccountLayout>
    );
}
