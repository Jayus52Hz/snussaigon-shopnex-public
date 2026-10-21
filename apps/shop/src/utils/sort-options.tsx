"use client";

import FilterRadioGroup from "./filter-radio-group";

export type SortOptions = "created_at" | "price_asc" | "price_desc";

type SortProductsProps = {
    "data-testid"?: string;
    setQueryParams: (name: string, value: SortOptions) => void;
    sortBy: SortOptions;
};

const sortOptions = [
    {
        label: "Latest Arrivals",
        value: "created_at",
    },
    {
        label: "Price: Low -> High",
        value: "price_asc",
    },
    {
        label: "Price: High -> Low",
        value: "price_desc",
    },
];

const SortProducts = ({
    "data-testid": dataTestId,
    setQueryParams,
    sortBy,
}: SortProductsProps) => {
    const handleChange = (value: SortOptions) => {
        setQueryParams("sortBy", value);
    };

    return (
        <FilterRadioGroup
            data-testid={dataTestId}
            handleChange={handleChange}
            items={sortOptions}
            title="Sort by"
            value={sortBy}
        />
    );
};

export default SortProducts;
