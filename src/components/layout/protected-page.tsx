import { useAuth } from "@/hooks";

interface ProtectedPageProps {
  children: React.ReactNode;
  title?: string;
}

export const ProtectedPage = ({ children, title }: ProtectedPageProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <h2 className="text-lg font-bold">You are not authenticated</h2>
        <p className="text-sm text-muted-foreground">Please login to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && <h1 className="text-xl font-bold">{title}</h1>}
      {children}
    </div>
  );
};
