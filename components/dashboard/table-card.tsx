"use client";

import { useState, useEffect, useCallback } from "react";
import type { GameSession, Table } from "@/lib/types";
import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, PinOff, Play } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { StartGameDialog } from "./start-game-dialog";

interface TableCardProps {
  table: Table;
  session?: GameSession;
}

const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
};

export function TableCard({ table, session }: TableCardProps) {
    const { state, dispatch } = useAppState();
    const { settings } = state;
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isSessionEndAlertOpen, setIsSessionEndAlertOpen] = useState(false);
    const [isStartGameOpen, setIsStartGameOpen] = useState(false);
    const { toast } = useToast();

    const calculateCost = useCallback(() => {
        if (!session) return 0;
        
        const elapsedSeconds = (Date.now() - session.startTime) / 1000;

        switch (session.gameType) {
        case "Single":
            return settings.singlePrice;
        case "Double":
            return settings.doublePrice;
        case "Century":
            const minutes = elapsedSeconds / 60;
            return minutes * settings.centuryPrice;
        }
    }, [session, settings]);

    const handleEndSession = useCallback(() => {
        if (!session) return;
        const finalCost = calculateCost();
        dispatch({ type: "END_SESSION", payload: { sessionId: session.id, cost: finalCost } });
        toast({
            title: "Session Ended",
            description: `${session.tableName} is now available. Final cost: PKR ${finalCost.toFixed(2)}`,
        });
    }, [calculateCost, dispatch, session, toast]);

    const frameDuration = session ? (session.gameType === 'Single' 
        ? settings.singleDuration * 60 
        : session.gameType === 'Double' 
        ? settings.doubleDuration * 60 
        : null) : null;

    useEffect(() => {
        if (session) {
            const elapsed = (Date.now() - session.startTime) / 1000;
            if (frameDuration) {
                setRemainingSeconds(frameDuration - elapsed);
            } else {
                setRemainingSeconds(elapsed);
            }

            const interval = setInterval(() => {
                const elapsed = (Date.now() - session.startTime) / 1000;
                if (frameDuration) { // Countdown for Single/Double
                    const remaining = frameDuration - elapsed;
                    setRemainingSeconds(remaining);
                    if (remaining <= 0) {
                        handleEndSession();
                    }
                } else { // Count-up for Century
                    setRemainingSeconds(elapsed);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [session, frameDuration, handleEndSession]);


    const getStatusVariant = () => {
        switch (table.status) {
            case 'available': return 'default';
            case 'in-use': return 'destructive';
            case 'maintenance': return 'secondary';
        }
    };
    
    const getStatusLabel = () => {
        switch (table.status) {
            case 'available': return 'Available';
            case 'in-use': return 'Occupied';
            case 'maintenance': return 'Maintenance';
        }
    }

    const tableNumber = table.name.split(' ').pop();

    return (
        <Card className={`flex flex-col relative overflow-hidden ${table.status === 'in-use' ? 'bg-primary/10 border-primary/40' : table.status === 'maintenance' ? 'bg-muted/50' : ''}`}>
            <CardHeader className="flex flex-row justify-between items-start">
                <Badge variant={getStatusVariant()} className={`capitalize ${table.status === 'available' ? 'bg-green-500 hover:bg-green-500 text-white' : table.status === 'in-use' ? 'bg-red-500 hover:bg-red-500 text-white' : ''}`}>{getStatusLabel()}</Badge>
                {session && (
                    <div className="flex items-center gap-2 text-sm font-medium bg-black/70 text-white px-2 py-1 rounded-md">
                        <Timer className="h-4 w-4" />
                        <span>{formatTime(remainingSeconds)}</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-7xl font-bold text-muted-foreground/50">{tableNumber}</p>
                {session && (
                    <div className="mt-2 text-sm">
                        <p>Game: {session.gameType}</p>
                        {session.player && <p>Player: {session.player}</p>}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {table.status === 'available' && (
                     <StartGameDialog open={isStartGameOpen} onOpenChange={setIsStartGameOpen} table={table}>
                        <Button className="w-full" onClick={() => setIsStartGameOpen(true)}>
                            <Play className="mr-2 h-4 w-4" /> Start Game
                        </Button>
                    </StartGameDialog>
                )}
                {table.status === 'in-use' && session && (
                    <AlertDialog open={isSessionEndAlertOpen} onOpenChange={setIsSessionEndAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                            <PinOff className="mr-2 h-4 w-4" /> End Session
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>End this session?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will stop the timer for {session.tableName} and calculate the final cost: PKR {calculateCost().toFixed(2)}. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEndSession}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                 {table.status === 'maintenance' && (
                    <Button variant="outline" disabled className="w-full">Under Maintenance</Button>
                 )}
            </CardFooter>
        </Card>
    );
}
