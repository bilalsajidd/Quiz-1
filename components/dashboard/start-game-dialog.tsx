"use client";

import { useEffect } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GameType, Table } from "@/lib/types";

const formSchema = z.object({
  tableId: z.string(),
  gameType: z.enum(["Single", "Double", "Century"], {
    required_error: "Please select a game type.",
  }),
  player: z.string().optional(),
});

interface StartGameDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: Table;
}

export function StartGameDialog({ children, open, onOpenChange, table: preselectedTable }: StartGameDialogProps) {
  const { state, dispatch } = useAppState();
  const availableTables = state.tables.filter((t) => t.status === "available");
  const hasAvailableTables = availableTables.length > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableId: preselectedTable?.id || "",
      gameType: "Single",
      player: "",
    },
  });
  
  useEffect(() => {
    if (preselectedTable) {
      form.setValue('tableId', preselectedTable.id);
    }
  }, [preselectedTable, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const table = state.tables.find((t) => t.id === values.tableId);
    if (!table) return;

    dispatch({
      type: "START_SESSION",
      payload: {
        id: crypto.randomUUID(),
        tableId: values.tableId,
        tableName: table.name,
        gameType: values.gameType as GameType,
        startTime: Date.now(),
        player: values.player,
      },
    });
    onOpenChange(false);
    form.reset({
        tableId: preselectedTable?.id || (availableTables.length > 0 ? availableTables[0].id : ""),
        gameType: "Single",
        player: "",
    });
  }
  
  useEffect(() => {
    if (open && hasAvailableTables && !preselectedTable) {
      form.setValue('tableId', availableTables[0].id);
    }
  }, [open, hasAvailableTables, preselectedTable, form, availableTables]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Start a New Game</DialogTitle>
          <DialogDescription>
            Select an available table and game type to begin.
          </DialogDescription>
        </DialogHeader>
        {hasAvailableTables ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="tableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!!preselectedTable}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an available table" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {preselectedTable ? (
                            <SelectItem value={preselectedTable.id}>{preselectedTable.name}</SelectItem>
                        ): (
                            availableTables.map((table) => (
                                <SelectItem key={table.id} value={table.id}>
                                    {table.name}
                                </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gameType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Game Type</FormLabel>
                    <FormControl>
                        <div className="grid grid-cols-3 gap-2">
                            {(["Single", "Double", "Century"] as const).map(type => (
                                <Button
                                    key={type}
                                    type="button"
                                    variant={field.value === type ? 'default' : 'outline'}
                                    onClick={() => field.onChange(type)}
                                    className="w-full"
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="player"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full">Start Game</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
            <div className="text-center py-8">
                <p className="font-semibold">No Tables Available</p>
                <p className="text-sm text-muted-foreground mt-1">All tables are currently in use.</p>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
