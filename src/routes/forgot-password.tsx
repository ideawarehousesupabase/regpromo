import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Your Password — ComplyStep" },
      {
        name: "description",
        content: "Request a password reset link for your ComplyStep workspace account.",
      },
      { property: "og:title", content: "Reset Your Password — ComplyStep" },
      { property: "og:description", content: "Password recovery for ComplyStep accounts." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset instructions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send reset instructions."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="surface-glass rounded-2xl p-6 text-center">
          <MailCheck className="mx-auto size-8 text-primary" />
          <p className="mt-4 text-sm font-medium">Check your inbox</p>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for {email}, reset instructions are on their way.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Don't see it? Check your spam or junk folder.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="fp-email">Email</Label>
            <Input
              id="fp-email"
              type="email"
              required
              maxLength={255}
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
