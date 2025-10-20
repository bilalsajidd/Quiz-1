import DashboardClient from "@/components/dashboard/dashboard-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "@/components/app/clock";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Snooker Club Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time table management.
          </p>
        </div>
        <Clock />
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardClient />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-60 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
