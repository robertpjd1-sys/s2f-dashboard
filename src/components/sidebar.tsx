"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckCircle,
  Library,
  MessageSquareWarning,
  ShieldAlert,
  FileText,
  LineChart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Morning Briefing", href: "/morning-briefing", icon: LayoutDashboard },
  { name: "Clerk Management", href: "/clerks", icon: Users },
  { name: "Job Management", href: "/jobs", icon: Briefcase },
  { name: "QA Monitor", href: "/qa", icon: CheckCircle },
  { name: "Knowledge Base", href: "/kb", icon: Library },
  { name: "Query Feed & Auto-Fix", href: "/query-feed", icon: MessageSquareWarning },
  { name: "Live Compliance", href: "/live-compliance", icon: ShieldAlert },
  { name: "Self-Billing", href: "/self-billing", icon: FileText },
  { name: "Business Intelligence", href: "/business-intelligence", icon: LineChart },
  { name: "Notification Centre", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col bg-[#1a231a] text-slate-300 border-r border-[#263526]">
      <div className="flex h-16 shrink-0 items-center px-6 bg-[#141b14]">
        <span className="text-[#d19c3e] font-serif font-bold text-xl tracking-wide">
          S2F Property
        </span>
      </div>
      <nav className="flex flex-1 flex-col py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                    isActive
                      ? "bg-[#263526] text-white border-l-2 border-[#d19c3e]"
                      : "hover:bg-[#263526]/50 hover:text-white border-l-2 border-transparent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-[#d19c3e]" : "text-slate-400 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
          
          <li className="mt-auto flex flex-col gap-y-1">
            <Link
              href="/settings"
              className={cn(
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                pathname === "/settings"
                  ? "bg-[#263526] text-white border-l-2 border-[#d19c3e]"
                  : "hover:bg-[#263526]/50 hover:text-white border-l-2 border-transparent"
              )}
            >
              <Settings
                className={cn(
                  "h-5 w-5 shrink-0",
                  pathname === "/settings" ? "text-[#d19c3e]" : "text-slate-400 group-hover:text-white"
                )}
                aria-hidden="true"
              />
              Settings
            </Link>
            
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors text-slate-400 hover:bg-red-950/30 hover:text-red-400 border-l-2 border-transparent w-full text-left"
            >
              <LogOut
                className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-400"
                aria-hidden="true"
              />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
