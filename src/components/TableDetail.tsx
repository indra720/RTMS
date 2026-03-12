import type { RestaurantTable } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  dirty: "Needs Cleaning",
};

interface TableDetailProps {
  table: RestaurantTable | null;
  onClose: () => void;
}

export function TableDetail({ table, onClose }: TableDetailProps) {
  return (
    <AnimatePresence>
      {table && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="border-l border-border/50 p-6 w-80 bg-card flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-foreground">Table {table.number}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground font-medium">{statusLabels[table.status]}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Capacity</span>
              <span className="text-foreground">{table.capacity} seats</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Section</span>
              <span className="text-foreground">{table.section || "—"}</span>
            </div>
            {table.assignedWaiter && (
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Waiter</span>
                <span className="text-foreground">{table.assignedWaiter}</span>
              </div>
            )}
            {table.reservation && (
              <>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Guest</span>
                  <span className="text-foreground">{table.reservation.guestName}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{table.reservation.time}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="text-foreground">{table.reservation.guests}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
