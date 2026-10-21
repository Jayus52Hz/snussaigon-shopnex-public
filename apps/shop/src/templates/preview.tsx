"use client";

import Item from "@/components/item";
import repeat from "@/utils/repeat";
import { clx, Table } from "@medusajs/ui";
import { Fragment } from "react";

type ItemsTemplateProps = {
    cart: any;
};

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
    const items = cart.items;
    const hasOverflow = items && items.length > 4;

    return (
        <div
            className={clx({
                "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
                    hasOverflow,
            })}
        >
            <Table>
                <Table.Body data-testid="items-table">
                    {items
                        ? items
                              .sort((a: any, b: any) => {
                                  return (a.created_at ?? "") >
                                      (b.created_at ?? "")
                                      ? -1
                                      : 1;
                              })
                              .map((item: any) => {
                                  return (
                                      <Item
                                          currencyCode={cart.currency_code}
                                          item={item}
                                          key={item.id}
                                          type="preview"
                                      />
                                  );
                              })
                        : repeat(5).map((i, index) => {
                              return <Fragment key={index}></Fragment>;
                          })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ItemsPreviewTemplate;
