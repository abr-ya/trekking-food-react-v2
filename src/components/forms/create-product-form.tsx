import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import { createProductSchema, type CreateProductFormData } from "@/schemas/product";
import { cn } from "@/lib/utils";

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const CreateProductForm = () => {
  const createProduct = useCreateProduct();

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      kkal: 0,
      proteins: 0,
      fats: 0,
      carbohydrates: 0,
      price: 0,
      isVegetarian: false,
      productCategoryId: "test",
      isCommon: false,
    },
  });

  const onSubmit = (data: CreateProductFormData) => {
    createProduct.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-md gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            {...form.register("name")}
            placeholder="Product name"
            className={cn(inputClass, form.formState.errors.name && "border-destructive")}
          />
          {form.formState.errors.name && (
            <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>
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
              className={cn(inputClass, form.formState.errors.kkal && "border-destructive")}
            />
            {form.formState.errors.kkal && (
              <p className="text-destructive text-sm">{form.formState.errors.kkal.message}</p>
            )}
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
              className={cn(inputClass, form.formState.errors.price && "border-destructive")}
            />
            {form.formState.errors.price && (
              <p className="text-destructive text-sm">{form.formState.errors.price.message}</p>
            )}
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
              className={cn(inputClass, form.formState.errors.proteins && "border-destructive")}
            />
            {form.formState.errors.proteins && (
              <p className="text-destructive text-sm">{form.formState.errors.proteins.message}</p>
            )}
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
              className={cn(inputClass, form.formState.errors.fats && "border-destructive")}
            />
            {form.formState.errors.fats && (
              <p className="text-destructive text-sm">{form.formState.errors.fats.message}</p>
            )}
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
              className={cn(inputClass, form.formState.errors.carbohydrates && "border-destructive")}
            />
            {form.formState.errors.carbohydrates && (
              <p className="text-destructive text-sm">{form.formState.errors.carbohydrates.message}</p>
            )}
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
            className={cn(inputClass, form.formState.errors.productCategoryId && "border-destructive")}
          />
          {form.formState.errors.productCategoryId && (
            <p className="text-destructive text-sm">{form.formState.errors.productCategoryId.message}</p>
          )}
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
        <Button type="submit" disabled={createProduct.isPending}>
          {createProduct.isPending ? "Creating…" : "Create product"}
        </Button>
      </form>
  );
};
