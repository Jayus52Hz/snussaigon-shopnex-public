"use client";

import ProfileEmail from "@/components/profile/email";
import ProfileName from "@/components/profile/name";
import ProfilePhone from "@/components/profile/phone";
import ProfileBillingAddress from "@/components/profile-billing-address";
import { useAuth } from "@/providers/auth";

export default function Profile() {
    const { updateUser, user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="w-full" data-testid="profile-page-wrapper">
            <div className="mb-8 flex flex-col gap-y-4">
                <h1 className="text-2xl-semi">Profile</h1>
                <p className="text-base-regular">
                    View and update your profile information, including your
                    name, email, and phone number. You can also update your
                    billing address, or change your password.
                </p>
            </div>
            <div className="flex flex-col gap-y-8 w-full">
                <ProfileName
                    customer={user as any}
                    updateCustomer={updateUser}
                />
                <Divider />
                <ProfileEmail customer={user} />
                <Divider />
                <ProfilePhone customer={user} />
                <Divider />

                <ProfileBillingAddress customer={user} regions={[]} />
            </div>
        </div>
    );
}

const Divider = () => {
    return <div className="w-full h-px bg-gray-200" />;
};
