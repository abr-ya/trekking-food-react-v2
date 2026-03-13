export type CreateProductPayload = {
  name: string;
  kkal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  price: number;
  isVegetarian: boolean;
  productCategoryId: string;
  isCommon: boolean;
};

export type Product = CreateProductPayload & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};
