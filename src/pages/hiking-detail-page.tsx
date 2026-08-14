import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHiking } from "@/hooks";
import { FoodPlan, HikingInfo, PacksByDays, PacksByUsers, ProtectedPage, ShoppingList } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const HikingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: hiking } = useHiking(id);

  return (
    <ProtectedPage title={hiking?.name ?? t("pages.hikingDetail.title")}>
      <p className="mb-4">
        <Link to="/hikings" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
          {t("pages.hikingDetail.backToHikings")}
        </Link>
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">{t("pages.hikingDetail.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="food-plan">{t("pages.hikingDetail.tabs.foodPlan")}</TabsTrigger>
          <TabsTrigger value="shopping-list">{t("pages.hikingDetail.tabs.shoppingList")}</TabsTrigger>
          <TabsTrigger value="packs-by-days">{t("pages.hikingDetail.tabs.packsByDays")}</TabsTrigger>
          <TabsTrigger value="packs-by-users">{t("pages.hikingDetail.tabs.packsByUsers")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-3">
          <HikingInfo id={id ?? ""} />
        </TabsContent>
        <TabsContent value="food-plan" className="pt-3">
          <FoodPlan id={id ?? ""} />
        </TabsContent>
        <TabsContent value="shopping-list" className="pt-3">
          <ShoppingList hikingId={id ?? ""} />
        </TabsContent>
        <TabsContent value="packs-by-days" className="pt-3">
          <PacksByDays id={id ?? ""} />
        </TabsContent>
        <TabsContent value="packs-by-users" className="pt-3">
          <PacksByUsers id={id ?? ""} />
        </TabsContent>
      </Tabs>
    </ProtectedPage>
  );
};
