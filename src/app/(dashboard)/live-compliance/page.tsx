"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ShieldAlert,
  Home,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useComplianceUpdates } from "@/lib/queries";
import { 
  dummyComplianceAlerts, 
  ComplianceAlertSeverity 
} from "@/lib/dummy-compliance-data";

export default function LiveCompliancePage() {
  const [alerts, setAlerts] = useState(dummyComplianceAlerts);
  const { data: regulatoryChanges = [], isLoading } = useComplianceUpdates();

  const handleResolve = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert marked as resolved.");
  };

  const getSeverityIcon = (severity: ComplianceAlertSeverity) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "Warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "Info":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: ComplianceAlertSeverity) => {
    switch (severity) {
      case "Critical":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Critical</Badge>;
      case "Warning":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Warning</Badge>;
      case "Info":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Info</Badge>;
    }
  };

  const activeAlertsCount = alerts.length;
  const monitoredPropertiesCount = 124; // Dummy static metric
  const lastChecked = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Live Compliance</h2>
          <p className="text-muted-foreground mt-2">
            Monitor regulatory changes and property compliance alerts.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Active Alerts
            </h3>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-3xl font-serif font-semibold mt-2 ${activeAlertsCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {activeAlertsCount}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Monitored Properties
            </h3>
            <Home className="h-4 w-4 text-[#d19c3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {monitoredPropertiesCount}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Last Checked
            </h3>
            <Clock className="h-4 w-4 text-[#3d5a3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xl font-medium mt-3 text-slate-900">
              {format(lastChecked, "HH:mm, dd MMM")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        
        {/* Left Column: Compliance Alerts */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#d19c3e]" />
            Property Alerts
          </h3>
          
          {alerts.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center border rounded-xl bg-white border-dashed shadow-sm">
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-serif font-medium text-foreground mb-1">
                All Clear
              </h4>
              <p className="text-sm text-muted-foreground">
                No active property compliance alerts.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-5 rounded-xl border bg-white shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all hover:shadow-md">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Home className="h-3.5 w-3.5" />
                      {alert.address}
                    </div>
                    <div className="text-xs text-slate-500">
                      Detected: {format(new Date(alert.dateDetected), "MMM do, yyyy")}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="shrink-0 self-start sm:self-center"
                    onClick={() => handleResolve(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Regulatory Changes */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-[#d19c3e]" />
            Recent Regulatory Changes
          </h3>
          
          <div className="rounded-xl border bg-white shadow-sm divide-y">
            {isLoading ? (
              <div className="p-12 pl-6 flex justify-center text-slate-400">Loading regulatory changes...</div>
            ) : regulatoryChanges.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No completed regulatory updates found.</div>
            ) : regulatoryChanges.map((change) => {
              const summaries = change.simplified_updates as Array<{ summary?: string }> | null;
              let description = "No summary available.";
              if (summaries && summaries.length > 0) {
                description = summaries[0].summary || description;
              }

              return (
              <div key={change.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h4 className="font-semibold text-slate-900 leading-tight">
                    {change.title || "Untitled Update"}
                  </h4>
                  <Badge variant={change.overall_urgency === "high" ? "destructive" : change.overall_urgency === "medium" ? "default" : "secondary"} className={change.overall_urgency === "high" ? "" : change.overall_urgency === "medium" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-none" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shrink-0"}>
                    {change.overall_urgency ? change.overall_urgency.toUpperCase() : "LOW"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  {description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {change.run_date ? format(new Date(change.run_date), "MMM do, yyyy") : "Unknown Date"}
                  </span>
                </div>
              </div>
            )})}
          </div>
        </div>

      </div>
    </div>
  );
}
