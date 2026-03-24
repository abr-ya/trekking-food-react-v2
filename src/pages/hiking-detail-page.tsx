import { Link, useParams } from "react-router-dom";
import { useHiking } from "@/hooks";
import { HikingInfo, ProtectedPage } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const HikingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hiking } = useHiking(id);

  return (
    <ProtectedPage title={hiking?.name ?? "Hiking"}>
      <p className="mb-4">
        <Link to="/hikings" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
          ← Back to hikings
        </Link>
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="food-plan">Food plan</TabsTrigger>
          <TabsTrigger value="shopping-list">Shopping List</TabsTrigger>
          <TabsTrigger value="packs-by-users">Packs by Users</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-3">
          <HikingInfo id={id ?? ""} />
        </TabsContent>
        <TabsContent value="food-plan" className="pt-3">
          <p className="text-muted-foreground text-sm">Food plan content will be added here.</p>
        </TabsContent>
        <TabsContent value="shopping-list" className="pt-3">
          <p className="text-muted-foreground text-sm">Shopping list content will be added here.</p>
        </TabsContent>
        <TabsContent value="packs-by-users" className="pt-3">
          <p className="text-muted-foreground text-sm">Packs by users content will be added here.</p>
        </TabsContent>
      </Tabs>
    </ProtectedPage>
  );
};
