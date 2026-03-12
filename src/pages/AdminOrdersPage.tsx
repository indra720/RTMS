import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pastOrders as mockOrders, type Bill } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Eye, Clock, Calendar, Receipt, 
  LayoutGrid, List, Users, UtensilsCrossed, 
  MoreHorizontal, Download, Filter, Sparkles, ShoppingBag, User
} from "lucide-react";
import { BillPanel } from "@/components/BillPanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function AdminOrdersPage() {
  const [orders] = useState<Bill[]>(mockOrders);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.id.toLowerCase().includes(filter.toLowerCase()) || 
                           o.customerName.toLowerCase().includes(filter.toLowerCase()) ||
                           o.tableNumber.includes(filter);
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, filter, statusFilter]);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground uppercase tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {orders.length} Processed Transactions
          </p>
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
          <Button variant="outline" className="rounded-xl h-11 border-border/50 font-bold text-[10px] uppercase tracking-widest gap-2">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card border border-border/50 p-4 rounded-xl shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search by ID, guest, or table..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 h-11 rounded-xl bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50 font-bold text-[10px] uppercase tracking-widest">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs font-bold uppercase">All Orders</SelectItem>
            <SelectItem value="paid" className="text-xs font-bold uppercase">Paid</SelectItem>
            <SelectItem value="pending" className="text-xs font-bold uppercase">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          /* --- Order Grid View --- */
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filtered.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">
                      {o.status}
                    </Badge>
                    <h3 className="font-heading font-bold text-lg text-foreground tracking-tighter">
                      {o.id}
                    </h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-glass">
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs" onClick={() => setSelectedBill(o)}>
                        <Receipt className="h-4 w-4 text-muted-foreground" /> View Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs">
                        <Download className="h-4 w-4 text-muted-foreground" /> Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="py-4 border-y border-border/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Guest
                    </span>
                    <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">{o.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <LayoutGrid className="h-3 w-3" /> Node
                    </span>
                    <span className="text-xs font-bold text-foreground">Table {o.tableNumber}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="h-3 w-3" /> Items
                    </span>
                    <span className="text-xs font-bold text-foreground">{o.items.length} units</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Amount</p>
                    <p className="font-heading font-bold text-xl text-primary leading-none">${o.total.toFixed(2)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl bg-muted/20 hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => setSelectedBill(o)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* --- Order List View --- */
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
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order ID</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guest Identity</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Terminal</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Timeline</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Val.</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">{o.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {o.customerName.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{o.customerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold px-2 py-0.5 rounded-md border-border/50">T{o.tableNumber}</Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-foreground">{o.date}</p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{o.time}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-heading font-bold text-sm text-foreground">${o.total.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-primary/10 hover:text-primary"
                            onClick={() => setSelectedBill(o)}
                          >
                            <Receipt className="h-3.5 w-3.5" /> Details
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-glass">
                              <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs">
                                <Download className="h-4 w-4 text-muted-foreground" /> Export Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs">
                                <Clock className="h-4 w-4 text-muted-foreground" /> Refund Protocol
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

      {/* Bill Details Modal */}
      <AnimatePresence>
        {selectedBill && (
          <BillPanel bill={selectedBill} onClose={() => setSelectedBill(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
