"use client";

import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import { ArrowRightMini, XMark } from "@medusajs/icons";
import { clx, Text, useToggleState } from "@medusajs/ui";
import { useLocale } from "@/i18n/locale-provider";
import Link from "next/link";
import { Fragment, useMemo } from "react";

const SideMenu = ({ storeSettings }: { storeSettings: any }) => {
    const toggleState = useToggleState();
    const { locale } = useLocale();
    const prefix = locale === "en" ? "/en" : "";

    const SideMenuItems = useMemo(() => ({
        "Cửa Hàng": `${prefix}/snus`,
        "Giỏ Hàng": `${prefix}/cart`,
        "Trang Chủ": `${prefix}/`,
        "Tài Khoản": `${prefix}/account`,
        "Tìm Kiếm": `${prefix}/search`,
    }), [prefix]);

    return (
        <div className="h-full">
            <div className="flex items-center h-full">
                <Popover className="h-full flex">
                    {({ close, open }) => (
                        <>
                            <div className="relative flex h-full">
                                <Popover.Button
                                    className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                                    data-testid="nav-menu-button"
                                >
                                    Danh Mục
                                </Popover.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-150"
                                enterFrom="opacity-0"
                                enterTo="opacity-100 backdrop-blur-2xl"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 backdrop-blur-2xl"
                                leaveTo="opacity-0"
                                show={open}
                            >
                                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                                    <div
                                        className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
                                        data-testid="nav-menu-popup"
                                    >
                                        <div
                                            className="flex justify-end"
                                            id="xmark"
                                        >
                                            <button
                                                data-testid="close-menu-button"
                                                onClick={close}
                                            >
                                                <XMark />
                                            </button>
                                        </div>
                                        <ul className="flex flex-col gap-6 items-start justify-start">
                                            {Object.entries(SideMenuItems).map(
                                                ([name, href]) => {
                                                    return (
                                                        <li key={name}>
                                                            <Link
                                                                className="text-3xl leading-10 hover:text-ui-fg-disabled"
                                                                data-testid={`${name.toLowerCase()}-link`}
                                                                href={href}
                                                                onClick={close}
                                                            >
                                                                {name}
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                        <div className="flex flex-col gap-y-6">
                                            <div
                                                className="flex justify-between"
                                                onMouseEnter={toggleState.open}
                                                onMouseLeave={toggleState.close}
                                            >
                                                <ArrowRightMini
                                                    className={clx(
                                                        "transition-transform duration-150",
                                                        toggleState.state
                                                            ? "-rotate-90"
                                                            : ""
                                                    )}
                                                />
                                            </div>
                                            <Text className="flex justify-between txt-compact-small">
                                                © {new Date().getFullYear()}{" "}
                                                {storeSettings?.name}. Tất cả
                                                các quyền được bảo lưu.
                                            </Text>
                                        </div>
                                    </div>
                                </PopoverPanel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
        </div>
    );
};

export default SideMenu;
