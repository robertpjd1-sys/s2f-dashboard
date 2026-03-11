"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bell, 
  Bot,
  Settings,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  dummyOutboundMessages,
  NotificationStatus
} from "@/lib/dummy-notifications-data";

export default function NotificationsPage() {
  const [messages] = useState(dummyOutboundMessages);
  
  // Dummy toggle states
  const [toggles, setToggles] = useState({
    jobAlerts: true,
    qaAlerts: true,
    billingReminders: false,
    complianceAlerts: true,
    newClerks: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status: NotificationStatus) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Delivered</Badge>;
      case "Failed":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Failed</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: NotificationStatus) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const totalSent = messages.length;
  const failedCount = messages.filter(m => m.status === "Failed").length;
  const successRate = totalSent > 0 ? Math.round(((totalSent - failedCount) / totalSent) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Notification Centre</h2>
          <p className="text-muted-foreground mt-2">
            Message logs and settings for Telegram outreach.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Messages Sent Today
            </h3>
            <Send className="h-4 w-4 text-[#d19c3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {totalSent}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Delivery Success Rate
            </h3>
            <Activity className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {successRate}%
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Failed Deliveries
            </h3>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-3xl font-serif font-semibold mt-2 ${failedCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {failedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        
        {/* Left Column: Message Log (Spans 2 cols on md) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#d19c3e]" />
            Message Log
          </h3>
          
          <div className="rounded-xl border bg-white shadow-sm divide-y overflow-hidden">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-xs">
                      {msg.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {msg.clerkName}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-1 max-w-md">
                      "{msg.preview}"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 shrink-0">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    {getStatusIcon(msg.status)}
                    {format(new Date(msg.timestamp), "HH:mm")}
                  </div>
                  {getStatusBadge(msg.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Notification Settings */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#3d5a3e]" />
              Settings
            </h3>
            
            <div className="rounded-xl border bg-white shadow-sm p-1 divide-y">
              
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-t-lg transition-colors">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-900 cursor-pointer">Job Assignment Alerts</label>
                  <p className="text-xs text-slate-500">Automated job dispatch messages</p>
                </div>
                <Switch 
                  checked={toggles.jobAlerts} 
                  onCheckedChange={() => handleToggle('jobAlerts')} 
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-900 cursor-pointer">QA Failure Alerts</label>
                  <p className="text-xs text-slate-500">Immediate bounce-back messages</p>
                </div>
                <Switch 
                  checked={toggles.qaAlerts} 
                  onCheckedChange={() => handleToggle('qaAlerts')} 
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-900 cursor-pointer">Self-Billing Reminders</label>
                  <p className="text-xs text-slate-500">Monthly statement notifications</p>
                </div>
                <Switch 
                  checked={toggles.billingReminders} 
                  onCheckedChange={() => handleToggle('billingReminders')} 
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-900 cursor-pointer">Compliance Alerts</label>
                  <p className="text-xs text-slate-500">Important regulatory broadcasts</p>
                </div>
                <Switch 
                  checked={toggles.complianceAlerts} 
                  onCheckedChange={() => handleToggle('complianceAlerts')} 
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-b-lg transition-colors">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-900 cursor-pointer">New Clerk Activation</label>
                  <p className="text-xs text-slate-500">Onboarding welcome sequences</p>
                </div>
                <Switch 
                  checked={toggles.newClerks} 
                  onCheckedChange={() => handleToggle('newClerks')} 
                />
              </div>

            </div>
          </div>

          {/* Telegram Bot Status Card */}
          <div className="rounded-xl border bg-slate-900 text-white p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Bot className="w-32 h-32" />
            </div>
            
            <h3 className="font-serif font-semibold text-lg flex items-center gap-2 mb-4 relative z-10">
              <Bot className="h-5 w-5 text-[#d19c3e]" />
              Telegram Bot Status
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div>
                <div className="text-xs font-medium text-slate-400 mb-1">Bot Name</div>
                <div className="text-sm">@S2F_Clerk_Assistant_Bot</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-slate-400 mb-1">Connection</div>
                <div className="flex items-center gap-2 text-sm text-green-400 font-medium bg-green-400/10 w-fit px-2 py-1 rounded-md">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Connected
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-400 mb-1">Last Activity</div>
                <div className="text-sm font-mono text-slate-300">
                  {format(new Date(), "dd MMM yyyy, HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
