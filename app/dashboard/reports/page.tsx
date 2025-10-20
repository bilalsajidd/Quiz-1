import ReportsClient from "@/components/reports/reports-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Sales Reports</h1>
        <p className="text-muted-foreground">
          Download daily, weekly, or monthly sales data.
        </p>
      </div>
      <Suspense fallback={<ReportsSkeleton />}>
        <ReportsClient />
      </Suspense>
    </div>
  );
}

function ReportsSkeleton() {
    return (
        <div className="max-w-md space-y-6">
            <Skeleton className="h-48 w-full" />
        </div>
    )
}
