import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";

import Input from "./input";
import { SubmitButton } from "./submit-button";

enum LOGIN_VIEW {
    REGISTER = "register",
    SIGN_IN = "sign-in",
}

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as {
            email: string;
            password: string;
        };
        await login(data);
        router.refresh();
    };

    return (
        <div
            className="max-w-sm w-full flex flex-col items-center"
            data-testid="login-page"
        >
            <h1 className="text-large-semi uppercase mb-6">Chào mừng trở lại</h1>
            <p className="text-center text-base-regular text-ui-fg-base mb-8">
                Đăng nhập để truy cập trải nghiệm mua sắm nâng cao.
            </p>
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full gap-y-2">
                    <Input
                        autoComplete="email"
                        data-testid="email-input"
                        label="Email"
                        name="email"
                        required
                        title="Enter a valid email address."
                        type="email"
                    />
                    <Input
                        autoComplete="current-password"
                        data-testid="password-input"
                        label="Mật khẩu"
                        name="password"
                        required
                        type="password"
                    />
                </div>
                {/* <ErrorMessage error={message} data-testid="login-error-message" /> */}
                <SubmitButton
                    className="w-full mt-6"
                    data-testid="sign-in-button"
                >
                    Đăng nhập
                </SubmitButton>
            </form>
            <span className="text-center text-ui-fg-base text-small-regular mt-6">
                Chưa có tài khoản?{" "}
                <button
                    className="underline"
                    data-testid="register-button"
                    onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
                >
                    Đăng ký ngay
                </button>
                .
            </span>
        </div>
    );
};

export default Login;
