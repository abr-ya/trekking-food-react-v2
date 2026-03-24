import { Link, useParams } from "react-router-dom";
import { useHiking } from "@/hooks";
import { HikingInfo, ProtectedPage } from "@/components";

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

      <HikingInfo id={id ?? ""} />

    </ProtectedPage>
  );
};
