import type { HikingProduct } from "@/types/hiking-product";

type DayProductCardProps = {
  product: HikingProduct;
  isMoved?: boolean;
};

export const DayProductCard = ({ product, isMoved = false }: DayProductCardProps) => (
  <div key={product.id} className="rounded-md border p-3 bg-muted/50 relative">
    {isMoved && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" title="Product was moved" />}
    <p className="font-medium text-sm">{product.product_name}</p>
    <p className="text-xs text-muted-foreground">{product.eating_time_name}</p>
    <p className="text-xs text-muted-foreground mt-1">
      Total: {product.total_quantity} · Personal: {product.personal_quantity}
    </p>
  </div>
);
