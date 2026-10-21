"use client";

import Link from "next/link";
import { useActionState } from "react";

import ErrorMessage from "./error-message";
import Input from "./input";
import { SubmitButton } from "./submit-button";

enum LOGIN_VIEW {
    REGISTER = "register",
    SIGN_IN = "sign-in",
}

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Register = ({ setCurrentView }: Props) => {
    //   const [message, formAction] = useActionState(signup, null)

    return (
        <div
            className="max-w-sm flex flex-col items-center"
            data-testid="register-page"
        >
            <h1 className="text-large-semi uppercase mb-6">
                Đăng Ký Thành Viên SnusSaigon
            </h1>
            <p className="text-center text-base-regular text-ui-fg-base mb-4">
                Tạo hồ sơ thành viên SnusSaigon và nhận trải nghiệm mua sắm
                tốt hơn.
            </p>
            <form className="w-full flex flex-col">
                <div className="flex flex-col w-full gap-y-2">
                    <Input
                        autoComplete="given-name"
                        data-testid="first-name-input"
                        label="Tên"
                        name="first_name"
                        required
                    />
                    <Input
                        autoComplete="family-name"
                        data-testid="last-name-input"
                        label="Họ"
                        name="last_name"
                        required
                    />
                    <Input
                        autoComplete="email"
                        data-testid="email-input"
                        label="Email"
                        name="email"
                        required
                        type="email"
                    />
                    <Input
                        autoComplete="tel"
                        data-testid="phone-input"
                        label="Số điện thoại"
                        name="phone"
                        type="tel"
                    />
                    <Input
                        autoComplete="new-password"
                        data-testid="password-input"
                        label="Mật khẩu"
                        name="password"
                        required
                        type="password"
                    />
                </div>
                {/* <ErrorMessage error={message} data-testid="register-error" /> */}
                <span className="text-center text-ui-fg-base text-small-regular mt-6">
                    Bằng cách tạo tài khoản, bạn đồng ý với{" "}
                    <Link className="underline" href="/content/privacy-policy">
                        Chính Sách Bảo Mật
                    </Link>{" "}
                    and{" "}
                    <Link className="underline" href="/content/terms-of-use">
                        Điều Khoản Sử Dụng
                    </Link>
                    .
                </span>
                <SubmitButton
                    className="w-full mt-6"
                    data-testid="register-button"
                >
                    Đăng ký
                </SubmitButton>
            </form>
            <span className="text-center text-ui-fg-base text-small-regular mt-6">
                Đã có tài khoản?{" "}
                <button
                    className="underline"
                    onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
                >
                    Đăng nhập
                </button>
                .
            </span>
        </div>
    );
};

export default Register;
