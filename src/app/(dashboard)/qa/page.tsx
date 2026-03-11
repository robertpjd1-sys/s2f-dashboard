"use client";

import { QaTable } from "@/components/qa-table";
import { QaCharts } from "@/components/qa-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ListChecks } from "lucide-react";

export default function QaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">QA Monitor</h2>
          <p className="text-muted-foreground mt-2">
            Review completed reports, flag issues, and provide feedback to clerks.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-[#d19c3e] hover:bg-[#c38c33] text-white">
            <ListChecks className="mr-2 h-4 w-4" />
            Run QA Macros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Pass rate (7 Days)</CardTitle>
            <CardDescription>Daily breakdown of passed vs failed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <QaCharts />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-sm border-border/50 bg-[#3d5a3e]/5">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-[#3d5a3e]">Pending Reviews</CardDescription>
              <CardTitle className="text-4xl font-serif text-[#3d5a3e]">14</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="font-medium">Avg Review Time</CardDescription>
              <CardTitle className="text-4xl font-serif">8.2m</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-success font-medium">12% faster this week</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-border/50 sm:col-span-2">
             <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Top Flagged Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Missing meter reading photos</span>
                  <span className="font-medium">24%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-warning" style={{ width: "24%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Incomplete condition details</span>
                  <span className="font-medium">18%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-warning/60" style={{ width: "18%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-serif font-medium">Recent Reports</h3>
        <QaTable />
      </div>
    </div>
  );
}
