import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { kitchenOrders, menuItems, type KitchenOrder } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChefHat, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Bell, 
  Timer, 
  AlertCircle,
  Wine,
  UtensilsCrossed,
  LayoutGrid
} from "lucide-react";
import { toast } from "sonner";

const columns = [
  { key: "new" as const, label: "New Orders", icon: Bell, color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "cooking" as const, label: "Cooking", icon: Flame, color: "text-orange-600", bg: "bg-orange-600/10" },
  { key: "ready" as const, label: "Ready", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-600/10" },
  { key: "completed" as const, label: "Completed", icon: ChefHat, color: "text-muted-foreground", bg: "bg-muted/20" },
];

type Station = "all" | "kitchen" | "bar";

export default function KitchenPage() {
  const [orders, setOrders] = useState(kitchenOrders);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeStation, setActiveStation] = useState<Station>("all");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Helper to check if an item belongs to a station
  const isItemInStation = (itemName: string, station: Station) => {
    if (station === "all") return true;
    const menuItem = menuItems.find(m => m.name === itemName);
    const isBeverage = menuItem?.category === "Beverages";
    return station === "bar" ? isBeverage : !isBeverage;
  };

  // Filter orders and items based on station
  const filteredOrders = useMemo(() => {
    return orders.map(order => ({
      ...order,
      items: order.items.filter(item => isItemInStation(item.name, activeStation))
    })).filter(order => order.items.length > 0);
  }, [orders, activeStation]);

  const moveOrder = (id: string, newStatus: KitchenOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    
    if (newStatus === "ready") {
      toast.success(`Order ${id} is ready!`, {
        description: "Waitstaff has been notified.",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    }
  };

  const nextStatus: Record<string, KitchenOrder["status"] | null> = {
    new: "cooking",
    cooking: "ready",
    ready: "completed",
    completed: null,
  };

  const actionLabels: Record<string, string> = {
    new: "Start Preparation",
    cooking: "Mark Ready",
    ready: "Confirm Served",
  };

  const getMinutesElapsed = (orderTime: string) => {
    const [time, modifier] = orderTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const orderDate = new Date();
    orderDate.setHours(hours, minutes, 0);
    
    const diff = Math.floor((currentTime.getTime() - orderDate.getTime()) / 60000);
    return Math.max(0, diff);
  };

  const getTimerColor = (minutes: number) => {
    if (minutes < 5) return "text-green-600 bg-green-50 border-green-200";
    if (minutes < 12) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-destructive bg-red-50 border-red-200 animate-pulse-subtle";
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-3.5rem)] flex flex-col space-y-6 max-w-[1600px] mx-auto overflow-hidden">
      {/* Header with Station Routing Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
            Kitchen Display System 
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">LIVE</Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Last Updated: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/50 self-start lg:self-center">
          <Button 
            variant={activeStation === "all" ? "default" : "ghost"} 
            size="sm" 
            className={`rounded-lg gap-2 h-9 px-4 ${activeStation === "all" ? "shadow-sm" : ""}`}
            onClick={() => setActiveStation("all")}
          >
            <LayoutGrid className="h-4 w-4" /> All
          </Button>
          <Button 
            variant={activeStation === "kitchen" ? "default" : "ghost"} 
            size="sm" 
            className={`rounded-lg gap-2 h-9 px-4 ${activeStation === "kitchen" ? "shadow-sm" : ""}`}
            onClick={() => setActiveStation("kitchen")}
          >
            <UtensilsCrossed className="h-4 w-4" /> Kitchen
          </Button>
          <Button 
            variant={activeStation === "bar" ? "default" : "ghost"} 
            size="sm" 
            className={`rounded-lg gap-2 h-9 px-4 ${activeStation === "bar" ? "shadow-sm" : ""}`}
            onClick={() => setActiveStation("bar")}
          >
            <Wine className="h-4 w-4" /> Bar
          </Button>
        </div>

        <div className="hidden xl:flex items-center gap-4 bg-card px-4 py-2 rounded-xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-green-500" /> &lt; 5m
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-amber-500" /> 5-12m
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-destructive" /> &gt; 12m
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-0 overflow-hidden">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.key);
          return (
            <div key={col.key} className="flex flex-col min-h-0 space-y-4">
              <div className={`flex items-center gap-3 p-3 rounded-xl border border-border/50 shadow-sm ${col.bg}`}>
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center bg-background shadow-sm ${col.color}`}>
                  <col.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm tracking-tight">{col.label}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{colOrders.length} active</p>
                </div>
              </div>
              
              <div className="flex-1 bg-muted/10 rounded-2xl p-3 space-y-4 overflow-y-auto scrollbar-hide border border-border/20">
                <AnimatePresence mode="popLayout">
                  {colOrders.map((order) => {
                    const elapsed = getMinutesElapsed(order.orderTime);
                    const timerStyles = getTimerColor(elapsed);
                    
                    return (
                      <motion.div
                        key={`${order.id}-${activeStation}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-card border border-border/50 rounded-2xl p-5 shadow-elevated relative group overflow-hidden"
                      >
                        {/* Status side bar */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${elapsed >= 12 ? 'bg-destructive' : elapsed >= 5 ? 'bg-amber-500' : 'bg-green-500'}`} />

                        <div className="flex items-center justify-between mb-4 pl-2">
                          <div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none block mb-1">Table</span>
                            <span className="text-2xl font-heading font-black text-foreground">{order.tableNumber}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${timerStyles}`}>
                            <Timer className="h-3.5 w-3.5" />
                            {elapsed}m
                          </div>
                        </div>

                        <div className="space-y-2.5 mb-5 pl-2">
                          {order.items.map((item, j) => (
                            <div key={j} className="flex items-start justify-between gap-3 bg-muted/20 p-2.5 rounded-xl border border-border/10">
                              <span className="text-sm text-foreground font-bold leading-tight">{item.name}</span>
                              <Badge className="h-6 min-w-[24px] bg-foreground text-background flex items-center justify-center font-black p-0 shadow-sm">
                                {item.quantity}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {order.specialNotes && (
                          <div className="text-[11px] text-amber-700 bg-amber-50/50 rounded-xl px-3 py-2.5 mb-5 ml-2 flex items-start gap-2 border border-amber-100/50">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span className="font-semibold italic leading-relaxed">{order.specialNotes}</span>
                          </div>
                        )}

                        <div className="pl-2">
                          {nextStatus[order.status] && (
                            <Button
                              className="w-full gap-2 rounded-xl font-heading font-black text-[10px] uppercase tracking-widest h-11 gradient-primary shadow-lg active:scale-95 transition-all"
                              onClick={() => moveOrder(order.id, nextStatus[order.status]!)}
                            >
                              {actionLabels[order.status]} <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {colOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center opacity-30 grayscale">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <col.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-heading font-black text-muted-foreground uppercase tracking-widest">No orders in {activeStation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
