import { Navigate, Outlet } from "react-router-dom";

import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useAuth } from "@/providers/auth-provider";

import { AdminSidebar } from "./sidebar";

export const AdminLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h2 className="text-lg font-bold">You are not authenticated</h2>
        <p className="text-muted-foreground text-sm">Please login to view this page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div>
        <h2 className="text-lg font-bold">Access denied</h2>
        <p className="text-muted-foreground text-sm">You do not have permission to view the admin area.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export const AdminIndexRedirect = () => <Navigate to="/admin/features" replace />;
