"use client";

import { useAppState } from "@/hooks/use-app-state";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  singleDuration: z.coerce.number().min(1, "Must be at least 1 minute."),
  doubleDuration: z.coerce.number().min(1, "Must be at least 1 minute."),
  singlePrice: z.coerce.number().min(0, "Price cannot be negative."),
  doublePrice: z.coerce.number().min(0, "Price cannot be negative."),
  centuryPrice: z.coerce.number().min(0, "Price cannot be negative."),
});

export default function SettingsClient() {
  const { state, dispatch } = useAppState();
  const { settings } = state;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    dispatch({ type: "UPDATE_SETTINGS", payload: values });
    toast({
      title: "Settings Saved",
      description: "Your new pricing and duration settings have been applied.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Frame Durations</CardTitle>
            <CardDescription>
              Set the standard time limit for frame-based games.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="singleDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Single Frame Duration</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="45" {...field} />
                  </FormControl>
                  <FormDescription>Duration in minutes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doubleDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Double Frame Duration</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="60" {...field} />
                  </FormControl>
                  <FormDescription>Duration in minutes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Pricing</CardTitle>
            <CardDescription>
              Define the cost for each game type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="singlePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Single Frame Price (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="10.00" {...field} />
                  </FormControl>
                  <FormDescription>Fixed price per frame.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doublePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Double Frame Price (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="15.00" {...field} />
                  </FormControl>
                  <FormDescription>Fixed price per frame.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="centuryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Century Price (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="20.00" {...field} />
                  </FormControl>
                  <FormDescription>Price per minute.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
