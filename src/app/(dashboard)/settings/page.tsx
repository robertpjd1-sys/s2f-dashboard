"use client";

import { useState, useEffect } from "react";
import {
  User,
  Webhook,
  Settings2,
  Copy,
  Check,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ─── Webhook data ───────────────────────────────────────────────────────────
const WEBHOOKS = [
  {
    id: "upload",
    label: "Upload Webhook",
    envKey: "NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL",
    url: process.env.NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL ?? "https://n8n.example.com/webhook/upload",
  },
  {
    id: "delete",
    label: "Delete Webhook",
    envKey: "NEXT_PUBLIC_N8N_DELETE_WEBHOOK_URL",
    url: process.env.NEXT_PUBLIC_N8N_DELETE_WEBHOOK_URL ?? "https://n8n.example.com/webhook/delete",
  },
  {
    id: "list",
    label: "List Webhook",
    envKey: "NEXT_PUBLIC_N8N_LIST_WEBHOOK_URL",
    url: process.env.NEXT_PUBLIC_N8N_LIST_WEBHOOK_URL ?? "https://n8n.example.com/webhook/list",
  },
];

// ─── Section Card wrapper ────────────────────────────────────────────────────
function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-slate-50/70">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d19c3e]/10">
          <Icon className="h-4 w-4 text-[#d19c3e]" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Toggle switch ───────────────────────────────────────────────────────────
function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer">
        {label}
      </Label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
          focus-visible:ring-[#d19c3e] focus-visible:ring-offset-2
          ${checked ? "bg-[#d19c3e]" : "bg-slate-200"}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function SettingsPage() {
  // Profile state
  const [name, setName] = useState("Robert");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("S2F Property Services");
  const [savingProfile, setSavingProfile] = useState(false);

  // Webhook copy / test state
  const [copied, setCopied] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({ upload: "idle", delete: "idle", list: "idle" });

  // Preferences state
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [defaultView, setDefaultView] = useState<"list" | "board">("list");
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Initialize dark mode from DOM/localStorage
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const handleDarkModeToggle = (val: boolean) => {
    setDarkMode(val);
    if (val) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("s2f-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("s2f-theme", "light");
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  async function handleSaveProfile() {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 900));
    setSavingProfile(false);
    toast.success("Profile updated successfully.");
  }

  async function handleCopy(id: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("URL copied to clipboard.");
  }

  async function handleTest(id: string, url: string) {
    setTestStatus((prev) => ({ ...prev, [id]: "loading" }));
    try {
      // Fire a real HEAD/GET to the webhook; catch network errors
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(5000) });
      setTestStatus((prev) => ({
        ...prev,
        [id]: res.ok || res.status < 500 ? "success" : "error",
      }));
    } catch {
      setTestStatus((prev) => ({ ...prev, [id]: "error" }));
    }
  }

  async function handleSavePrefs() {
    setSavingPrefs(true);
    await new Promise((r) => setTimeout(r, 700));
    setSavingPrefs(false);
    toast.success("Preferences saved.");
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-serif font-semibold tracking-tight text-slate-900">
          Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your account, webhooks, and system preferences.
        </p>
      </div>

      {/* ── 1. Profile & Account ─────────────────────────────────────────── */}
      <SectionCard icon={User} title="Profile & Account">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="bg-slate-50 border-slate-200 focus:border-[#d19c3e] focus:ring-[#d19c3e]/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robert@s2fproperty.com"
              className="bg-slate-50 border-slate-200 focus:border-[#d19c3e] focus:ring-[#d19c3e]/20"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company" className="text-sm font-medium text-slate-700">Company Name</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company"
              className="bg-slate-50 border-slate-200 focus:border-[#d19c3e] focus:ring-[#d19c3e]/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="bg-[#d19c3e] hover:bg-[#c38c33] text-white font-medium shadow-sm min-w-[140px]"
          >
            {savingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </SectionCard>

      {/* ── 2. Webhook Configuration ─────────────────────────────────────── */}
      <SectionCard icon={Webhook} title="Webhook Configuration">
        <div className="space-y-5">
          {WEBHOOKS.map((wh) => {
            const status = testStatus[wh.id];
            return (
              <div key={wh.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{wh.label}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{wh.envKey}</p>
                  </div>

                  {/* Test status badge */}
                  {status === "success" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                    </span>
                  )}
                  {status === "error" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2.5 py-1">
                      <XCircle className="h-3.5 w-3.5" /> Failed
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* URL read-only input */}
                  <Input
                    readOnly
                    value={wh.url}
                    className="bg-white border-slate-200 font-mono text-xs text-slate-600 flex-1 cursor-default select-all"
                    aria-label={`${wh.label} URL`}
                  />

                  {/* Copy button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(wh.id, wh.url)}
                    className="shrink-0 border-slate-200 hover:bg-slate-100"
                    title="Copy URL"
                  >
                    {copied === wh.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>

                  {/* Test connection button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(wh.id, wh.url)}
                    disabled={status === "loading"}
                    className="shrink-0 border-slate-200 hover:bg-slate-100 text-slate-700 min-w-[130px]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Testing…
                      </>
                    ) : status === "success" ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
                        Test Connection
                      </>
                    ) : status === "error" ? (
                      <>
                        <X className="mr-1.5 h-3.5 w-3.5 text-red-600" />
                        Test Connection
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── 3. System Preferences ────────────────────────────────────────── */}
      <SectionCard icon={Settings2} title="System Preferences">
        <div className="space-y-1 mb-6">
          <Toggle
            id="dark-mode"
            label="Dark Mode"
            checked={darkMode}
            onChange={handleDarkModeToggle}
          />
          <Toggle
            id="email-notifications"
            label="Email Notifications"
            checked={emailNotifs}
            onChange={setEmailNotifs}
          />
          <Toggle
            id="auto-assign"
            label="Auto-assign Jobs"
            checked={autoAssign}
            onChange={setAutoAssign}
          />
        </div>

        {/* Default job view dropdown */}
        <div className="space-y-1.5">
          <Label htmlFor="default-view" className="text-sm font-medium text-slate-700">
            Default Job View
          </Label>
          <select
            id="default-view"
            value={defaultView}
            onChange={(e) => setDefaultView(e.target.value as "list" | "board")}
            className="flex h-10 w-full max-w-xs rounded-md border border-slate-200 bg-slate-50 px-3 py-2
              text-sm text-slate-800 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#d19c3e]/30 focus:border-[#d19c3e]
              transition-colors"
          >
            <option value="list">List</option>
            <option value="board">Board</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSavePrefs}
            disabled={savingPrefs}
            className="bg-[#d19c3e] hover:bg-[#c38c33] text-white font-medium shadow-sm min-w-[160px]"
          >
            {savingPrefs ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
