import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "lucide-react";
import { z } from "zod";

import type { Product } from "@/types/product";
import { useProductCategories, useUpdateProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RHFStaticSelect } from "@/components/rhf";

const schema = z.object({
  productCategoryId: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof schema>;

type Props = { product: Product };

export const EditProductCategoryDialog = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: categoriesData } = useProductCategories();
  const categoryOptions = useMemo(
    () => (categoriesData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData?.data],
  );

  const updateProduct = useUpdateProduct();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { productCategoryId: product.productCategoryId },
  });

  const handleClose = () => {
    setIsOpen(false);
    form.reset({ productCategoryId: product.productCategoryId });
  };

  const onSubmit = (data: FormData) => {
    updateProduct.mutate(
      { id: product.id, payload: { productCategoryId: data.productCategoryId } },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-5 text-muted-foreground hover:text-foreground [&_svg]:size-3"
        aria-label="Edit category"
        onClick={() => setIsOpen(true)}
      >
        <Tag />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>Change the category for {product.name}.</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form id="edit-product-category-form" onSubmit={form.handleSubmit(onSubmit)}>
              <RHFStaticSelect<FormData>
                name="productCategoryId"
                label="Category"
                options={categoryOptions}
                placeholder="Select a category"
              />
            </form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" form="edit-product-category-form" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
