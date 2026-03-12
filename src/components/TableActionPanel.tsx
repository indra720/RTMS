import { motion } from "framer-motion";
import type { RestaurantTable, TableStatus } from "@/data/mock-data";
import { X, UserPlus, ShoppingCart, Droplets, Sparkles, CalendarCheck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableActionPanelProps {
  table: RestaurantTable;
  onClose: () => void;
  onUpdateStatus: (id: number, status: TableStatus) => void;
}

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  dirty: "Needs Cleaning",
};

export function TableActionPanel({ table, onClose, onUpdateStatus }: TableActionPanelProps) {
  const actions = [
    { label: "Seat Guest", icon: UserPlus, show: table.status === "available", action: () => onUpdateStatus(table.id, "occupied") },
    { label: "Take Order", icon: ShoppingCart, show: table.status === "occupied", action: () => {} },
    { label: "Mark Dirty", icon: Droplets, show: table.status === "occupied", action: () => onUpdateStatus(table.id, "dirty") },
    { label: "Mark Clean", icon: Sparkles, show: table.status === "dirty", action: () => onUpdateStatus(table.id, "available") },
    { label: "View Reservation", icon: CalendarCheck, show: !!table.reservation, action: () => {} },
    { label: "Generate Bill", icon: Receipt, show: table.status === "occupied", action: () => {} },
  ].filter((a) => a.show);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute top-4 right-4 w-72 bg-card rounded-xl border border-border/50 shadow-glass overflow-hidden z-20"
    >
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-foreground">Table {table.number}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {table.capacity} seats · {table.section || "No section"} · {statusLabels[table.status]}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {table.reservation && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <p className="text-xs font-medium text-foreground">{table.reservation.guestName}</p>
          <p className="text-xs text-muted-foreground">{table.reservation.time} · {table.reservation.guests} guests</p>
        </div>
      )}

      {table.assignedWaiter && (
        <div className="px-4 py-2 border-b border-border/50">
          <p className="text-xs text-muted-foreground">Assigned: <span className="text-foreground font-medium">{table.assignedWaiter}</span></p>
        </div>
      )}

      <div className="p-3 space-y-1.5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <action.icon className="h-4 w-4 text-muted-foreground" />
            {action.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
