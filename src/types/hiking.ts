export type CreateHikingPayload = {
  name: string;
  daysTotal: number;
  membersTotal: number;
  vegetariansTotal: number;
};

export type Hiking = CreateHikingPayload & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type HikingsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type HikingsListResponse = {
  data: Hiking[];
  meta: HikingsMeta;
};

export type HikingsListParams = {
  page?: number;
  limit?: number;
  search?: string;
};
