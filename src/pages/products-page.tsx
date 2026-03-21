import { ColumnsWrapper, CreateProductForm, PageColumn, ProductsList } from "@/components";
import { useAuth } from "@/providers/auth-provider";

export const ProductsPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Products Page</h1>
      {isAuthenticated ? (
        <ColumnsWrapper>
          <PageColumn title="Products list">
            <ProductsList />
          </PageColumn>
          <PageColumn title="Create product" description="Create a new product to add to the database.">
            <CreateProductForm />
          </PageColumn>
        </ColumnsWrapper>
      ) : (
        <div>
          <h2 className="text-lg font-bold">You are not authenticated</h2>
          <p className="text-sm text-muted-foreground">Please login to view this page.</p>
        </div>
      )}
    </div>
  );
};
