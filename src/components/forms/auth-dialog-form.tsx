import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks";
import { Alert, AlertDescription, Button } from "@/components";
import { RHFInput } from "@/components/rhf";
import { authDialogSchema, type AuthDialogFormData } from "@/schemas/auth-dialog";
import { DialogFooter } from "../ui/dialog";

type AuthMode = "sign-in" | "sign-up";

type AuthDialogFormProps = {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  open: boolean;
  onSuccess: () => void;
};

export const AuthDialogForm = ({ mode, setMode, open, onSuccess }: AuthDialogFormProps) => {
  const { login, register, error, clearError } = useAuth();

  const form = useForm<AuthDialogFormData>({
    resolver: zodResolver(authDialogSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) {
      reset({ email: "", password: "", name: "" });
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    clearError();
    if (mode === "sign-up" && !data.name.trim()) {
      setError("name", { message: "Name is required" });
      return;
    }

    const ok =
      mode === "sign-up"
        ? await register({
            email: data.email,
            password: data.password,
            name: data.name.trim() || undefined,
          })
        : await login({ email: data.email, password: data.password });

    if (ok) {
      reset({ email: "", password: "", name: "" });
      onSuccess();
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {mode === "sign-up" && (
          <RHFInput<AuthDialogFormData>
            name="name"
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            id="auth-name"
          />
        )}
        <RHFInput<AuthDialogFormData>
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          id="auth-email"
        />
        <RHFInput<AuthDialogFormData>
          name="password"
          label="Password"
          type="password"
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          placeholder="••••••••"
          id="auth-password"
        />
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting
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
              const next = mode === "sign-up" ? "sign-in" : "sign-up";
              setMode(next);
              clearError();
              clearErrors("name");
              if (next === "sign-in") {
                setValue("name", "");
              }
            }}
          >
            {mode === "sign-up" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};
