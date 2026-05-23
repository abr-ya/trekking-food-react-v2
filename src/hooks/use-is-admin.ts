import { isAppAdmin } from "@/lib/auth-roles";
import { useAuth } from "@/providers/auth-provider";

export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return isAppAdmin(user);
};
