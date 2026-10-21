"use client";

import type { SortOptions } from "@/utils/sort-options";

import SortProducts from "@/utils/sort-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type RefinementListProps = {
    "data-testid"?: string;
    search?: boolean;
    sortBy: SortOptions;
};

const RefinementList = ({
    "data-testid": dataTestId,
    sortBy,
}: RefinementListProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const setQueryParams = (name: string, value: string) => {
        const query = createQueryString(name, value);
        router.push(`${pathname}?${query}`);
    };

    return (
        <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
            <SortProducts
                data-testid={dataTestId}
                setQueryParams={setQueryParams}
                sortBy={sortBy}
            />
        </div>
    );
};

export default RefinementList;
