import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  Edit2,
  Package,
  RefreshCw,
  TrendingDown,
  ChevronRight,
  MoreHorizontal,
  History,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inventoryItems, InventoryItem } from "@/data/mock-data";
import { toast } from "sonner";

const AdminInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Vegetables",
    currentStock: "",
    unit: "kg",
    minThreshold: "",
    pricePerUnit: ""
  });

  const getStatusColor = (status: InventoryItem["status"]) => {
    switch (status) {
      case "In Stock": return "bg-green-500/10 text-green-600 border-green-200";
      case "Low Stock": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Out of Stock": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const lowStockCount = items.filter(i => i.status === "Low Stock").length;
  const outOfStockCount = items.filter(i => i.status === "Out of Stock").length;

  const handleRestock = (id: string) => {
    toast.success("Restock request sent", {
      description: `Stock update initiated for item ${id}`,
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new item object
    const itemToAdd: InventoryItem = {
      id: `INV${Math.floor(100 + Math.random() * 900)}`,
      name: newItem.name,
      category: newItem.category as any,
      currentStock: Number(newItem.currentStock),
      unit: newItem.unit as any,
      minThreshold: Number(newItem.minThreshold),
      lastRestocked: new Date().toISOString().split('T')[0],
      pricePerUnit: Number(newItem.pricePerUnit),
      status: Number(newItem.currentStock) === 0
        ? "Out of Stock"
        : Number(newItem.currentStock) <= Number(newItem.minThreshold)
          ? "Low Stock"
          : "In Stock"
    };

    setItems([itemToAdd, ...items]);
    setIsAddDialogOpen(false);
    setNewItem({
      name: "",
      category: "Vegetables",
      currentStock: "",
      unit: "kg",
      minThreshold: "",
      pricePerUnit: ""
    });

    toast.success("Item Added Successfully", {
      description: `${itemToAdd.name} has been added to inventory.`,
    });
  };

  return (
    <div className="container w-full p-2 space-y-2 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground text-sm">Track and manage your restaurant's stock levels.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" className="gap-2 h-10 px-3 md:px-4">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Stock History</span>
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary gap-2 h-10 px-3 md:px-4">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:flex">Add Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-1rem)] h-[90vh] overflow-y-auto rounded-md sm:max-w-[500px] p-0  border-none shadow-2xl dialog-content-custom scroll-smooth">
              <form onSubmit={handleAddItem}>
                <div className="gradient-primary p-6 text-primary-foreground">
                  <DialogTitle className="text-2xl font-heading font-bold">Add New Stock</DialogTitle>
                  <DialogDescription className="text-primary-foreground/80 mt-1">
                    Enter the details of the new item to track in your inventory.
                  </DialogDescription>
                </div>

                <div className="p-6 space-y-5 bg-card">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Item Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Fresh Tomatoes"
                      className="h-11"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Meat">Meat</SelectItem>
                          <SelectItem value="Spices">Spices</SelectItem>
                          <SelectItem value="Beverages">Beverages</SelectItem>
                          <SelectItem value="Grains">Grains</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Type</Label>
                      <Select
                        value={newItem.unit}
                        onValueChange={(val) => setNewItem({ ...newItem, unit: val })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="liters">Liters (L)</SelectItem>
                          <SelectItem value="units">Units (pcs)</SelectItem>
                          <SelectItem value="packs">Packs</SelectItem>
                          <SelectItem value="grams">Grams (g)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0.00"
                        className="h-11"
                        value={newItem.currentStock}
                        onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="threshold" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min Threshold</Label>
                      <Input
                        id="threshold"
                        type="number"
                        placeholder="Low stock alert at..."
                        className="h-11"
                        value={newItem.minThreshold}
                        onChange={(e) => setNewItem({ ...newItem, minThreshold: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price per Unit (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="h-11"
                      value={newItem.pricePerUnit}
                      onChange={(e) => setNewItem({ ...newItem, pricePerUnit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <DialogFooter className="p-6 pt-0 bg-card gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-11 px-6">
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary h-11 px-8">
                    Save Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            
            <DialogContent className="w-[calc(100vw-1rem)] h-[90vh] overflow-y-auto rounded-md sm:max-w-[500px] p-0  border-none shadow-2xl dialog-content-custom scroll-smooth">
              <form onSubmit={handleAddItem}>
                <div className="gradient-primary p-6 text-primary-foreground">
                  <DialogTitle className="text-2xl font-heading font-bold">Edit Stock</DialogTitle>
                  <DialogDescription className="text-primary-foreground/80 mt-1">
                    Enter the details of the Edit item to track in your inventory.
                  </DialogDescription>
                </div>

                <div className="p-6 space-y-5 bg-card">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Item Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Fresh Tomatoes"
                      className="h-11"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Meat">Meat</SelectItem>
                          <SelectItem value="Spices">Spices</SelectItem>
                          <SelectItem value="Beverages">Beverages</SelectItem>
                          <SelectItem value="Grains">Grains</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Type</Label>
                      <Select
                        value={newItem.unit}
                        onValueChange={(val) => setNewItem({ ...newItem, unit: val })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="liters">Liters (L)</SelectItem>
                          <SelectItem value="units">Units (pcs)</SelectItem>
                          <SelectItem value="packs">Packs</SelectItem>
                          <SelectItem value="grams">Grams (g)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0.00"
                        className="h-11"
                        value={newItem.currentStock}
                        onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="threshold" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min Threshold</Label>
                      <Input
                        id="threshold"
                        type="number"
                        placeholder="Low stock alert at..."
                        className="h-11"
                        value={newItem.minThreshold}
                        onChange={(e) => setNewItem({ ...newItem, minThreshold: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price per Unit (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="h-11"
                      value={newItem.pricePerUnit}
                      onChange={(e) => setNewItem({ ...newItem, pricePerUnit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <DialogFooter className="p-6 pt-0 bg-card gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-11 px-6">
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary h-11 px-8">
                    Save Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="overflow-hidden border-border/50 shadow-sm group hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Items</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              Active stock entries
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 shadow-sm group hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Low Stock Alerts</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Items below threshold</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 shadow-sm group hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Out of Stock</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                Category
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort by Stock
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[250px]">Item Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Threshold</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items
                .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium bg-muted/50 border-border/50">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.currentStock <= item.minThreshold ? 'text-amber-600' : 'text-foreground'}`}>
                          {item.currentStock}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">{item.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{item.minThreshold} {item.unit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium">{item.lastRestocked}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-2.5 py-0.5 rounded-full border shadow-none ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                              setEditingItem(item);      // set the item to edit
                              setIsEditDialogOpen(true); // open the dialog
                            }}
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleRestock(item.id)}>
                            <RefreshCw className="h-3.5 w-3.5" /> Restock Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                            Archive Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventoryPage;
