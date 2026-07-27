import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Your Password — RegPromo Lens" },
      {
        name: "description",
        content: "Request a password reset link for your RegPromo Lens workspace account.",
      },
      { property: "og:title", content: "Reset Your Password — RegPromo Lens" },
      { property: "og:description", content: "Password recovery for RegPromo Lens accounts." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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
            If an account exists for {email}, reset instructions are on their way. This screen is UI
            only in the prototype — no email is sent.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
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
          <Button type="submit" variant="hero" size="lg" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
