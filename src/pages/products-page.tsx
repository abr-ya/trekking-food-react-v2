import { ColumnsWrapper, CreateProductForm, PageColumn, ProductsList, ProtectedPage } from "@/components";
import { useTranslation } from "react-i18next";

export const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <ProtectedPage title={t("pages.products.title")}>
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
};
