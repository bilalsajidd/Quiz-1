"use client";

import { useState } from "react";
import { useAppState } from "@/hooks/use-app-state";
import type { Table as TableType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TablesClient() {
  const { state, dispatch } = useAppState();
  const { tables } = state;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const [deletingTableId, setDeletingTableId] = useState<string | null>(null);
  const [tableName, setTableName] = useState("");
  const { toast } = useToast();

  const handleSaveTable = () => {
    if (!tableName.trim()) {
      toast({ variant: 'destructive', title: "Error", description: "Table name cannot be empty." });
      return;
    }
    
    if (editingTable) {
      dispatch({
        type: "UPDATE_TABLE",
        payload: { ...editingTable, name: tableName },
      });
      toast({ title: "Table Updated", description: `"${tableName}" has been updated.` });
    } else {
      const newTable: TableType = {
        id: crypto.randomUUID(),
        name: tableName,
        status: "available",
      };
      dispatch({ type: "ADD_TABLE", payload: newTable });
      toast({ title: "Table Added", description: `"${tableName}" has been added.` });
    }
    closeDialog();
  };

  const handleDeleteTable = () => {
    if (deletingTableId) {
      const tableToDelete = tables.find(t => t.id === deletingTableId);
      if (tableToDelete?.status === 'in-use') {
        toast({ variant: 'destructive', title: "Action Forbidden", description: "Cannot delete a table that is currently in use." });
        setDeletingTableId(null);
        return;
      }
      dispatch({ type: "DELETE_TABLE", payload: deletingTableId });
      toast({ title: "Table Deleted", description: `The table has been deleted.` });
      setDeletingTableId(null);
    }
  };
  
  const openEditDialog = (table: TableType) => {
    setEditingTable(table);
    setTableName(table.name);
    setIsAddDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingTable(null);
    setTableName(`Table ${tables.length + 1}`);
    setIsAddDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTable(null);
    setTableName("");
  };

  const handleStatusChange = (table: TableType, status: 'available' | 'maintenance') => {
    if (table.status === 'in-use') {
      toast({ variant: 'destructive', title: "Action Forbidden", description: "Cannot change status of a table that is in use." });
      return;
    }
     dispatch({
        type: "UPDATE_TABLE",
        payload: { ...table, status: status },
      });
      toast({ title: "Table Status Updated", description: `${table.name} is now ${status}.` });
  }

  const getStatusBadge = (status: TableType['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'in-use':
        return <Badge variant="destructive">In Use</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Table
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell>
                  {getStatusBadge(table.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(table)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                       <DropdownMenuLabel>Status</DropdownMenuLabel>
                       <DropdownMenuItem onClick={() => handleStatusChange(table, 'available')} disabled={table.status === 'available' || table.status === 'in-use'}>
                            <Wrench className="mr-2 h-4 w-4" /> Set as Available
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleStatusChange(table, 'maintenance')} disabled={table.status === 'maintenance' || table.status === 'in-use'}>
                            <Wrench className="mr-2 h-4 w-4" /> Set for Maintenance
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDeletingTableId(table.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Table
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">{editingTable ? "Edit Table" : "Add New Table"}</DialogTitle>
            <DialogDescription>
              {editingTable ? `Update the name for ${editingTable.name}.` : "Enter a name for the new table."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="table-name">Table Name</Label>
            <Input id="table-name" value={tableName} onChange={(e) => setTableName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSaveTable} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingTableId} onOpenChange={() => setDeletingTableId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the table.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTable} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
