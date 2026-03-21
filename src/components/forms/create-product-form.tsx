import { useMemo, useState } from "react";
import { FormProvider, useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct, useProductCategories } from "@/hooks";
import { Button } from "@/components/ui/button";
import { createProductSchema, type CreateProductFormData } from "@/schemas/product";
import { RHFInput, RHFSelect } from "../rhf";

const defaultFormValues: CreateProductFormData = {
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

/**
 * Wrapper bumps `key` after a successful create so the inner form remounts with a fresh
 * `useForm` instance. That avoids RHF + zodResolver leaving stale `errors` after `reset()`.
 */
export const CreateProductForm = () => {
  const [formKey, setFormKey] = useState(0);

  return <CreateProductFormFields key={formKey} onCreated={() => setFormKey((k) => k + 1)} />;
};

const TEST_MODE = false;

const CreateProductFormFields = ({ onCreated }: { onCreated: () => void }) => {
  const createProduct = useCreateProduct();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useProductCategories();

  const categoryOptions = useMemo(
    () => (categoriesData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData?.data],
  );

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { isSubmitting, errors } = form.formState;

  const { handleSubmit } = form;

  const submitHandler: SubmitHandler<CreateProductFormData> = (data) => {
    if (TEST_MODE) {
      console.log("submitHandler data", data);
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          onCreated();
        },
      });
    }
  };

  const errorHandler: SubmitErrorHandler<CreateProductFormData> = (errors) => {
    if (TEST_MODE) console.log("errorHandler errors", errors);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler, errorHandler)} className="grid max-w-md gap-4">
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
        <div className="grid gap-2">
          <span className="text-sm font-medium">Category</span>
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
              options={categoryOptions}
              placeholder="Select a category"
            />
          )}
          {errors.productCategoryId ? (
            <p className="text-destructive text-sm">{errors.productCategoryId.message}</p>
          ) : null}
        </div>
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
        <Button type="submit" disabled={createProduct.isPending || isSubmitting}>
          {createProduct.isPending ? "Creating…" : "Create product"}
        </Button>
      </form>
    </FormProvider>
  );
};
