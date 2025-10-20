import SettingsClient from "@/components/settings/settings-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Configure game pricing and frame durations for your club.
        </p>
      </div>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsClient />
      </Suspense>
    </div>
  );
}

function SettingsSkeleton() {
    return (
        <div className="max-w-2xl space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
             <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    )
}
