"use client";

import { type CountryCode } from "libphonenumber-js";
import { AlertCircle, BellRing, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import PhoneInput from "@/components/phone-input";
import { cn } from "@/utils";
import { buildPhoneValue, detectDefaultCountryIso, normalizePhone } from "@/utils/phone";

/** "Báo tôi khi có hàng" — trang chi tiết sản phẩm hết hàng (không áp dụng cho "Chưa kinh doanh"). */
export default function RestockNotifyForm({ productId, locale }: { productId: number | string; locale: string }) {
    const isEn = locale === "en";
    const contactOptions = [
        { value: "call", label: isEn ? "Phone Call" : "Gọi điện thoại" },
        { value: "zalo", label: "Zalo" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "messenger", label: "Messenger" },
    ];

    const [phoneIso, setPhoneIso] = useState<CountryCode>("VN");
    const [phoneRaw, setPhoneRaw] = useState("");
    const [phoneCountryTouched, setPhoneCountryTouched] = useState(false);
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [contactMethod, setContactMethod] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!phoneCountryTouched) setPhoneIso(detectDefaultCountryIso());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const phone = buildPhoneValue(phoneRaw, phoneIso);
        const { isPossible } = normalizePhone(phoneRaw, phoneIso);
        if (!isPossible || !phone.phoneE164) {
            setPhoneInvalid(true);
            return;
        }
        if (!contactMethod) {
            setError(isEn ? "Please choose a contact method." : "Vui lòng chọn kênh liên lạc.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${window.location.origin}/api/restock-requests/notify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    phone: phone.phoneE164,
                    phoneRaw: phone.phoneRaw,
                    countryIso: phone.countryIso,
                    contactMethod,
                    locale,
                }),
            });
            if (res.ok) {
                setSuccess(true);
                return;
            }
            setError(
                res.status === 429
                    ? isEn
                        ? "Too many requests. Please try again later."
                        : "Bạn gửi quá nhiều lần. Vui lòng thử lại sau."
                    : isEn
                      ? "Could not send your request. Please try again."
                      : "Không gửi được yêu cầu. Vui lòng thử lại."
            );
        } catch {
            setError(isEn ? "Could not send your request. Please try again." : "Không gửi được yêu cầu. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div
                className="mt-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                data-component="restock-notify-success"
                role="status"
            >
                <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0" />
                <p>
                    {isEn
                        ? "Thank you for your interest in this product at Snus Sai Gon. We will contact you as soon as possible."
                        : "Cảm ơn bạn đã quan tâm đến sản phẩm tại Snus Sai Gon, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất có thể"}
                </p>
            </div>
        );
    }

    return (
        <form
            className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
            data-component="restock-notify-form"
            noValidate
            onSubmit={handleSubmit}
        >
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <BellRing className="size-4 flex-shrink-0" />
                {isEn ? "Notify me when available" : "Báo tôi khi có hàng"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
                {isEn
                    ? "Leave your phone number and we'll let you know when this product is back in stock."
                    : "Để lại số điện thoại, chúng tôi sẽ báo bạn khi sản phẩm có hàng trở lại."}
            </p>

            <div className="mt-3">
                <label className="mb-1.5 block text-sm font-medium" htmlFor="restock-phone">
                    {isEn ? "Phone Number *" : "Số điện thoại *"}
                </label>
                <PhoneInput
                    id="restock-phone"
                    invalid={phoneInvalid}
                    iso={phoneIso}
                    locale={locale}
                    onChange={({ iso, raw }) => {
                        if (iso !== phoneIso) setPhoneCountryTouched(true);
                        setPhoneIso(iso);
                        setPhoneRaw(raw);
                        if (phoneInvalid) setPhoneInvalid(false);
                    }}
                    placeholder={isEn ? "Phone number" : "Số điện thoại"}
                    rawValue={phoneRaw}
                />
                {phoneInvalid && (
                    <p className="mt-1.5 text-xs text-red-500">
                        {isEn ? "Please enter a valid phone number." : "Vui lòng nhập số điện thoại hợp lệ."}
                    </p>
                )}
            </div>

            <fieldset className="mt-3">
                <legend className="mb-2 block text-sm font-medium">
                    {isEn ? "Preferred contact method?" : "Bạn muốn được liên hệ qua?"}
                </legend>
                <div className="grid grid-cols-2 gap-2">
                    {contactOptions.map((opt) => (
                        <label
                            className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2.5 text-sm transition-colors",
                                contactMethod === opt.value
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:bg-gray-50"
                            )}
                            key={opt.value}
                        >
                            <input
                                checked={contactMethod === opt.value}
                                className="sr-only"
                                name="restockContactMethod"
                                onChange={() => {
                                    setContactMethod(opt.value);
                                    setError("");
                                }}
                                type="radio"
                                value={opt.value}
                            />
                            <div
                                className={cn(
                                    "flex size-4 flex-shrink-0 items-center justify-center rounded-full border-2",
                                    contactMethod === opt.value ? "border-blue-500" : "border-gray-300"
                                )}
                            >
                                {contactMethod === opt.value && <div className="size-2 rounded-full bg-blue-500" />}
                            </div>
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {error && (
                <div
                    className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    role="alert"
                >
                    <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gray-900 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
            >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isEn ? "Notify me" : "Báo cho tôi"}
            </button>
        </form>
    );
}
