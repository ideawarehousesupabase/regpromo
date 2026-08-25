import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailLinkError, sendSignupLink } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your ComplyStep Account" },
      {
        name: "description",
        content:
          "Sign up for ComplyStep to run AI-assisted compliance checks on your regulated marketing campaigns.",
      },
      { property: "og:title", content: "Create Your ComplyStep Account" },
      {
        property: "og:description",
        content: "Create an account and run your first campaign compliance check.",
      },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
});

function SignupPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setError("");
    setAlreadyRegistered(false);
    setLoading(true);
    try {
      await sendSignupLink(parsed.data.email);
      setSent(true);
    } catch (err) {
      if (err instanceof EmailLinkError && err.reason === "already-registered") {
        setAlreadyRegistered(true);
      } else {
        toast.error(err instanceof Error ? err.message : "Could not send verification link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="We'll verify your email first, then you can set a password."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="surface-glass rounded-2xl p-6 text-center">
          <MailCheck className="mx-auto size-8 text-primary" />
          <p className="mt-4 text-sm font-medium">Check your inbox</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification link to <span className="font-medium">{email}</span>. Open it on
            this device to confirm your email and set up your password.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Don't see it? Check your spam or junk folder.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => setSent(false)}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAlreadyRegistered(false);
              }}
              aria-invalid={Boolean(error) || alreadyRegistered}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            {alreadyRegistered && (
              <p className="text-xs text-destructive">
                An account already exists for this email address.{" "}
                <Link to="/login" className="font-medium underline">
                  Log in instead
                </Link>
                {" or "}
                <Link to="/forgot-password" className="font-medium underline">
                  reset your password
                </Link>
                .
              </p>
            )}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Send verification link
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            No password yet — you'll create one after confirming your email.
          </p>
        </form>
      )}
    </AuthShell>
  );
}
