import type React from "react";

import AccountNav from "@/components/account-nav";
import InteractiveLink from "@/components/interactive-link";

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
    return (
        <div className="flex-1 small:py-12" data-testid="account-page">
            <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
                <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
                    <div>
                        <AccountNav />
                    </div>
                    <div className="flex-1">{children}</div>
                </div>
                <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
                    <div>
                        <h3 className="text-xl-semi mb-4">Bạn có câu hỏi?</h3>
                        <span className="txt-medium">
                            Bạn có thể tìm thấy câu hỏi thường gặp và câu trả lời
                            trên trang dịch vụ khách hàng của chúng tôi.
                        </span>
                    </div>
                    <div>
                        <InteractiveLink href="/customer-service">
                            Dịch Vụ Khách Hàng
                        </InteractiveLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;
