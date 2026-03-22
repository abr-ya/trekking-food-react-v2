import { ColumnsWrapper, CreateProductForm, PageColumn, ProductsList, ProtectedPage } from "@/components";

export const ProductsPage = () => (
  <ProtectedPage title="Products Page">
    <ColumnsWrapper>
      <PageColumn title="Products list">
        <ProductsList />
      </PageColumn>
      <PageColumn title="Create product" description="Create a new product to add to the database.">
        <CreateProductForm />
      </PageColumn>
    </ColumnsWrapper>
  </ProtectedPage>
);
