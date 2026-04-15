import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { SingleValue } from "react-select";

import { getProducts } from "@/api/products";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ProtectedPage,
  SelectWithSearch,
  type SelectWithSearchOption,
} from "@/components";
import { productQueryKeys, usePromoteToTripPack, useUpdateHikingProduct } from "@/hooks";
import { Field, FieldError, FieldLabel } from "@/components/ui/field-cursor";
import { Input } from "@/components/ui/input-cursor";
import type { Product } from "@/types/product";

export const HomePage = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<SingleValue<SelectWithSearchOption>>(null);

  const [hikingId, setHikingId] = useState("");
  const [hikingProductId, setHikingProductId] = useState("");
  const [personalQuantity, setPersonalQuantity] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");

  const [promoteHikingId, setPromoteHikingId] = useState("");
  const [promotePackCount, setPromotePackCount] = useState("");

  const { mutate: updateProduct, isPending, isSuccess, isError, error } = useUpdateHikingProduct();
  const {
    mutate: promoteToTripPack,
    isPending: isPromotePending,
    isSuccess: isPromoteSuccess,
    isError: isPromoteError,
    error: promoteError,
  } = usePromoteToTripPack();

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

  const handleUpdate = () => {
    updateProduct({
      hikingId,
      hikingProductId,
      payload: {
        personalQuantity: Number(personalQuantity),
        totalQuantity: Number(totalQuantity),
      },
    });
  };

  const handlePromote = () => {
    if (!selected) return;
    promoteToTripPack({
      hikingId: promoteHikingId,
      payload: {
        productId: selected.value,
        packCount: promotePackCount ? Number(promotePackCount) : undefined,
      },
    });
  };

  return (
    <ProtectedPage title="Home">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Find a product</CardTitle>
              <CardDescription>
                Sends <code className="text-foreground">GET /products?search=…</code> per keystroke (cached per query).
                Type at least one character.
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

          <Card>
            <CardHeader>
              <CardTitle>Update hiking product quantities</CardTitle>
              <CardDescription>
                Sends <code className="text-foreground">PATCH /hikings/:id/hiking-products/:id</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Field>
                <FieldLabel htmlFor="up-hiking-id">Hiking ID</FieldLabel>
                <Input
                  id="up-hiking-id"
                  placeholder="e.g. abc123"
                  value={hikingId}
                  onChange={(e) => setHikingId(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="up-product-id">Hiking Product ID</FieldLabel>
                <Input
                  id="up-product-id"
                  placeholder="e.g. xyz789"
                  value={hikingProductId}
                  onChange={(e) => setHikingProductId(e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="up-personal">Personal quantity (g)</FieldLabel>
                  <Input
                    id="up-personal"
                    type="number"
                    min={0}
                    placeholder="85"
                    value={personalQuantity}
                    onChange={(e) => setPersonalQuantity(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="up-total">Total quantity (g)</FieldLabel>
                  <Input
                    id="up-total"
                    type="number"
                    min={0}
                    placeholder="340"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(e.target.value)}
                  />
                </Field>
              </div>

              {isError ? <FieldError>{error instanceof Error ? error.message : "Request failed."}</FieldError> : null}
              {isSuccess ? <p className="text-sm text-green-600">Updated successfully.</p> : null}

              <Button
                onClick={handleUpdate}
                disabled={isPending || !hikingId || !hikingProductId || !personalQuantity || !totalQuantity}
              >
                {isPending ? "Updating…" : "Update quantities"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Promote product to trip pack</CardTitle>
              <CardDescription>
                Sends <code className="text-foreground">POST /hikings/:id/hiking-products/promote-to-trip-pack</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Field>
                <FieldLabel htmlFor="promote-hiking-id">Hiking ID</FieldLabel>
                <Input
                  id="promote-hiking-id"
                  placeholder="e.g. abc123"
                  value={promoteHikingId}
                  onChange={(e) => setPromoteHikingId(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="promote-pack-count">Pack count (optional)</FieldLabel>
                <Input
                  id="promote-pack-count"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={promotePackCount}
                  onChange={(e) => setPromotePackCount(e.target.value)}
                />
              </Field>

              {isPromoteError ? (
                <FieldError>{promoteError instanceof Error ? promoteError.message : "Request failed."}</FieldError>
              ) : null}
              {isPromoteSuccess ? <p className="text-sm text-green-600">Promoted successfully.</p> : null}

              <Button onClick={handlePromote} disabled={isPromotePending || !selected || !promoteHikingId}>
                {isPromotePending ? "Promoting…" : "Promote to trip pack"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedPage>
  );
};
