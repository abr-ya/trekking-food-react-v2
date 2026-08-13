import { ColumnsWrapper, CreateHikingForm, HikingsList, PageColumn, ProtectedPage } from "@/components";
import { useTranslation } from "react-i18next";

export const HikingsPage = () => {
  const { t } = useTranslation();

  return (
    <ProtectedPage title={t("pages.hikings.title")}>
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
};
