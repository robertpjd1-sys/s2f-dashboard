"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications, useUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CheckCircle, Bell, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.read;
    return notif.type === activeTab;
  });

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case "high":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30";
      case "low":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-500 hover:bg-slate-500/30";
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#d19c3e] font-serif">
            Notification Centre
          </h2>
          <p className="text-slate-500">
            View and manage your recent alerts and updates.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleMarkAllRead} 
            disabled={notifications.every(n => n.read) || isLoading}
            className="bg-[#d19c3e] text-white hover:bg-[#b08030]"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="bg-white border">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#d19c3e]">All</TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#d19c3e]">Unread</TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#d19c3e]">Compliance</TabsTrigger>
            <TabsTrigger value="clerk" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#d19c3e]">Clerk</TabsTrigger>
            <TabsTrigger value="job" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#d19c3e]">Job</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 border rounded-xl bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d19c3e]"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="bg-white border">
            <CardContent className="flex flex-col items-center justify-center h-64 text-slate-400 pt-6">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-500">No notifications found</p>
              <p className="text-sm">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-colors ${
                  !notification.read ? "bg-slate-50 border-l-4 border-l-[#d19c3e]" : "bg-white"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-lg text-slate-900">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="flex h-2 w-2 rounded-full bg-red-500" />
                        )}
                        <Badge variant="outline" className={getUrgencyColor(notification.urgency)}>
                          {notification.urgency ? notification.urgency.charAt(0).toUpperCase() + notification.urgency.slice(1) : "Unknown"} Urgency
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                          {notification.type ? notification.type.charAt(0).toUpperCase() + notification.type.slice(1) : "System"}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center text-sm text-slate-400 pt-2">
                        <Clock className="mr-1 h-3 w-3" />
                        {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : "Unknown time"}
                      </div>
                    </div>

                    {!notification.read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkRead(notification.id)}
                        className="shrink-0 bg-transparent text-slate-500 hover:text-slate-900"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 text-[#d19c3e]" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
