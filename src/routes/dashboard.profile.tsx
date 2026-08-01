import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { changePassword, isFirebaseConfigured, updateProfile } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile — ComplyStep" },
      {
        name: "description",
        content: "Manage your ComplyStep account details, company name and password.",
      },
      { property: "og:title", content: "Profile — ComplyStep" },
      { property: "og:description", content: "Manage your account details and password." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, refresh } = useSession();
  const [form, setForm] = useState({ name: "", company: "" });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, company: user.company });
  }, [user]);

  if (!user) return null;

  const saveProfile = async () => {
    if (!form.name.trim() || !form.company.trim()) {
      toast.error("Name and company are required.");
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile(user.id, { name: form.name.trim(), company: form.company.trim() });
      refresh();
      toast.success("Profile updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (pw.next.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (pw.next !== pw.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(user.id, pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      toast.success("Password changed.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change password.");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Account details are stored in the {isFirebaseConfigured ? "Firestore" : "local demo"}{" "}
          users collection with a SHA-256 hashed password.
        </p>
      </div>

      <Card className="border-border/70">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-gradient text-xl font-bold text-primary-foreground">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Account details</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-name">Full name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-company">Company</Label>
              <Input
                id="p-company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-email">Email</Label>
              <Input id="p-email" value={user.email} disabled />
            </div>
            <Button variant="hero" onClick={saveProfile} disabled={savingProfile}>
              {savingProfile && <Loader2 className="animate-spin" />} Save changes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <KeyRound className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Change password</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-current">Current password</Label>
              <Input
                id="p-current"
                type="password"
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-next">New password</Label>
              <Input
                id="p-next"
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-confirm">Confirm new password</Label>
              <Input
                id="p-confirm"
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              />
            </div>
            <Button variant="outline" onClick={savePassword} disabled={savingPw}>
              {savingPw && <Loader2 className="animate-spin" />} Update password
            </Button>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Passwords are hashed before storage — never kept
              in plain text.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
