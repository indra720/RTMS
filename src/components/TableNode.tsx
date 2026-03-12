import { motion } from "framer-motion";
import type { RestaurantTable } from "@/data/mock-data";

const statusColors: Record<string, string> = {
  available: "border-status-available/30 bg-status-available/5",
  reserved: "border-status-reserved/30 bg-status-reserved/5",
  occupied: "border-status-occupied/30 bg-status-occupied/5",
  serving: "border-status-occupied/30 bg-status-occupied/5",
  billing: "border-status-reserved/30 bg-status-reserved/5",
  dirty: "border-border bg-muted/30",
};

const statusDots: Record<string, string> = {
  available: "bg-status-available",
  reserved: "bg-status-reserved",
  occupied: "bg-status-occupied",
  serving: "bg-status-occupied",
  billing: "bg-status-reserved",
  dirty: "bg-status-dirty",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  serving: "Serving",
  billing: "Billing",
  dirty: "Cleaning",
};

interface TableNodeProps {
  table: RestaurantTable;
  onClick?: (table: RestaurantTable) => void;
  selected?: boolean;
  compact?: boolean;
}

export function TableNode({ table, onClick, selected, compact }: TableNodeProps) {
  return (
    <motion.button
      onClick={() => onClick?.(table)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative flex flex-col items-center justify-center gap-1 border-2
        ${table.shape === "round" ? "rounded-full" : "rounded-xl"}
        ${statusColors[table.status]}
        ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
        bg-card cursor-pointer w-full shadow-elevated hover:shadow-glass transition-all duration-200
        ${compact ? "p-3 aspect-square" : "p-4 aspect-square"}
      `}
    >
      <span className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${statusDots[table.status]}`} />
      <span className="font-heading font-bold text-foreground text-base">T{table.number}</span>
      <span className="text-muted-foreground text-[11px] font-medium">{table.capacity} seats</span>
      {!compact && (
        <span className="text-[10px] font-medium mt-0.5" style={{ color: `hsl(var(--status-${table.status === "serving" ? "occupied" : table.status === "billing" ? "reserved" : table.status}))` }}>
          {statusLabels[table.status]}
        </span>
      )}
      {!compact && table.seatedAt && (
        <span className="text-[9px] text-muted-foreground">{table.seatedAt}</span>
      )}
    </motion.button>
  );
}
