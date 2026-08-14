import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeEmailLinkSignIn, finishAccountSetup, isEmailSignInLink } from "@/lib/auth";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Your Email — ComplyStep" },
      {
        name: "description",
        content: "Confirm your email address and finish setting up your ComplyStep account.",
      },
    ],
  }),
  component: VerifyEmailPage,
});

type Stage = "checking" | "confirm-email" | "set-password" | "invalid";

const passwordSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(100),
    company: z.string().trim().min(2, "Enter your company name").max(100),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("checking");
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const href = window.location.href;
    if (!isEmailSignInLink(href)) {
      setStage("invalid");
      return;
    }
    completeEmailLinkSignIn(href)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStage("set-password");
      })
      .catch(() => setStage("confirm-email"));
  }, []);

  const confirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().trim().email("Enter a valid email address").safeParse(emailInput);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setConfirmLoading(true);
    try {
      const verifiedEmail = await completeEmailLinkSignIn(window.location.href, parsed.data);
      setEmail(verifiedEmail);
      setStage("set-password");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "That link is invalid or has expired. Request a new one.",
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await finishAccountSetup(parsed.data);
      toast.success("Account created. Welcome to ComplyStep.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not finish setting up your account.");
    } finally {
      setSubmitting(false);
    }
  };

  if (stage === "checking") {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (stage === "invalid") {
    return (
      <AuthShell
        title="Link invalid or expired"
        subtitle="This verification link can't be used."
        footer={
          <>
            Need a new one?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Start again
            </Link>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Verification links expire and can only be used once. Head back to the sign-up page to
          request a new one.
        </p>
      </AuthShell>
    );
  }

  if (stage === "confirm-email") {
    return (
      <AuthShell
        title="Confirm your email"
        subtitle="Enter the email address you signed up with to finish verifying this link."
        footer={
          <>
            Need a new link?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Start again
            </Link>
          </>
        }
      >
        <form className="space-y-4" onSubmit={confirmEmail}>
          <div className="space-y-2">
            <Label htmlFor="confirm-email">Email</Label>
            <Input
              id="confirm-email"
              type="email"
              placeholder="alex@company.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={confirmLoading}
          >
            {confirmLoading && <Loader2 className="animate-spin" />}
            Confirm email
          </Button>
        </form>
      </AuthShell>
    );
  }

  const fields = [
    { key: "name", label: "Full name", type: "text", ph: "Alex Morgan" },
    { key: "company", label: "Company name", type: "text", ph: "Northgate Financial" },
    { key: "password", label: "Password", type: "password", ph: "At least 8 characters" },
    { key: "confirmPassword", label: "Confirm password", type: "password", ph: "Repeat password" },
  ] as const;

  return (
    <AuthShell
      title="Create your password"
      subtitle={`${email} is verified. Finish setting up your account below.`}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary">
        <ShieldCheck className="size-4 shrink-0" />
        Email verified
      </div>
      <form className="space-y-4" onSubmit={submit}>
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              type={f.type}
              placeholder={f.ph}
              value={values[f.key]}
              onChange={set(f.key)}
              autoComplete={f.type === "password" ? "new-password" : "on"}
            />
            {errors[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
          </div>
        ))}

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
