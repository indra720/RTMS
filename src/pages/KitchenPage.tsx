import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { kitchenOrders, type KitchenOrder } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, ArrowRight, CheckCircle2, Flame, Bell } from "lucide-react";

const columns = [
  { key: "new" as const, label: "New Orders", icon: Bell, color: "text-status-reserved" },
  { key: "cooking" as const, label: "Cooking", icon: Flame, color: "text-status-occupied" },
  { key: "ready" as const, label: "Ready", icon: CheckCircle2, color: "text-status-available" },
  { key: "completed" as const, label: "Completed", icon: ChefHat, color: "text-muted-foreground" },
];

export default function KitchenPage() {
  const [orders, setOrders] = useState(kitchenOrders);

  const moveOrder = (id: string, newStatus: KitchenOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const nextStatus: Record<string, KitchenOrder["status"] | null> = {
    new: "cooking",
    cooking: "ready",
    ready: "completed",
    completed: null,
  };

  const actionLabels: Record<string, string> = {
    new: "Start Cooking",
    cooking: "Mark Ready",
    ready: "Served",
  };

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] flex flex-col space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="font-heading font-bold text-2xl text-foreground">Kitchen Display</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage incoming orders in real-time</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-0">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          return (
            <div key={col.key} className="flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-muted/50 ${col.color}`}>
                  <col.icon className="h-4 w-4" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{col.label}</h3>
                <Badge variant="secondary" className="ml-auto rounded-md text-[10px] px-2 font-heading font-bold">{colOrders.length}</Badge>
              </div>
              <div className="flex-1 bg-muted/20 rounded-xl p-3 space-y-3 overflow-auto border border-border/50 scrollbar-thin">
                <AnimatePresence>
                  {colOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card border border-border/50 rounded-xl p-4 shadow-elevated"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
                        <span className="font-heading font-bold text-foreground">Table {order.tableNumber}</span>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{order.orderTime}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">{item.name}</span>
                            <span className="text-muted-foreground font-bold">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      {order.specialNotes && (
                        <div className="text-[11px] text-status-reserved bg-status-reserved/10 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
                          <span className="shrink-0">📝</span>
                          <span className="font-medium italic leading-relaxed">{order.specialNotes}</span>
                        </div>
                      )}
                      {nextStatus[order.status] && (
                        <Button
                          size="sm"
                          className="w-full gap-2 rounded-lg font-heading font-semibold text-[10px] uppercase tracking-wider h-9"
                          onClick={() => moveOrder(order.id, nextStatus[order.status]!)}
                        >
                          {actionLabels[order.status]} <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {colOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                    <col.icon className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-widest">No active orders</p>
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
