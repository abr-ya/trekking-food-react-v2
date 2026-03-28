import { useMemo, useState } from "react";
import { FormProvider, useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateProduct, useProductCategories, useUpdateProduct } from "@/hooks";
import type { CreateProductPayload, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { createProductSchema, editProductSchema, type CreateProductFormData, type EditProductFormData } from "@/schemas/product";
import { RHFInput, RHFSelect } from "../rhf";

// ─── shared defaults ──────────────────────────────────────────────────────────
const emptyFormValues: CreateProductFormData = {
  name: "",
  kkal: 0,
  proteins: 0,
  fats: 0,
  carbohydrates: 0,
  price: 0,
  isVegetarian: false,
  productCategoryId: "",
  isCommon: false,
};


// ─── shared inner form ────────────────────────────────────────────────────────
type ProductFormFieldsProps =
  | { mode: "create"; onSuccess: () => void }
  | { mode: "edit"; productId: string; defaultValues: CreateProductFormData; onSuccess: () => void };

const ProductFormFields = (props: ProductFormFieldsProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const mutation = props.mode === "edit" ? updateProduct : createProduct;

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useProductCategories();

  const categoryOptions = useMemo(
    () => (categoriesData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData?.data],
  );

  const showCategorySelect = props.mode === "create";

  const form = useForm<CreateProductFormData | EditProductFormData>({
    resolver: zodResolver(props.mode === "edit" ? editProductSchema : createProductSchema),
    defaultValues: props.mode === "edit" ? props.defaultValues : emptyFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const submitHandler: SubmitHandler<CreateProductFormData | EditProductFormData> = (data) => {
    if (props.mode === "edit") {
      updateProduct.mutate({ id: props.productId, payload: data }, { onSuccess: () => props.onSuccess() });
    } else {
      createProduct.mutate(data as CreateProductPayload, { onSuccess: () => props.onSuccess() });
    }
  };

  const errorHandler: SubmitErrorHandler<CreateProductFormData> = () => {};

  const formId = props.mode === "edit" ? "edit-product-form" : "create-product-form";

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(submitHandler, errorHandler)} className="grid max-w-md gap-4">
        <RHFInput<CreateProductFormData> name="name" label="Name" helpText="Product name" />
        <div className="grid grid-cols-2 gap-4">
          <RHFInput<CreateProductFormData> name="kkal" label="Kcal" type="number" step="any" id="kkal" valueAsNumber />
          <RHFInput<CreateProductFormData>
            name="price"
            label="Price"
            type="number"
            step="any"
            id="price"
            valueAsNumber
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <RHFInput<CreateProductFormData>
            name="proteins"
            label="Proteins"
            type="number"
            step="any"
            id="proteins"
            valueAsNumber
          />
          <RHFInput<CreateProductFormData> name="fats" label="Fats" type="number" step="any" id="fats" valueAsNumber />
          <RHFInput<CreateProductFormData>
            name="carbohydrates"
            label="Carbs"
            type="number"
            step="any"
            id="carbohydrates"
            valueAsNumber
          />
        </div>
        {showCategorySelect && (
          <div className="grid gap-2">
            {categoriesLoading ? (
              <p className="text-muted-foreground text-sm">Loading categories…</p>
            ) : categoriesError ? (
              <p className="text-destructive text-sm">
                Failed to load categories{categoriesError instanceof Error ? `: ${categoriesError.message}` : ""}.
              </p>
            ) : categoryOptions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No categories yet. Add one on the Categories page.</p>
            ) : (
              <RHFSelect<CreateProductFormData>
                name="productCategoryId"
                label="Category"
                options={categoryOptions}
                placeholder="Select a category"
              />
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...form.register("isVegetarian")} className="size-4 rounded border-input" />
            <span className="text-sm font-medium">Vegetarian</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...form.register("isCommon")} className="size-4 rounded border-input" />
            <span className="text-sm font-medium">Common</span>
          </label>
        </div>
        {props.mode === "create" && (
          <Button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending ? "Creating…" : "Create product"}
          </Button>
        )}
      </form>
    </FormProvider>
  );
};


// ─── CreateProductForm ────────────────────────────────────────────────────────
/**
 * Wrapper bumps `key` after a successful create so the inner form remounts with a fresh
 * `useForm` instance. That avoids RHF + zodResolver leaving stale `errors` after `reset()`.
 */
export const CreateProductForm = () => {
  const [formKey, setFormKey] = useState(0);

  return <ProductFormFields key={formKey} mode="create" onSuccess={() => setFormKey((k) => k + 1)} />;
};

// ─── EditProductForm ──────────────────────────────────────────────────────────
type EditProductFormProps = {
  product: Product;
  onSuccess: () => void;
};

export const EditProductForm = ({ product, onSuccess }: EditProductFormProps) => (
  <ProductFormFields
    mode="edit"
    productId={product.id}
    defaultValues={product}
    onSuccess={onSuccess}
  />
);
