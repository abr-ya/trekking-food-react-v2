import { DayProductCard } from "./day-product-card";

import type { HikingProduct } from "@/types";

type TripPackProductsProps = {
  products: HikingProduct[];
};

/** Read-only block for TRIP_PACK products (display only, no drag-and-drop). */
export const TripPackProducts = ({ products }: TripPackProductsProps) => {
  return (
    <div className="rounded-md border p-3 bg-card">
      <h3 className="font-semibold text-sm mb-2">Trip Pack Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((product) => (
          <DayProductCard key={product.id} product={product} isMoved={false} />
        ))}
      </div>
    </div>
  );
};
