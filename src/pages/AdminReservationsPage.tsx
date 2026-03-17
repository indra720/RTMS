import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reservations as mockReservations, customerProfiles, tables, type Reservation } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, Eye, CheckCircle2, XCircle, CalendarCheck, Wand2, 
  LayoutGrid, List, Users, Clock, Phone, Mail, 
  MoreHorizontal, Trash2, User, ChevronRight, Sparkles,
  CalendarDays, MapPin, MessageSquare, Plus, Info, Tag
} from "lucide-react";
import { CustomerProfilePanel } from "@/components/CustomerProfilePanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const statusStyles: Record<string, { dot: string; badge: string; color: string; bg: string }> = {
  confirmed: { dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", color: "text-emerald-600", bg: "bg-emerald-50" },
  pending: { dot: "bg-amber-500", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20", color: "text-amber-600", bg: "bg-amber-50" },
  cancelled: { dot: "bg-rose-500", badge: "bg-rose-500/10 text-rose-600 border-rose-500/20", color: "text-rose-600", bg: "bg-rose-50" },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState(mockReservations);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerPanel, setCustomerPanel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newBookingOpen, setNewBookingOpen] = useState(false);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch = r.guestName.toLowerCase().includes(filter.toLowerCase()) || r.id.toLowerCase().includes(filter.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, filter, statusFilter]);

  const updateStatus = (id: string, status: Reservation["status"]) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Booking ${status}`);
  };

  const autoAllocateTable = (reservation: Reservation) => {
    const available = tables.filter((t) => t.status === "available" && t.capacity >= reservation.guests);
    const best = available.sort((a, b) => a.capacity - b.capacity)[0];
    if (best) {
      setReservations((prev) => prev.map((r) => r.id === reservation.id ? { ...r, tableNumber: best.number } : r));
      toast.success(`Allocated to T${best.number}`);
    } else {
      toast.error("No tables available");
    }
  };

  const selectedProfile = customerPanel ? customerProfiles.find((p) => p.name === customerPanel) : null;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground uppercase tracking-tight">
            Reservation Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {reservations.length} Active Bookings
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

          <Dialog open={newBookingOpen} onOpenChange={setNewBookingOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2 rounded-xl shadow-elevated h-11 px-5 font-bold">
                <Plus className="h-4 w-4" /> New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] sm:max-w-2xl h-[90vh] overflow-y-auto dialog-content-custom rounded-2xl border border-border shadow-elevated bg-card p-0 ">
              <div className="p-6 border-b border-border/50 bg-muted/20">
                <DialogTitle className="font-heading font-bold text-xl uppercase tracking-tight">Advanced Booking Registration</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Register a new guest entity into the floor system.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Guest Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Full legal name" className="pl-9 rounded-xl h-11 bg-muted/10 border-border/50 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">PAX Size</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="02" className="pl-9 rounded-xl h-11 bg-muted/10 border-border/50" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Contact Protocol</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+91 00000 00000" className="pl-9 rounded-xl h-11 bg-muted/10 border-border/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Interface</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="guest@example.com" className="pl-9 rounded-xl h-11 bg-muted/10 border-border/50" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Digital Node (Table)</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl h-11 bg-muted/10 border-border/50">
                        <SelectValue placeholder="Auto" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map(t => <SelectItem key={t.id} value={t.number}>Node T{t.number}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Timeline Date</Label>
                    <Input type="date" className="rounded-xl h-11 bg-muted/10 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Arrival Time</Label>
                    <Input type="time" className="rounded-xl h-11 bg-muted/10 border-border/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Special Directives (Notes)</Label>
                  <Textarea placeholder="Any specific requirements or allergens..." className="rounded-xl bg-muted/10 border-border/50 min-h-[100px] resize-none" />
                </div>
              </div>
              <DialogFooter className="p-6 bg-muted/20 border-t border-border/50 gap-3">
                <Button variant="ghost" onClick={() => setNewBookingOpen(false)} className="rounded-xl h-11 font-bold">Abort</Button>
                <Button onClick={() => setNewBookingOpen(false)} className="gradient-primary text-primary-foreground border-0 rounded-xl h-11 px-8 font-bold shadow-elevated">Finalize Booking</Button>
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
            placeholder="Search by name or ID..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 h-11 rounded-xl bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          /* --- Grid View --- */
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${statusStyles[r.status].dot} animate-pulse`} />
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${statusStyles[r.status].color}`}>
                        {r.status}
                      </p>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mt-1 truncate max-w-[140px]">
                      {r.guestName}
                    </h3>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">ID: {r.id}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-glass">
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs" onClick={() => setCustomerPanel(r.guestName)}>
                        <User className="h-4 w-4 text-muted-foreground" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs" onClick={() => autoAllocateTable(r)}>
                        <Wand2 className="h-4 w-4 text-muted-foreground" /> Allocate
                      </DropdownMenuItem>
                      <div className="h-px bg-border my-2" />
                      <DropdownMenuItem className="rounded-lg gap-2 font-medium text-destructive focus:text-destructive cursor-pointer text-xs" onClick={() => updateStatus(r.id, "cancelled")}>
                        <Trash2 className="h-4 w-4" /> Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/20">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Schedule</p>
                    <p className="text-xs font-semibold text-foreground">{r.date} @ {r.time}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Details</p>
                    <p className="text-xs font-semibold text-foreground">{r.guests} PAX · T{r.tableNumber}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {r.status === "pending" ? (
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl h-9 text-xs font-bold border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                      onClick={() => updateStatus(r.id, "confirmed")}
                    >
                      Confirm
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl h-9 text-xs font-semibold"
                      onClick={() => setCustomerPanel(r.guestName)}
                    >
                      Profile
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/50 hover:bg-primary/5 hover:text-primary transition-all">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl rounded-2xl border border-border shadow-elevated bg-card p-0 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 bg-muted/20 p-8 border-r border-border/20 flex flex-col items-center text-center">
                          <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                            {r.guestName.charAt(0)}
                          </div>
                          <h3 className="font-heading font-bold text-lg text-foreground">{r.guestName}</h3>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 mb-6">{r.id}</p>
                          <div className={`w-full py-2 px-4 rounded-xl border flex items-center justify-center gap-2 ${statusStyles[r.status].badge}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[r.status].dot}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{r.status}</span>
                          </div>
                        </div>
                        <div className="flex-1 p-8 space-y-6">
                          <div>
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Reservation Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { label: "Date", value: r.date, icon: CalendarDays },
                                { label: "Time", value: r.time, icon: Clock },
                                { label: "Guests", value: `${r.guests} PAX`, icon: Users },
                                { label: "Table", value: `T${r.tableNumber}`, icon: MapPin },
                              ].map((item, idx) => (
                                <div key={idx} className="bg-muted/30 p-3 rounded-xl border border-border/10">
                                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <item.icon className="h-3 w-3 text-primary/50" /> {item.label}
                                  </p>
                                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Contact Info</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/10">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                  <Phone className="h-3.5 w-3.5 text-primary/50" /> Phone
                                </span>
                                <span className="text-sm font-semibold text-foreground">{r.phone || "—"}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/10">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5 text-primary/50" /> Email
                                </span>
                                <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">{r.contact}</span>
                              </div>
                            </div>
                          </div>
                          {r.specialRequests && (
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-2">
                                <Info className="h-3.5 w-3.5" /> Special Request
                              </p>
                              <p className="text-sm text-foreground/80 italic">"{r.specialRequests}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* --- List View --- */
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
                    {["Log ID", "Guest", "Node/PAX", "Timeline", "Status", "Actions"].map(h => (
                      <th key={h} className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">{r.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <button onClick={() => setCustomerPanel(r.guestName)} className="flex items-center gap-3 text-left">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {r.guestName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{r.guestName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{r.phone || "No Phone"}</p>
                          </div>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center font-bold text-xs border border-border/50">T{r.tableNumber}</div>
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{r.guests} PAX</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-foreground">{r.date}</p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{r.time}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[r.status].badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[r.status].dot}`} />
                          {r.status}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-glass">
                            <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs" onClick={() => setCustomerPanel(r.guestName)}>
                              <User className="h-4 w-4 text-muted-foreground" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 font-medium cursor-pointer text-xs" onClick={() => autoAllocateTable(r)}>
                              <Wand2 className="h-4 w-4 text-muted-foreground" /> Allocate
                            </DropdownMenuItem>
                            <div className="h-px bg-border my-2" />
                            <DropdownMenuItem className="rounded-lg gap-2 font-medium text-destructive focus:text-destructive cursor-pointer text-xs" onClick={() => updateStatus(r.id, "cancelled")}>
                              <Trash2 className="h-4 w-4" /> Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProfile && (
          <CustomerProfilePanel profile={selectedProfile} onClose={() => setCustomerPanel(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
