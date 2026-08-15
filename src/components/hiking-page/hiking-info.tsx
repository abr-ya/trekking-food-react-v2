import { useTranslation } from "react-i18next";

import { useHiking } from "@/hooks";
import { AddHikingAdminDialog, EditMembersTotalDialog, LoadingSkeleton } from "@/components";

export const HikingInfo = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { data: hiking, isLoading, error } = useHiking(id);

  if (!id) return <p className="text-muted-foreground text-sm">{t("pages.hikingDetail.overview.invalidId")}</p>;
  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <p className="text-destructive text-sm">
        {t("pages.hikingDetail.overview.loadError", {
          message: error instanceof Error ? error.message : t("pages.hikingDetail.overview.unknownError"),
        })}
      </p>
    );
  }

  if (!hiking) {
    return <p className="text-muted-foreground text-sm">{t("pages.hikingDetail.overview.notFound")}</p>;
  }

  return (
    <div className="text-muted-foreground space-y-2 text-sm">
      <p>
        <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.daysTotal")}</span>{" "}
        {hiking.daysTotal}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <p>
          <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.membersTotal")}</span>{" "}
          {hiking.membersTotal}
        </p>
        <EditMembersTotalDialog
          hikingId={hiking.id}
          currentMembersTotal={hiking.membersTotal}
          vegetariansTotal={hiking.vegetariansTotal}
        />
      </div>
      <p>
        <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.vegetariansTotal")}</span>{" "}
        {hiking.vegetariansTotal}
      </p>
      {hiking.createdAt ? (
        <p>
          <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.created")}</span>{" "}
          {hiking.createdAt}
        </p>
      ) : null}
      {hiking.userId ? (
        <p>
          <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.createdBy")}</span>{" "}
          {hiking.userId}
        </p>
      ) : null}
      {hiking.updatedAt ? (
        <p>
          <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.updated")}</span>{" "}
          {hiking.updatedAt}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <p>
          <span className="text-foreground font-medium">{t("pages.hikingDetail.overview.admins")}</span>{" "}
          {hiking.admins.length > 0
            ? hiking.admins.map((admin) => admin.name).join(", ")
            : t("pages.hikingDetail.overview.noAdmins")}
        </p>
        <AddHikingAdminDialog hikingId={hiking.id} />
      </div>
    </div>
  );
};
