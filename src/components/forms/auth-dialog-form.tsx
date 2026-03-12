import { Alert, AlertDescription, Button } from "..";
import { DialogFooter } from "../ui/dialog";
import { cn } from "@/lib/utils";

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface AuthDialogFormProps {
  mode: "sign-in" | "sign-up";
  email: string;
  password: string;
  name: string;
  error: {
    code: string;
    message: string;
  } | null;
  submitting: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  setMode: (mode: "sign-in" | "sign-up") => void;
  clearError: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AuthDialogForm = ({
  mode,
  email,
  password,
  name,
  error,
  submitting,
  setEmail,
  setPassword,
  setName,
  setMode,
  clearError,
  handleSubmit,
}: AuthDialogFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {mode === "sign-up" && (
        <div className="grid gap-2">
          <label htmlFor="auth-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="auth-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(inputClass)}
          />
        </div>
      )}
      <div className="grid gap-2">
        <label htmlFor="auth-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(inputClass)}
          required
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="auth-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(inputClass)}
          required
        />
      </div>
      <DialogFooter className="flex-col gap-2 sm:flex-col">
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting
            ? mode === "sign-up"
              ? "Creating account…"
              : "Signing in…"
            : mode === "sign-up"
              ? "Sign up"
              : "Sign in"}
        </Button>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-2"
          onClick={() => {
            setMode(mode === "sign-up" ? "sign-in" : "sign-up");
            clearError();
          }}
        >
          {mode === "sign-up" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </DialogFooter>
    </form>
  );
};
