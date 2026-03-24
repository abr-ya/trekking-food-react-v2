/** Row from hiking products API (meal lines for a day / slot). */
export type HikingProduct = {
  id: string;
  hiking_id: string;
  day_number: number;
  eating_time_id: string;
  eating_time_name: string;
  product_id: string;
  product_name: string;
  recipe_id: string;
  recipe_name: string;
  personal_quantity: number;
  total_quantity: number;
};
