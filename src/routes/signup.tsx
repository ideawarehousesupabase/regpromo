import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your RegPromo Lens Account" },
      {
        name: "description",
        content:
          "Sign up for RegPromo Lens to run AI-assisted compliance checks on your regulated marketing campaigns.",
      },
      { property: "og:title", content: "Create Your RegPromo Lens Account" },
      {
        property: "og:description",
        content: "Create an account and run your first campaign compliance check.",
      },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(100),
    company: z.string().trim().min(2, "Enter your company name").max(100),
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signUp(parsed.data);
      toast.success("Account created. Welcome to RegPromo Lens.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full name", type: "text", ph: "Alex Morgan" },
    { key: "company", label: "Company name", type: "text", ph: "Northgate Financial" },
    { key: "email", label: "Work email", type: "email", ph: "alex@company.com" },
    { key: "password", label: "Password", type: "password", ph: "At least 8 characters" },
    { key: "confirmPassword", label: "Confirm password", type: "password", ph: "Repeat password" },
  ] as const;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up a workspace and start validating campaigns."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
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

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Passwords are hashed before being stored in the users collection.
        </p>
      </form>
    </AuthShell>
  );
}
