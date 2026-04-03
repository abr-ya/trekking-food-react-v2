import type { HikingProduct } from "@/types/hiking-product";

export const DayProductCard = ({ product }: { product: HikingProduct }) => (
  <div key={product.id} className="rounded-md border p-3 bg-muted/50">
    <p className="font-medium text-sm">{product.product_name}</p>
    <p className="text-xs text-muted-foreground">{product.eating_time_name}</p>
    <p className="text-xs text-muted-foreground mt-1">
      Total: {product.total_quantity} · Personal: {product.personal_quantity}
    </p>
  </div>
);
