import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tables as mockTables, type RestaurantTable, type TableStatus } from "@/data/mock-data";
import { TableNode } from "@/components/TableNode";
import {
  UserPlus, Droplets, Sparkles, ShoppingCart, Receipt,
  X, Minus, Plus, Clock, LayoutGrid, ListChecks, CheckCircle2,
  Users, ChefHat, Coffee, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BillPanel } from "@/components/BillPanel";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  serving: "Serving",
  billing: "Billing",
  dirty: "Cleaning",
};

export default function WaiterPage() {
  const [tables, setTables] = useState<RestaurantTable[]>(
    mockTables.filter((t) => t.assignedWaiter === "Maria" || t.status === "available" || t.assignedWaiter === "Rahul Sharma")
  );
  const [seatingTable, setSeatingTable] = useState<RestaurantTable | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [billTable, setBillTable] = useState<number | null>(null);

  const updateStatus = (id: number, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            status,
            seatedAt:
              status === "occupied"
                ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : t.seatedAt,
          }
          : t
      )
    );
    setSeatingTable(null);
    toast.success(`Table ${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  const stats = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    serving: tables.filter((t) => t.status === "serving").length,
    total: tables.length,
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Floor Monitor</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            Real‑time table status and guest service overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Available", value: stats.available, icon: Users, color: "text-status-available", bg: "bg-status-available/10" },
            { label: "Occupied", value: stats.occupied, icon: Coffee, color: "text-status-occupied", bg: "bg-status-occupied/10" },
            { label: "Serving", value: stats.serving, icon: ChefHat, color: "text-status-reserved", bg: "bg-status-reserved/10" },
            { label: "Total", value: stats.total, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-3 shadow-sm min-w-[100px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <div className={`h-7 w-7 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
              </div>
              <p className="font-heading font-bold text-xl text-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Map Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading font-semibold text-lg text-foreground tracking-tight">Visual Map</h2>
          <div className="flex gap-3 ml-auto">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-available"></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-occupied"></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Occupied</span>
            </div>
          </div>
        </div>

        <div className="bg-card/30 border border-border/50 rounded-2xl p-6 shadow-inner">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {tables.map((table, i) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ y: -4 }}
                className="cursor-pointer"
              >
                <TableNode table={table} compact />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Table Actions */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading font-semibold text-lg text-foreground tracking-tight">Active Tables</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tables.map((table, i) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-card border border-border/50 rounded-xl p-4 shadow-elevated hover:shadow-glass transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Table Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold font-heading
                      ${table.status === "available"
                        ? "bg-status-available/10 text-status-available"
                        : table.status === "occupied"
                          ? "bg-status-occupied/10 text-status-occupied"
                          : table.status === "dirty"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                      }
                    `}
                  >
                    {table.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-foreground">Table {table.number}</span>
                      <Badge
                        variant="outline"
                        className={`
                          text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border
                          ${table.status === "available"
                            ? "bg-status-available/5 text-status-available border-status-available/20"
                            : table.status === "occupied"
                              ? "bg-status-occupied/5 text-status-occupied border-status-occupied/20"
                              : table.status === "dirty"
                                ? "bg-muted/50 text-muted-foreground border-border"
                                : "bg-primary/5 text-primary border-primary/20"
                          }
                        `}
                      >
                        {statusLabels[table.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1 uppercase tracking-wider">
                        <Clock className="h-3 w-3" /> {table.seatedAt || "Vacant"}
                      </span>
                      <span className="flex items-center gap-1 uppercase tracking-wider">
                        <Users className="h-3 w-3" /> {table.capacity} Guests
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {table.status === "available" && (
                    <Button
                      onClick={() => {
                        setSeatingTable(table);
                        setGuestCount(table.capacity);
                      }}
                      size="sm"
                      className="rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 h-9 shadow-md shadow-primary/20"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" /> Seat
                    </Button>
                  )}

                  {table.status === "occupied" && (
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => setBillTable(parseInt(table.number))}>
                        <Receipt className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => updateStatus(table.id, "dirty")}>
                        <Droplets className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {(table.status === "serving" || table.status === "billing") && (
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => setBillTable(parseInt(table.number))}>
                        <Receipt className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-status-available/10 hover:text-status-available" onClick={() => updateStatus(table.id, "dirty")}>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {table.status === "dirty" && (
                    <Button
                      size="sm"
                      className="rounded-lg bg-status-available hover:bg-status-available/90 text-white font-bold text-xs px-4 h-9 shadow-md shadow-status-available/20"
                      onClick={() => updateStatus(table.id, "available")}
                    >
                      <Sparkles className="h-4 w-4 mr-1.5" /> Clean
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seating Modal */}
      <AnimatePresence>
        {seatingTable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSeatingTable(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card rounded-xl border border-border/50 shadow-2xl max-w-sm w-full p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <UserPlus className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground">Seat Guest</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Table {seatingTable.number} · Capacity {seatingTable.capacity}</p>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-4">Party Size</p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    className="w-12 h-12 rounded-xl border border-border/50 flex items-center justify-center hover:bg-muted transition-all"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  >
                    <Minus className="h-5 w-5 text-foreground" />
                  </button>
                  <div className="text-center min-w-[60px]">
                    <span className="font-heading text-4xl font-bold text-foreground">{guestCount}</span>
                  </div>
                  <button
                    className="w-12 h-12 rounded-xl border border-border/50 flex items-center justify-center hover:bg-muted transition-all"
                    onClick={() => setGuestCount(Math.min(seatingTable.capacity, guestCount + 1))}
                  >
                    <Plus className="h-5 w-5 text-foreground" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl h-12 font-bold"
                  onClick={() => setSeatingTable(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-xl h-12 font-bold gradient-primary shadow-lg shadow-primary/20 border-0"
                  onClick={() => updateStatus(seatingTable.id, "occupied")}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bill Panel */}
      <AnimatePresence>
        {billTable && (
          <BillPanel
            bill={{
              id: `INV-${1000 + billTable}`,
              orderId: `ORD-${500 + billTable}`,
              tableNumber: billTable.toString(),
              customerName: "Guest",
              items: [
                { name: "Signature Dish", quantity: 2, price: 24.5 },
                { name: "Premium Beverage", quantity: 1, price: 8.0 },
              ],
              subtotal: 57.0,
              tax: 10.26,
              total: 67.26,
              paymentMethod: "card",
              status: "paid",
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
            }}
            onClose={() => setBillTable(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
