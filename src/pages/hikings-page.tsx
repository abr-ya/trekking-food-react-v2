import { ColumnsWrapper, CreateHikingForm, HikingsList, PageColumn, ProtectedPage } from "@/components";

export const HikingsPage = () => (
  <ProtectedPage title="Hikings">
    <ColumnsWrapper>
      <PageColumn title="Hikings list">
        <HikingsList />
      </PageColumn>
      <PageColumn title="Create hiking" description="Plan a new hiking trip (POST /hikings).">
        <CreateHikingForm />
      </PageColumn>
    </ColumnsWrapper>
  </ProtectedPage>
);
