import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { SingleValue } from "react-select";

import { getProducts } from "@/api/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ProtectedPage,
  SelectWithSearch,
  type SelectWithSearchOption,
} from "@/components";
import { productQueryKeys } from "@/hooks";
import type { Product } from "@/types/product";

export const HomePage = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<SingleValue<SelectWithSearchOption>>(null);

  const searchProducts = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (!q) return [];
      const { data } = await queryClient.fetchQuery({
        queryKey: productQueryKeys.list({ search: q }),
        queryFn: () => getProducts({ search: q }),
      });
      return data;
    },
    [queryClient],
  );

  return (
    <ProtectedPage title="Home">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Find a product</CardTitle>
          <CardDescription>
            Sends <code className="text-foreground">GET /products?search=…</code> per keystroke (cached per query). Type
            at least one character.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SelectWithSearch<Product>
            label="Search products"
            placeholder="Start typing a name…"
            minForSearch={1}
            mapFunc={(p) => ({ label: p.name, value: p.id })}
            searchRequest={searchProducts}
            value={selected}
            onChange={setSelected}
            noOptsEmpty="Type at least one character to search."
            noOptsResult="No products match that search."
          />
          {selected ? (
            <p className="text-muted-foreground text-sm">
              Selected: <span className="text-foreground font-medium">{selected.label}</span>
              <span className="tabular-nums"> · id {selected.value}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </ProtectedPage>
  );
};
