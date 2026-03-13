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
