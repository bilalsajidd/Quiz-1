"use client";

import { useAppState } from "@/hooks/use-app-state";
import { TableCard } from "@/components/dashboard/table-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart, CircleDot, DollarSign } from "lucide-react";
import { GameSession } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from 'date-fns';


function SummaryCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export default function DashboardClient() {
  const { state } = useAppState();
  const { tables, sessions, sales } = state;
  const [todaysRevenue, setTodaysRevenue] = useState(0);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const revenue = (sales[today] || []).reduce((acc, sale) => acc + sale.cost, 0);
    setTodaysRevenue(revenue);
  }, [sales]);


  const availableTables = tables.filter(t => t.status === 'available').length;
  const activeGames = sessions.length;

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard title="Available Tables" value={availableTables} icon={BarChart} />
          <SummaryCard title="Active Games" value={activeGames} icon={Users} />
          <SummaryCard title="Today's Revenue" value={`PKR ${todaysRevenue.toFixed(2)}`} icon={DollarSign} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {tables.map((table) => {
            const session = sessions.find(s => s.tableId === table.id);
            return (
                <TableCard key={table.id} table={table} session={session} />
            )
        })}
      </div>
    </div>
  );
}
