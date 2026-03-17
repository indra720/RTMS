import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  CheckCircle2, AlertCircle, Utensils, IndianRupee,
  Layers, Package, Star, TrendingUp, Info, History, Tag
} from "lucide-react";
import { menuItems as mockMenuItems, type MenuItem, menuCategories as mockMenuCategories } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [menuCategories, setMenuCategories] = useState<string[]>(mockMenuCategories);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // New Dish State
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    emoji: "🍲",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
  });

  const stats = useMemo(() => {
    return {
      total: menuItems.length,
      categories: menuCategories.length,
      avgPrice: (menuItems.reduce((acc, curr) => acc + curr.price, 0) / (menuItems.length || 1)).toFixed(0)
    };
  }, [menuItems, menuCategories]);

  const categories = useMemo(() => 
    ["all", ...menuCategories], 
  [menuCategories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, search, categoryFilter]);

  const toggleAvailability = (id: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
    toast.success("Availability updated", {
      description: `Dish status has been changed successfully.`,
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.price) {
      toast.error("Missing Information", { description: "Please fill in all required fields." });
      return;
    }

    const item: MenuItem = {
      id: menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1,
      name: newItem.name,
      category: newItem.category,
      price: parseFloat(newItem.price),
      description: newItem.description || "No description provided",
      emoji: newItem.emoji,
      image: newItem.image,
      isAvailable: true
    };

    setMenuItems(prev => [item, ...prev]);
    setIsAddModalOpen(false);
    setNewItem({ 
      name: "", 
      category: "", 
      price: "", 
      description: "", 
      emoji: "🍲", 
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" 
    });
    toast.success("Dish Created!", { description: `${item.name} has been added to the menu.` });
  };

  const handleUpdateItem = () => {
    if (!selectedItem) return;
    
    setMenuItems(prev => prev.map(item => 
      item.id === selectedItem.id ? selectedItem : item
    ));
    setIsEditModalOpen(false);
    toast.success("Update Successful", { description: "Dish information has been synchronized." });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !menuCategories.includes(newCategoryName.trim())) {
      setMenuCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName("");
      toast.success("Category Added", { description: `${newCategoryName.trim()} has been added.` });
    } else {
      toast.error("Invalid Category", { description: "Category name is empty or already exists." });
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setMenuCategories(prev => prev.filter(cat => cat !== catToDelete));
    toast.error("Category Deleted", { description: `${catToDelete} has been removed.` });
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleInventory = (item: MenuItem) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast.error("Item Deleted", {
      description: "Menu item has been removed from the list.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-2 space-y-2 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Menu Master</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create, manage and monitor your menu items in real-time.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Quick Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 w-full md:w-56 bg-card border-border/50 rounded-lg text-sm" 
            />
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg h-10 px-4 font-bold gap-2"
          >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Dish</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
            className="rounded-lg h-10 px-4 font-bold gap-2"
          >
            <Tag className="h-4 w-4" /> <span className="hidden sm:inline">Categories</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Dishes", value: stats.total, icon: Utensils, change: "+12%", color: "text-primary" },
          { label: "Categories", value: stats.categories, icon: Layers, change: "Stable", color: "text-purple-500" },
          { label: "Best Seller", value: "Butter Chicken", icon: Star, change: "Hot", color: "text-orange-500" },
          { label: "Avg. Ticket", value: `₹${stats.avgPrice}`, icon: IndianRupee, change: "-2%", color: "text-emerald-500" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="font-heading font-bold text-2xl text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className={`text-xs font-medium ${stat.change.startsWith('+') || stat.change === 'Hot' ? 'text-status-available' : 'text-muted-foreground'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Menu Inventory</span>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-auto gap-2 rounded-xl h-9 bg-card/50 border-border/50 shadow-sm text-[10px] font-bold">
              <Filter className="h-3 w-3 " />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize text-[10px] font-semibold rounded-lg">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dish Detail</th>
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pricing</th>
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Inventory</th>
                  <th className="text-right py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-border/20"
              >
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <motion.tr 
                      key={item.id}
                      variants={itemVariants}
                      layout
                      className="hover:bg-muted/5 transition-all group"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-16 rounded-xl overflow-hidden border border-border/30 group-hover:scale-105 transition-all duration-300">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm tracking-tight">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground/80 font-medium line-clamp-1 max-w-[200px] mt-0.5 italic">"{item.description}"</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <Badge variant="secondary" className="capitalize rounded-lg px-2 py-0.5 font-semibold text-[9px] tracking-wide bg-primary/5 text-primary border-primary/10">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-6 font-semibold text-foreground text-sm">
                        ₹{item.price}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={item.isAvailable}
                            onCheckedChange={() => toggleAvailability(item.id)}
                            className="data-[state=checked]:bg-emerald-500 scale-75"
                          />
                          <Badge className={`${item.isAvailable ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'} border-none text-[8px] font-bold uppercase px-1.5 py-0.5 tracking-tighter shadow-none`}>
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted transition-colors">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border border-border shadow-xl p-1.5 min-w-[160px] bg-card">
                            <DropdownMenuItem onClick={() => handleEdit(item)} className="rounded-lg gap-2.5 cursor-pointer font-medium py-2 text-xs">
                              <Edit2 className="h-3.5 w-3.5 text-primary" /> Edit Dish Info
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInventory(item)} className="rounded-lg gap-2.5 cursor-pointer font-medium py-2 text-xs">
                              <Package className="h-3.5 w-3.5 text-orange-500" /> Manage Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/30" />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item.id)}
                              className="rounded-lg gap-2.5 cursor-pointer font-medium py-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      
      {/* Add Dish Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-4xl h-[90vh] overflow-y-auto lg:overflow-hidden  rounded-3xl border border-border shadow-2xl bg-card p-8 font-body">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold tracking-tight">Create New Dish</DialogTitle>
            <p className="text-sm text-muted-foreground font-medium">Add a new masterpiece to your restaurant's collection.</p>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 grid gap-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest ml-1">Dish Name</Label>
                <Input 
                  id="name" 
                  placeholder="Signature Pizza..." 
                  className="rounded-xl h-12 bg-muted/30 border-border font-medium text-sm px-4"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emoji" className="text-xs font-bold uppercase tracking-widest ml-1">Emoji</Label>
                <Input 
                  id="emoji" 
                  placeholder="🍕" 
                  className="rounded-xl h-12 bg-muted/30 border-border font-medium text-center text-xl px-2"
                  value={newItem.emoji}
                  onChange={(e) => setNewItem(prev => ({ ...prev, emoji: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest ml-1">Image URL</Label>
              <Input 
                id="image" 
                placeholder="https://images.unsplash.com/..." 
                className="rounded-xl h-12 bg-muted/30 border-border font-medium text-sm px-4"
                value={newItem.image}
                onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest ml-1">Description</Label>
              <Input 
                id="description" 
                placeholder="Brief description of the dish..." 
                className="rounded-xl h-12 bg-muted/30 border-border font-medium text-sm px-4"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest ml-1">Category</Label>
                <div className="flex gap-2">
                  <Select value={newItem.category} onValueChange={(val) => setNewItem(prev => ({ ...prev, category: val }))}>
                    <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-border px-4 font-medium flex-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border shadow-xl p-2 font-body">
                      {menuCategories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize font-medium rounded-lg">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl shrink-0"
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest ml-1">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="499" 
                  className="rounded-xl h-12 bg-muted/30 border-border px-4 font-semibold"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-10 sm:justify-between gap-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
            <Button className="gradient-primary border-0 rounded-xl h-12 px-10 font-bold shadow-lg shadow-primary/20" onClick={handleAddItem}>Publish Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dish Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[550px] h-[90vh] overflow-y-auto rounded-3xl border border-border shadow-2xl bg-card p-8 font-body">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-border/30">
                <img src={selectedItem?.image} alt="" className="h-full w-full object-cover" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Edit <span className="text-primary">Details</span></DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground font-medium ml-1">Update the information for {selectedItem?.name}.</p>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 grid gap-2">
                <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-widest ml-1">Dish Name</Label>
                <Input 
                  id="edit-name" 
                  value={selectedItem?.name || ""} 
                  onChange={(e) => setSelectedItem(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="rounded-xl h-12 bg-muted/30 border-border font-medium text-sm px-4" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-emoji" className="text-xs font-bold uppercase tracking-widest ml-1">Emoji</Label>
                <Input 
                  id="edit-emoji" 
                  value={selectedItem?.emoji || ""} 
                  onChange={(e) => setSelectedItem(prev => prev ? ({ ...prev, emoji: e.target.value }) : null)}
                  className="rounded-xl h-12 bg-muted/30 border-border font-medium text-center text-xl px-2"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-xs font-bold uppercase tracking-widest ml-1">Image URL</Label>
              <Input 
                id="edit-image" 
                value={selectedItem?.image || ""} 
                onChange={(e) => setSelectedItem(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                className="rounded-xl h-12 bg-muted/30 border-border font-medium text-sm px-4" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-widest ml-1">Description</Label>
              <Input 
                id="edit-description" 
                value={selectedItem?.description || ""} 
                onChange={(e) => setSelectedItem(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                className="rounded-xl h-12 bg-muted/30 border-border font-medium text-sm px-4" 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="edit-category" className="text-xs font-bold uppercase tracking-widest ml-1">Category</Label>
                <Select value={selectedItem?.category} onValueChange={(val) => setSelectedItem(prev => prev ? ({ ...prev, category: val }) : null)}>
                  <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-border px-4 font-medium">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border shadow-xl p-2 font-body">
                    {menuCategories.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize font-medium rounded-lg">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price" className="text-xs font-bold uppercase tracking-widest ml-1">Price (₹)</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  value={selectedItem?.price || ""} 
                  onChange={(e) => setSelectedItem(prev => prev ? ({ ...prev, price: parseFloat(e.target.value) }) : null)}
                  className="rounded-xl h-12 bg-muted/30 border-border font-bold text-primary" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Inventory Status</Label>
                <p className="text-[10px] text-muted-foreground font-medium">Toggle availability for this item.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold tracking-wider ${selectedItem?.isAvailable ? 'text-emerald-500' : 'text-destructive'}`}>
                  {selectedItem?.isAvailable ? 'AVAILABLE' : 'OUT OF STOCK'}
                </span>
                <Switch 
                  checked={selectedItem?.isAvailable} 
                  onCheckedChange={(val) => setSelectedItem(prev => prev ? ({ ...prev, isAvailable: val }) : null)} 
                  className="data-[state=checked]:bg-emerald-500 scale-75" 
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-10 gap-3">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-xl h-12 px-6 font-bold flex-1">Cancel</Button>
            <Button className="gradient-primary border-0 rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20 flex-[2]" onClick={handleUpdateItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inventory Modal */}
      <Dialog open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[450px] h-[90vh] overflow-y-auto  rounded-3xl border border-border shadow-2xl bg-card p-8 font-body">
          <DialogHeader className="mb-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-3xl mx-auto mb-4 border border-orange-500/20 shadow-inner">
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase ">Stock Management</DialogTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">Adjust inventory levels for <span className="text-foreground font-bold">{selectedItem?.name}</span></p>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  <span className="text-xs font-bold uppercase tracking-widest">Automatic Stock</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 scale-75" />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {['High', 'Low', 'Out'].map((lvl) => (
                  <button key={lvl} className={`h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    lvl === 'High' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-sm' : 'border-border/50 hover:bg-muted/50'
                  }`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed italic">
                Waiters will receive an instant notification if this dish is marked as "Low" or "Out of Stock".
              </p>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button className="w-full gradient-primary border-0 rounded-xl h-12 font-bold shadow-lg shadow-primary/20" onClick={() => {
              setIsInventoryModalOpen(false);
              toast.success("Inventory Updated");
            }}>Confirm Levels</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Management Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] h-[90vh] overflow-y-auto lg:overflow-hidden sm:max-w-[450px] rounded-3xl border border-border shadow-2xl bg-card p-8 font-body">
          <DialogHeader className="mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4 border border-primary/20 shadow-inner">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase  text-center">Manage Categories</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground font-medium text-center">Add or remove categories for your menu items.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="new-category" className="text-xs font-bold uppercase tracking-widest ml-1">Add New Category</Label>
              <div className="flex gap-2">
                <Input 
                  id="new-category" 
                  placeholder="e.g. Desserts" 
                  className="rounded-xl h-11 bg-muted/30 border-border font-medium text-sm px-4" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCategory();
                    }
                  }}
                />
                <Button onClick={handleAddCategory} className="rounded-xl h-11 px-4 font-bold text-sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-widest ml-1">Existing Categories</Label>
              <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                {menuCategories.map(cat => (
                  <div key={cat} className="flex items-center justify-between bg-muted/30 rounded-lg py-2 px-4 border border-border/50">
                    <span className="text-sm font-medium capitalize">{cat}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCategory(cat)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)} className="w-full rounded-xl h-12 font-bold">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMenuPage;
