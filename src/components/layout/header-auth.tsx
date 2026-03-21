import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { AuthDialogForm } from "../forms/auth-dialog-form";

type AuthMode = "sign-in" | "sign-up";

export const HeaderAuth = () => {
  const { user, isAuthenticated, isLoading, logout, clearError } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");

  const openDialog = (m: AuthMode) => {
    setMode(m);
    clearError();
    setOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      clearError();
    }
  };

  if (isLoading) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted" aria-hidden />;
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground" title={user.email}>
          <User className="size-4" />
          <span className="max-w-32 truncate sm:max-w-40">{user.email}</span>
        </span>
        <Button variant="ghost" size="sm" onClick={() => logout()} aria-label="Sign out">
          <LogOut className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openDialog("sign-in")} aria-label="Sign in">
            <LogIn className="size-4" />
            <span className="hidden sm:inline">Sign in</span>
          </Button>
          <Button size="sm" onClick={() => openDialog("sign-up")} aria-label="Sign up">
            <UserPlus className="size-4" />
            <span className="hidden sm:inline">Sign up</span>
          </Button>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "sign-up" ? "Create an account" : "Sign in"}</DialogTitle>
            <DialogDescription>
              {mode === "sign-up"
                ? "Enter your details to create an account."
                : "Use your email and password to sign in."}
            </DialogDescription>
          </DialogHeader>
          <AuthDialogForm mode={mode} setMode={setMode} open={open} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
