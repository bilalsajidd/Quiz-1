"use client";

import { useState } from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { Sale } from "@/lib/types";

type ReportType = "daily" | "weekly" | "monthly";

export default function ReportsClient() {
  const { state } = useAppState();
  const [reportType, setReportType] = useState<ReportType>("daily");
  const { toast } = useToast();

  const getSalesDataForPeriod = (): Sale[] => {
    const today = new Date();
    let loopStartDate: Date;
    let loopEndDate: Date;

    switch (reportType) {
      case "daily":
        loopStartDate = today;
        loopEndDate = today;
        break;
      case "weekly":
        loopStartDate = startOfWeek(today);
        loopEndDate = endOfWeek(today);
        break;
      case "monthly":
        loopStartDate = startOfMonth(today);
        loopEndDate = endOfMonth(today);
        break;
      default:
        loopStartDate = today;
        loopEndDate = today;
        break;
    }

    let salesData: Sale[] = [];
    let currentDate = loopStartDate;

    while (currentDate <= loopEndDate) {
      const dateKey = format(currentDate, "yyyy-MM-dd");
      if (state.sales && state.sales[dateKey]) {
        salesData = salesData.concat(state.sales[dateKey]);
      }
      currentDate = addDays(currentDate, 1);
    }

    return salesData;
  };
  
  const handleDownload = () => {
    const dataToDownload = getSalesDataForPeriod();

    if (dataToDownload.length === 0) {
        toast({
            variant: "destructive",
            title: "No Data",
            description: `No sales data found for the ${reportType} period.`,
        });
        return;
    }

    const headers = ["Session ID", "Table Name", "Game Type", "Start Time", "End Time", "Cost", "Date"];
    const csvContent = [
        headers.join(","),
        ...dataToDownload.map(sale => [
            sale.sessionId,
            `"${sale.tableName}"`,
            sale.gameType,
            format(new Date(sale.startTime), "yyyy-MM-dd HH:mm:ss"),
            format(new Date(sale.endTime), "yyyy-MM-dd HH:mm:ss"),
            sale.cost.toFixed(2),
            format(new Date(sale.endTime), "yyyy-MM-dd"),
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales-report-${reportType}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Download Started", description: "Your sales report is being downloaded." });
  };


  return (
    <div className="max-w-md">
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Download Sales Data</CardTitle>
                <CardDescription>Select a period to download the sales data as a CSV file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select onValueChange={(value: ReportType) => setReportType(value)} defaultValue={reportType}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
