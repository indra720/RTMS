import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tables as mockTables, type RestaurantTable, type TableStatus, staffMembers, type Bill } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Plus, Pencil, Clock, Receipt, CreditCard, Banknote, 
  QrCode, CheckCircle2, Search, Filter, Users, 
  LayoutGrid, List, MoreHorizontal, Trash2, ArrowUpDown,
  Utensils, Sparkles, ChefHat
} from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  available: { label: "Available", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  reserved: { label: "Reserved", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  occupied: { label: "Occupied", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  serving: { label: "Serving", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  billing: { label: "Billing", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  dirty: { label: "Cleaning", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
};

const waiters = staffMembers.map((s) => s.name);
const sections = ["Main Hall", "Window", "Bar", "Patio", "Private"];

export default function AdminTablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables);
  const [editTable, setEditTable] = useState<RestaurantTable | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [billingTable, setBillingTable] = useState<RestaurantTable | null>(null);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [newTable, setNewTable] = useState({
    number: 13, capacity: 4, shape: "square" as "square" | "round",
    section: "Main Hall", assignedWaiter: "",
  });

  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      const matchesSearch = t.number.includes(search) || (t.assignedWaiter?.toLowerCase().includes(search.toLowerCase()));
      const matchesSection = sectionFilter === "all" || t.section === sectionFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [tables, search, sectionFilter, statusFilter]);

  const updateTable = (id: number, updates: Partial<RestaurantTable>) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setEditTable(null);
    toast.success(`Table updated successfully`);
  };

  const addTable = () => {
    const newT: RestaurantTable = {
      id: Date.now(),
      number: newTable.number + "",
      capacity: newTable.capacity,
      status: "available",
      // @ts-ignore
      shape: newTable.shape,
      section: newTable.section,
      assignedWaiter: newTable.assignedWaiter || undefined,
      position: { x: 100, y: 100, width: 90, height: 90, rotation: 0 },
    };
    setTables((prev) => [...prev, newT]);
    setAddOpen(false);
    setNewTable({ ...newTable, number: newTable.number + 1, assignedWaiter: "" });
    toast.success(`Table ${newT.number} added`);
  };

  const handleProcessPayment = (method: "cash" | "card" | "upi") => {
    if (!billingTable || !billingTable.currentOrder) return;
    setTables(prev => prev.map(t => t.id === billingTable.id ? { ...t, status: "available", currentOrder: undefined } : t));
    setBillingTable(null);
    toast.success("Payment Successful");
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Table Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your restaurant floor and table nodes.</p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="bg-muted/50 p-1 rounded-xl">
            <TabsList className="bg-transparent border-0 h-9">
              <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <LayoutGrid className="h-4 w-4 mr-2" /> <span className="text-xs font-semibold uppercase tracking-wider">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <List className="h-4 w-4 mr-2" /> <span className="text-xs font-semibold uppercase tracking-wider">List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2 rounded-xl shadow-elevated h-11 px-5 font-bold">
                <Plus className="h-4 w-4" /> Add Table
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-xl border border-border shadow-elevated bg-card p-0 overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-muted/20">
                <DialogTitle className="font-heading font-bold text-xl">Add New Table</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Configure a new terminal for the floor.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Table Number</Label>
                    <Input type="number" value={newTable.number} className="rounded-xl h-11 bg-muted/20"
                      onChange={(e) => setNewTable({ ...newTable, number: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Capacity</Label>
                    <Input type="number" value={newTable.capacity} className="rounded-xl h-11 bg-muted/20"
                      onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 2 })} />
                  </div>
                </div>
                {/* ... (rest of form) */}
              </div>
              <DialogFooter className="p-6 bg-muted/20 border-t border-border/50 gap-3">
                <Button variant="ghost" onClick={() => setAddOpen(false)} className="rounded-xl h-11 font-bold">Cancel</Button>
                <Button onClick={addTable} className="gradient-primary text-primary-foreground border-0 rounded-xl h-11 px-8 font-bold shadow-elevated">Create Table</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card border border-border/50 p-4 rounded-xl shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search tables or waiters..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 h-11 rounded-xl bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
            <SelectValue placeholder="All Sections" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Sections</SelectItem>
            {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          /* --- Fantastic Grid View --- */
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filteredTables.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig[t.status].color}`}>
                      {statusConfig[t.status].label}
                    </p>
                    <h3 className="font-heading font-bold text-2xl text-foreground mt-0.5">
                      Table {t.number}
                    </h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-glass">
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer" onClick={() => setEditTable(t)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" /> Edit Table
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer">
                        <QrCode className="h-4 w-4 text-muted-foreground" /> View QR Code
                      </DropdownMenuItem>
                      <div className="h-px bg-border my-2" />
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium text-destructive focus:text-destructive cursor-pointer">
                        <Trash2 className="h-4 w-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-border/20">
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${statusConfig[t.status].border} ${statusConfig[t.status].bg}`}>
                    {t.shape === 'round' ? <div className="h-6 w-6 rounded-full border border-current opacity-40" /> : <div className="h-5 w-7 rounded-sm border border-current opacity-40" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.capacity} Seats</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.section}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Waiter</span>
                    <span className="text-sm font-semibold text-foreground">{t.assignedWaiter || "Unassigned"}</span>
                  </div>
                  {t.status === "billing" ? (
                    <Button 
                      className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-10 text-xs font-bold gap-2 shadow-sm"
                      onClick={() => setBillingTable(t)}
                    >
                      <Receipt className="h-4 w-4" /> Settle Bill
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl h-9 text-xs font-semibold" onClick={() => setEditTable(t)}>
                        Update
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/50">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* --- Professional List View --- */
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-elevated"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    {["Table", "Seats", "Section", "Status", "Waiter", "Actions"].map(h => (
                      <th key={h} className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredTables.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-heading font-bold text-sm border ${statusConfig[t.status].bg} ${statusConfig[t.status].color} ${statusConfig[t.status].border}`}>
                            {t.number}
                          </div>
                          <span className="text-sm font-semibold text-foreground">Table {t.number}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-foreground">{t.capacity} seats</td>
                      <td className="py-4 px-6 text-sm text-foreground">{t.section}</td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig[t.status].bg} ${statusConfig[t.status].color} ${statusConfig[t.status].border}`}>
                          {statusConfig[t.status].label}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">{t.assignedWaiter || "—"}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {t.status === "billing" && (
                            <Button size="sm" className="h-8 rounded-lg gradient-primary text-white border-0 text-xs font-bold px-3 shadow-sm" onClick={() => setBillingTable(t)}>Settle</Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-glass">
                              <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer" onClick={() => setEditTable(t)}>
                                <Pencil className="h-4 w-4 text-muted-foreground" /> Edit Table
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer">
                                <QrCode className="h-4 w-4 text-muted-foreground" /> View QR Code
                              </DropdownMenuItem>
                              <div className="h-px bg-border my-2" />
                              <DropdownMenuItem className="rounded-lg gap-2 font-medium text-destructive focus:text-destructive cursor-pointer">
                                <Trash2 className="h-4 w-4" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settlement Overly */}
      <AnimatePresence>
        {billingTable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setBillingTable(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 16 }}
              className="relative w-full max-w-md bg-card border border-border shadow-elevated rounded-2xl overflow-hidden p-0"
            >
              <div className="p-6 border-b border-border/20 bg-muted/20 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">Settle Bill</h3>
                  <p className="text-xs text-muted-foreground">Table {billingTable.number} • Payment Sync</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-muted/30 rounded-xl p-5 border border-border/20 space-y-3">
                  <div className="space-y-2">
                    {billingTable.currentOrder?.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">{item.name} <span className="text-primary/60 ml-1">x{item.quantity}</span></span>
                        <span className="text-foreground font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 mt-2 border-t border-border/20 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Total Due</span>
                      <span className="text-3xl font-heading font-bold text-primary">${(billingTable.currentOrder?.total || 0).toFixed(2)}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20 bg-primary/5 text-primary">INC. TAX</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['cash', 'card', 'upi'].map((m) => (
                    <Button key={m} variant="outline" onClick={() => handleProcessPayment(m as any)} className="h-20 flex flex-col gap-2 rounded-xl border-border/50 hover:border-primary/40 hover:bg-primary/5 capitalize">
                      <span className="text-xs font-bold">{m}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
