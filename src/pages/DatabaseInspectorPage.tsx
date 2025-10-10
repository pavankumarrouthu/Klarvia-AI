import { useState, useEffect } from "react";
import { backendClient } from "@/integrations/backendClient";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface TableData {
  [key: string]: any;
}

export function DatabaseInspectorPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [schema, setSchema] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, limit: 50, offset: 0, hasMore: false });
  
  const [editingRecord, setEditingRecord] = useState<TableData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<TableData>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/?login=true");
    }
  }, [user, authLoading, navigate]);

  // Fetch tables on mount
  useEffect(() => {
    if (user) {
      fetchTables();
    }
  }, [user]);

  // Fetch table data when selected table changes
  useEffect(() => {
    if (selectedTable) {
      fetchTableData();
      fetchTableSchema();
    }
  }, [selectedTable, pagination.offset]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await backendClient.get("/db-inspector/tables");
      setTables(response.data.tables);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch tables",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTableSchema = async () => {
    try {
      const response = await backendClient.get(`/db-inspector/tables/${selectedTable}/schema`);
      setSchema(response.data.schema);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch schema",
        variant: "destructive",
      });
    }
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await backendClient.get(
        `/db-inspector/tables/${selectedTable}/data?limit=${pagination.limit}&offset=${pagination.offset}`
      );
      setTableData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch table data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: TableData) => {
    setEditingRecord(record);
    setEditFormData({ ...record });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    
    try {
      await backendClient.put(
        `/db-inspector/tables/${selectedTable}/records/${editingRecord.id}`,
        editFormData
      );
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
      setEditDialogOpen(false);
      fetchTableData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update record",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await backendClient.delete(`/db-inspector/tables/${selectedTable}/records/${id}`);
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
      fetchTableData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  const handleNextPage = () => {
    setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Inspector</CardTitle>
          <CardDescription>
            View and manage your Render Postgres database tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table} value={table}>
                      {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchTableData}
              disabled={!selectedTable || loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {selectedTable && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {tableData.length > 0 &&
                        Object.keys(tableData[0]).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={tableData.length > 0 ? Object.keys(tableData[0]).length + 1 : 1}
                          className="text-center"
                        >
                          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : tableData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={1}
                          className="text-center text-muted-foreground"
                        >
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData.map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.entries(row).map(([key, value]) => (
                            <TableCell key={key} className="max-w-xs truncate">
                              {value !== null && typeof value === 'object'
                                ? JSON.stringify(value)
                                : String(value ?? '')}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(row)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(row.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} records
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={pagination.offset === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!pagination.hasMore}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>
              Make changes to the record. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingRecord &&
              Object.entries(editFormData).map(([key, value]) => {
                // Skip non-editable fields
                if (key === 'id' || key === 'created_at') {
                  return (
                    <div key={key} className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-muted-foreground">{key}</Label>
                      <Input
                        value={String(value ?? '')}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                  );
                }

                return (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={key} className="text-right">
                      {key}
                    </Label>
                    <Input
                      id={key}
                      value={typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, [key]: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                );
              })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
