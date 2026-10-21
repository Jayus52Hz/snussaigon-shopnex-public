"use client";

import { useLocale } from "@/i18n/locale-provider";
import { gtmBeginCheckout, gtmPurchase } from "@/components/gtm";
import Breadcrumbs from "@/components/breadcrumbs";
import Spinner from "@/components/icons/spinner";
import { cn } from "@/utils";
import { convertToLocale } from "@/utils/money";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Send,
    ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { type CountryCode } from "libphonenumber-js";

import OrderSuccessItems from "@/components/order-success-items";
import PhoneInput from "@/components/phone-input";
import { buildPhoneValue, detectDefaultCountryIso, normalizePhone } from "@/utils/phone";
import { appliedLabel, computePromotion, type Promotion } from "@/utils/quantity-promotion";

import ItemsTemplate from "./items";
import Summary from "./summary";

type ShippingSettings = { baseRate: number; freeShippingMinOrder: number; notes?: string; notes_en?: string } | null;

const CartTemplate = ({
    shippingSettings,
    promotion,
}: {
    shippingSettings?: ShippingSettings;
    promotion?: Promotion | null;
}) => {
    const { items, isEmpty, emptyCart } = useCart();
    const { dict, locale } = useLocale();

    const contactOptions = [
        { value: "call", label: locale === "en" ? "Phone Call" : "Gọi điện thoại" },
        { value: "zalo", label: "Zalo" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "messenger", label: "Messenger" },
    ];
    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");
    // Snapshot đơn hàng trước khi emptyCart → hiển thị lại ở màn thành công
    const [confirmedOrder, setConfirmedOrder] = useState<{
        orderId: string;
        items: any[];
        subtotal: number;
        shippingFee: number;
        discountLabel: string | null;
        discountAmount: number;
        total: number;
    } | null>(null);
    const [confirmedPhone, setConfirmedPhone] = useState(""); // SĐT hiển thị ở màn thành công

    // Delivery form
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        note: "",
    });
    const [contactMethod, setContactMethod] = useState("");

    // Số điện thoại quốc tế — selector quốc gia + ô nhập số (libphonenumber-js)
    const [phoneIso, setPhoneIso] = useState<CountryCode>("VN");
    const [phoneRaw, setPhoneRaw] = useState("");
    const [phoneCountryTouched, setPhoneCountryTouched] = useState(false);
    const [phoneInvalid, setPhoneInvalid] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Mặc định quốc gia: locale trình duyệt → fallback VN (chỉ khi user chưa tự chọn)
        if (!phoneCountryTouched) setPhoneIso(detectDefaultCountryIso());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Khi chuyển sang màn hình đặt hàng thành công, đảm bảo cuộn về đầu trang
    // (chạy sau khi success view đã render → tránh giữ vị trí scroll cũ).
    useEffect(() => {
        if (success) window.scrollTo(0, 0);
    }, [success]);

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    const subtotal = items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
    );
    // Dynamic shipping from CMS — null hoặc baseRate=-1 → ẩn phí
    const baseRate = shippingSettings?.baseRate ?? 0;
    const freeThreshold = shippingSettings?.freeShippingMinOrder ?? 0;
    const shippingHidden = !shippingSettings || shippingSettings.baseRate === -1;
    const shippingFee = shippingHidden
        ? 0
        : freeThreshold > 0 && subtotal >= freeThreshold
            ? 0
            : baseRate;
    // Khuyến mãi theo tổng số lượng — hiển thị; số chính thức do server checkout trả về
    const totalQuantity = items.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
    const applied = computePromotion(promotion, { totalQuantity, subtotal, shippingFee });
    const grandTotal = Math.max(0, subtotal + shippingFee - (applied?.amount ?? 0));
    const currencyCode = items[0]?.currency || "VND";

    const breadcrumbItems = [{ label: dict.cart.title }];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName.trim() || !formData.address.trim()) {
            alert(locale === "en" ? "Please fill in all delivery information." : "Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }

        // Chuẩn hoá + chỉ chặn khi số BẤT KHẢ THI (isPossible — lenient, không dùng isValid nghiêm ngặt)
        const phone = buildPhoneValue(phoneRaw, phoneIso);
        const { isPossible } = normalizePhone(phoneRaw, phoneIso);
        if (!isPossible || !phone.phoneE164) {
            setPhoneInvalid(true);
            alert(locale === "en" ? "Please enter a valid phone number." : "Vui lòng nhập số điện thoại hợp lệ.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        // GA4 begin_checkout
        gtmBeginCheckout(
            items.map((i: any) => ({ id: i.productId, name: i.productName || i.name, price: i.price, quantity: i.quantity })),
            grandTotal, currencyCode
        );

        let orderId = "";
        let serverOrder: any = null;
        try {
            const apiBase = window.location.origin;
            // items: dùng productId (numeric) làm id, KHÔNG dùng variant string id
            const orderItems = items.map((item: any) => ({
                id: String(item.productId),          // numeric product ID
                variantId: item.vid || item.variantId || undefined, // vid field từ variant
                name: item.productName || item.name,
                currentPrice: item.price,
                price: item.price,
                quantity: item.quantity,
                sku: item.sku || item.vid || "",
            }));

            const res = await fetch(`${apiBase}/api/orders/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: orderItems,
                    customerInfo: {
                        fullName: formData.fullName,
                        phone: phone.phoneE164, // E.164 — dữ liệu chính thức
                        phoneRaw: phone.phoneRaw,
                        countryCode: phone.countryCode,
                        countryIso: phone.countryIso,
                        address: formData.address,
                        district: "",
                        city: phone.countryIso === "VN" ? "TP.HCM" : "",
                        country: phone.countryIso,
                        note: formData.note,
                        email: "",
                        contactMethod:
                            contactOptions.find((o) => o.value === contactMethod)
                                ?.label || contactMethod,
                    },
                    paymentMethodId: "1", // ID 1 = Cash on Delivery
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.success) {
                console.error("[Cart] Checkout error:", data?.error || res.status);
                // Giữ nguyên giỏ hàng để khách thử lại.
                // Lỗi 4xx là thông báo nghiệp vụ cho khách (vd hết hàng); 5xx là lỗi kỹ thuật → câu chung.
                const isUserFacing = res.status >= 400 && res.status < 500 && data?.error;
                setSubmitError(
                    isUserFacing ||
                        (locale === "en"
                            ? "We couldn't place your order. Please try again or contact us."
                            : "Không thể đặt hàng. Vui lòng thử lại hoặc liên hệ với chúng tôi.")
                );
                setIsSubmitting(false);
                return;
            }
            orderId = String(data.orderId || "");
            serverOrder = data;
        } catch (err: any) {
            console.error("[Cart] Checkout network error:", err?.message);
            setSubmitError(
                locale === "en"
                    ? "Network error. Please check your connection and try again."
                    : "Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại."
            );
            setIsSubmitting(false);
            return;
        }

        // Ưu tiên số server đã tính lại (khuyến mãi, phí ship, tổng)
        const serverPromotion = serverOrder?.promotion;
        const confirmedTotal = Number(serverOrder?.total ?? grandTotal);
        setConfirmedOrder({
            orderId,
            items: [...items],
            subtotal: Number(serverOrder?.subtotal ?? subtotal),
            shippingFee: Number(serverOrder?.shippingCost ?? shippingFee),
            discountLabel: serverPromotion
                ? appliedLabel(serverPromotion, locale)
                : applied
                  ? appliedLabel(applied.tier, locale)
                  : null,
            discountAmount: Number(serverPromotion?.amount ?? applied?.amount ?? 0),
            total: confirmedTotal,
        });
        setConfirmedPhone(phone.phoneE164);
        // GA4 purchase event — dùng đúng mã đơn CMS trả về
        gtmPurchase({
            orderId,
            total: confirmedTotal,
            items: items.map((i: any) => ({ id: i.productId, name: i.productName || i.name, price: i.price, quantity: i.quantity })),
            currency: currencyCode,
        });
        setIsSubmitting(false);
        setSuccess(true);
        emptyCart();
        // Đẩy lên đầu trang ngay (instant — smooth bị gián đoạn khi re-render
        // sang màn hình success ngắn hơn trên mobile).
        window.scrollTo(0, 0);
    };

    // Success state
    if (success && confirmedOrder) {
        return (
            <>
                <Breadcrumbs items={breadcrumbItems} />
                <div className="content-container py-6">
                    <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-8">
                        {dict.cart.title}
                    </h1>
                    <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full flex-shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    {locale === "en" ? "Order Placed Successfully!" : "Đặt hàng thành công!"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {locale === "en" ? "Thank you for your order. We will contact you shortly to confirm." : "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất."}
                                </p>
                            </div>
                        </div>

                        <ul className="text-sm space-y-1.5 mb-6 list-disc pl-5 marker:text-gray-400">
                            {confirmedOrder.orderId && (
                                <li>
                                    {locale === "en" ? "Order ID" : "Mã đơn hàng"}: <strong>{confirmedOrder.orderId}</strong>
                                </li>
                            )}
                            <li>
                                {locale === "en" ? "Name" : "Họ tên"}: <strong>{formData.fullName}</strong>
                            </li>
                            <li>
                                {locale === "en" ? "Phone" : "SĐT"}: <strong>{confirmedPhone}</strong>
                            </li>
                            <li>
                                {locale === "en" ? "Address" : "Địa chỉ"}: <strong>{formData.address}</strong>
                            </li>
                            {contactMethod && (
                                <li>
                                    {locale === "en" ? "Contact via" : "Liên hệ qua"}:{" "}
                                    <strong>
                                        {contactOptions.find(
                                            (o) => o.value === contactMethod
                                        )?.label || contactMethod}
                                    </strong>
                                </li>
                            )}
                        </ul>

                        <OrderSuccessItems
                            currencyCode={confirmedOrder.items[0]?.currency || "VND"}
                            discountAmount={confirmedOrder.discountAmount}
                            discountLabel={confirmedOrder.discountLabel}
                            items={confirmedOrder.items}
                            locale={locale}
                            shippingFee={confirmedOrder.shippingFee}
                            shippingHidden={shippingHidden}
                            subtotal={confirmedOrder.subtotal}
                            total={confirmedOrder.total}
                        />

                        <div className="flex flex-wrap gap-3">
                            <Link
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                href={locale === "en" ? "/en/snus" : "/snus"}
                            >
                                {dict.common.continueShopping}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Empty state
    if (isEmpty || items.length === 0) {
        return (
            <>
                <Breadcrumbs items={breadcrumbItems} />
                <div className="content-container py-6">
                    <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-8">
                        {dict.cart.title}
                    </h1>
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                            {dict.cart.emptyTitle}
                        </p>
                        <Link
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                            href={locale === "en" ? "/en/snus" : "/snus"}
                        >
                            {dict.common.continueShopping}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="content-container py-6">
                <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-8">
                    {dict.cart.title}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <ItemsTemplate />
                    </div>

                    {/* Right sidebar: Summary + Delivery Form */}
                    <div className="space-y-6">
                        <Summary promotion={promotion} shippingSettings={shippingSettings} />

                        {/* Delivery Form */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-bold text-lg mb-4">
                                {locale === "en" ? "Delivery Information" : "Thông Tin Giao Hàng"}
                            </h2>
                            <form
                                className="space-y-4"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        htmlFor="fullName"
                                    >
                                        {locale === "en" ? "Full Name *" : "Họ và tên *"}
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        id="fullName"
                                        name="fullName"
                                        onChange={handleInputChange}
                                        placeholder={locale === "en" ? "John Doe" : "Nguyễn Văn A"}
                                        required
                                        type="text"
                                        value={formData.fullName}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        htmlFor="phone"
                                    >
                                        {locale === "en" ? "Phone Number *" : "Số điện thoại *"}
                                    </label>
                                    <PhoneInput
                                        id="phone"
                                        invalid={phoneInvalid}
                                        iso={phoneIso}
                                        locale={locale}
                                        onChange={({ iso, raw }) => {
                                            if (iso !== phoneIso) setPhoneCountryTouched(true);
                                            setPhoneIso(iso);
                                            setPhoneRaw(raw);
                                            if (phoneInvalid) setPhoneInvalid(false);
                                        }}
                                        placeholder={locale === "en" ? "Phone number" : "Số điện thoại"}
                                        rawValue={phoneRaw}
                                    />
                                    {phoneInvalid && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {locale === "en" ? "Please enter a valid phone number." : "Vui lòng nhập số điện thoại hợp lệ."}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        htmlFor="address"
                                    >
                                        {locale === "en" ? "Delivery Address *" : "Địa chỉ giao hàng *"}
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        id="address"
                                        name="address"
                                        onChange={handleInputChange}
                                        placeholder={locale === "en" ? "Street, District, City" : "Số nhà, tên đường, Quận/Huyện, TP.HCM"}
                                        required
                                        rows={3}
                                        value={formData.address}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        htmlFor="note"
                                    >
                                        {locale === "en" ? "Order Notes" : "Ghi chú đơn hàng"}
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        id="note"
                                        name="note"
                                        onChange={handleInputChange}
                                        placeholder={locale === "en" ? "Notes about your order, preferred delivery time..." : "Ghi chú về đơn hàng, thời gian nhận hàng..."}
                                        rows={2}
                                        value={formData.note}
                                    />
                                </div>

                                {/* Contact Method */}
                                <div className="pt-2 border-t border-gray-200">
                                    <label className="block text-sm font-medium mb-3">
                                        {locale === "en" ? "Preferred contact method?" : "Bạn muốn được liên hệ qua?"}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {contactOptions.map((opt) => (
                                            <label
                                                className={cn(
                                                    "flex items-center gap-2 border rounded-md p-2.5 cursor-pointer transition-colors text-sm",
                                                    contactMethod ===
                                                        opt.value
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 hover:bg-gray-50"
                                                )}
                                                key={opt.value}
                                            >
                                                <input
                                                    checked={
                                                        contactMethod ===
                                                        opt.value
                                                    }
                                                    className="sr-only"
                                                    name="contactMethod"
                                                    onChange={() =>
                                                        setContactMethod(
                                                            opt.value
                                                        )
                                                    }
                                                    type="radio"
                                                    value={opt.value}
                                                />
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                                        contactMethod ===
                                                            opt.value
                                                            ? "border-blue-500"
                                                            : "border-gray-300"
                                                    )}
                                                >
                                                    {contactMethod ===
                                                        opt.value && (
                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    )}
                                                </div>
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {submitError && (
                                    <div
                                        className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                        role="alert"
                                    >
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{submitError}</span>
                                    </div>
                                )}

                                <button
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {locale === "en" ? "Processing..." : "Đang xử lý..."}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            {locale === "en" ? "Place Order" : "Đặt hàng"} —{" "}
                                            {convertToLocale({
                                                amount: grandTotal,
                                                currency_code: currencyCode,
                                            })}
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-400">
                                    {locale === "en"
                                        ? "By placing an order, you agree to our terms of service"
                                        : "Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của chúng tôi"}
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartTemplate;
