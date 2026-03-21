import { useState } from "react";
import { FormProvider, useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import { createProductSchema, type CreateProductFormData } from "@/schemas/product";
import { cn } from "@/lib/utils";
import { RHFInput } from "../rhf";

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

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

  // Subscribe to formState (Proxy); use `errors` here so UI updates
  const { errors, isSubmitting } = form.formState;

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
        <RHFInput name="name" label="Name" helpText="Product name" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="kkal" className="text-sm font-medium">
              Kcal
            </label>
            <input
              id="kkal"
              type="number"
              step="any"
              {...form.register("kkal", { valueAsNumber: true })}
              className={cn(inputClass, errors.kkal && "border-destructive")}
            />
            {errors.kkal && <p className="text-destructive text-sm">{errors.kkal.message}</p>}
          </div>
          <div className="grid gap-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="any"
              {...form.register("price", { valueAsNumber: true })}
              className={cn(inputClass, errors.price && "border-destructive")}
            />
            {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label htmlFor="proteins" className="text-sm font-medium">
              Proteins
            </label>
            <input
              id="proteins"
              type="number"
              step="any"
              {...form.register("proteins", { valueAsNumber: true })}
              className={cn(inputClass, errors.proteins && "border-destructive")}
            />
            {errors.proteins && <p className="text-destructive text-sm">{errors.proteins.message}</p>}
          </div>
          <div className="grid gap-2">
            <label htmlFor="fats" className="text-sm font-medium">
              Fats
            </label>
            <input
              id="fats"
              type="number"
              step="any"
              {...form.register("fats", { valueAsNumber: true })}
              className={cn(inputClass, errors.fats && "border-destructive")}
            />
            {errors.fats && <p className="text-destructive text-sm">{errors.fats.message}</p>}
          </div>
          <div className="grid gap-2">
            <label htmlFor="carbohydrates" className="text-sm font-medium">
              Carbs
            </label>
            <input
              id="carbohydrates"
              type="number"
              step="any"
              {...form.register("carbohydrates", { valueAsNumber: true })}
              className={cn(inputClass, errors.carbohydrates && "border-destructive")}
            />
            {errors.carbohydrates && <p className="text-destructive text-sm">{errors.carbohydrates.message}</p>}
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="productCategoryId" className="text-sm font-medium">
            Category ID
          </label>
          <input
            id="productCategoryId"
            {...form.register("productCategoryId")}
            placeholder="e.g. c2d6b4d1-1b47-4a24-9e7a-4b9c8c9b6c1e"
            className={cn(inputClass, errors.productCategoryId && "border-destructive")}
          />
          {errors.productCategoryId && <p className="text-destructive text-sm">{errors.productCategoryId.message}</p>}
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
