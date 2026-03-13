import { CreateProductForm, ProductsList } from "@/components";
import { useAuth } from "@/providers/auth-provider";
export const ProductsPage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Products Page</h1>
      { isAuthenticated ? (
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <h2 className="text-lg font-bold">Products list</h2>
            <ProductsList />
          </div>
          <div className="w-1/2">
            <h2 className="text-lg font-bold">Create product</h2>
            <p className="text-sm text-muted-foreground">Create a new product to add to the database.</p>
            <CreateProductForm />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold">You are not authenticated</h2>
          <p className="text-sm text-muted-foreground">Please login to view this page.</p>
        </div>
      )}
    </div>
  );
};
