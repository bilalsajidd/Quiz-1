import TablesClient from "@/components/tables/tables-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function TablesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Table Management</h1>
        <p className="text-muted-foreground">
          Add, edit, and manage the snooker tables in your club.
        </p>
      </div>
       <Suspense fallback={<TablesSkeleton />}>
        <TablesClient />
      </Suspense>
    </div>
  );
}

function TablesSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
        </div>
    )
}
