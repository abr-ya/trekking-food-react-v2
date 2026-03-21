import { useState } from "react";
import { FormProvider, useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import { createProductSchema, type CreateProductFormData } from "@/schemas/product";
import { RHFInput } from "../rhf";

const defaultFormValues: CreateProductFormData = {
  name: "",
  kkal: 0,
  proteins: 0,
  fats: 0,
  carbohydrates: 0,
  price: 0,
  isVegetarian: false,
  productCategoryId: "test",
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

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { isSubmitting } = form.formState;

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
        <RHFInput<CreateProductFormData>
          name="productCategoryId"
          label="Category ID"
          type="text"
          id="productCategoryId"
          placeholder="e.g. c2d6b4d1-1b47-4a24-9e7a-4b9c8c9b6c1e"
        />
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
