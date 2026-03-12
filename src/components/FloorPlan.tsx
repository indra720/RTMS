import { useState, useRef, useCallback } from "react";
import { tables as mockTables, type RestaurantTable, type TableStatus } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { TableActionPanel } from "./TableActionPanel";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Save, RotateCcw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<TableStatus, string> = {
  available: "bg-status-available",
  reserved: "bg-status-reserved",
  occupied: "bg-status-occupied",
  serving: "bg-status-occupied",
  billing: "bg-status-reserved",
  dirty: "bg-status-dirty",
};

const statusBorderColors: Record<TableStatus, string> = {
  available: "border-status-available/30 shadow-[0_0_20px_hsl(var(--status-available)/0.15)]",
  reserved: "border-status-reserved/30 shadow-[0_0_20px_hsl(var(--status-reserved)/0.15)]",
  occupied: "border-status-occupied/30 shadow-[0_0_20px_hsl(var(--status-occupied)/0.15)]",
  serving: "border-status-occupied/30 shadow-[0_0_20px_hsl(var(--status-occupied)/0.15)]",
  billing: "border-status-reserved/30 shadow-[0_0_20px_hsl(var(--status-reserved)/0.15)]",
  dirty: "border-border",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  serving: "Serving",
  billing: "Billing",
  dirty: "Cleaning",
};

export function FloorPlan() {
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables);
  const [selected, setSelected] = useState<RestaurantTable | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newTable, setNewTable] = useState({ number: 13, capacity: 4, shape: "square" as "square" | "round", section: "Main Hall" });
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = Array.from(new Set(tables.map((t) => t.section).filter(Boolean)));

  const handleDragEnd = useCallback((id: number, x: number, y: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, position: { ...(t.position || { width: 90, height: 90, rotation: 0 }), x: Math.max(0, x), y: Math.max(0, y) } } : t
      )
    );
    setDragging(null);
  }, []);

  const updateTableStatus = (id: number, status: TableStatus) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setSelected(null);
  };

  const addTable = () => {
    const newId = Date.now();
    setTables((prev) => [
      ...prev,
      {
        id: newId,
        number: newTable.number + "",
        capacity: newTable.capacity,
        status: "available" as TableStatus,
        // @ts-ignore
        shape: newTable.shape,
        section: newTable.section,
        position: { x: 100, y: 100, width: 90, height: 90, rotation: 0 },
      },
    ]);
    setAddOpen(false);
    setNewTable({ ...newTable, number: newTable.number + 1 });
  };

  const resetLayout = () => setTables(mockTables);

  const stats = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    dirty: tables.filter((t) => t.status === "dirty").length,
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Stats Bar */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between bg-white border-b border-border/40">
        <div>
          <h2 className="font-heading font-black text-2xl text-foreground tracking-tight">Floor <span className="text-primary">Master</span></h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-0.5">{tables.length} Active Modules · Physical Mapping</p>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {(Object.entries(stats) as [TableStatus, number][]).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} shadow-lg`} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter leading-none">{statusLabels[status]}</span>
                <span className="text-sm font-black text-foreground">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center gap-3 bg-white/80 backdrop-blur-md border-b border-border/40">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-10 gap-2 rounded-xl gradient-primary text-primary-foreground border-0 shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 font-black uppercase tracking-tighter text-[10px]">
              <Plus className="h-4 w-4" /> Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] border-border/40 p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">New <span className="text-primary">Module</span></DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">ID Number</label>
                  <Input type="number" className="rounded-2xl h-12 bg-muted/20 border-none font-bold" value={newTable.number} onChange={(e) => setNewTable({ ...newTable, number: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Capacity</label>
                  <Input type="number" className="rounded-2xl h-12 bg-muted/20 border-none font-bold" value={newTable.capacity} onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 2 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shape</label>
                  <Select value={newTable.shape} onValueChange={(v) => setNewTable({ ...newTable, shape: v as "square" | "round" })}>
                    <SelectTrigger className="rounded-2xl h-12 bg-muted/20 border-none font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl p-2">
                      <SelectItem value="square" className="rounded-xl font-bold">RECLINE</SelectItem>
                      <SelectItem value="round" className="rounded-xl font-bold">CIRCULAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Zone</label>
                  <Select value={newTable.section} onValueChange={(v) => setNewTable({ ...newTable, section: v })}>
                    <SelectTrigger className="rounded-2xl h-12 bg-muted/20 border-none font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl p-2">
                      {["Main Hall", "Window", "Bar", "Patio", "Private"].map((s) => (
                        <SelectItem key={s} value={s} className="rounded-xl font-bold uppercase">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={addTable} className="flex-1 gradient-primary text-primary-foreground border-0 rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">Initialize</Button>
                <Button variant="ghost" className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs" onClick={() => setAddOpen(false)}>Abort</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="h-8 w-[1px] bg-border/40 mx-2" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
         <Button variant="outline" size="sm" className="h-10 gap-2 rounded-xl border-2 font-black uppercase tracking-tighter text-[10px] hover:bg-primary/5 hover:text-primary transition-all">
          <Layers className="h-4 w-4" /> Section
        </Button>
        <Button variant="outline" size="sm" className="h-10 gap-2 rounded-xl border-2 font-black uppercase tracking-tighter text-[10px] hover:bg-primary/5 hover:text-primary transition-all">
          <Save className="h-4 w-4" /> Commit
        </Button>
        <Button variant="ghost" size="sm" className="h-10 gap-2 rounded-xl font-black uppercase tracking-tighter text-[10px] hover:bg-rose-50 hover:text-rose-600 transition-all ml-auto" onClick={resetLayout}>
          <RotateCcw className="h-4 w-4" /> Reset Layout
        </Button></div> 
      </div>

      {/* Floor Canvas */}
      <div className="flex-1 rounded-[2.5rem] border-4 border-white bg-slate-100/50 overflow-hidden relative shadow-inner m-6">
        <div className="absolute inset-0 floor-grid opacity-[0.03]" />
        <div ref={containerRef} className="relative w-full h-full min-h-[500px]">
          <TooltipProvider delayDuration={200}>
            {tables.map((table) => {
              // Safe position check
              const pos = table.position || { x: 50, y: 50, width: 90, height: 90, rotation: 0 };
              
              return (
                <Tooltip key={table.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      drag
                      dragMomentum={false}
                      dragElastic={0}
                      onDragStart={() => setDragging(table.id)}
                      onDragEnd={(_, info) => {
                        const el = containerRef.current;
                        if (!el) return;
                        handleDragEnd(table.id, pos.x + info.offset.x, pos.y + info.offset.y);
                      }}
                      onClick={() => !dragging && setSelected(selected?.id === table.id ? null : table)}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: pos.x,
                        y: pos.y,
                        rotate: pos.rotation,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`
                        absolute cursor-grab active:cursor-grabbing select-none
                        flex flex-col items-center justify-center gap-0.5
                        border-2 bg-white/90 backdrop-blur-md shadow-xl
                        ${table.shape === "round" ? "rounded-full" : "rounded-3xl"}
                        ${statusBorderColors[table.status]}
                        ${selected?.id === table.id ? "ring-4 ring-primary/20 border-primary" : ""}
                        transition-all duration-300
                      `}
                      style={{
                        width: pos.width,
                        height: pos.height,
                      }}
                    >
                      {/* Status indicator with glow */}
                      <span className="absolute -top-1.5 -right-1.5">
                        <span className={`block h-4 w-4 rounded-full ${statusColors[table.status]} border-2 border-white shadow-lg`} />
                        {table.status === "occupied" && (
                          <span className={`absolute inset-0 h-4 w-4 rounded-full ${statusColors[table.status]} animate-pulse opacity-50`} />
                        )}
                      </span>
                      <span className="font-heading font-black text-foreground text-lg tracking-tighter">T{table.number}</span>
                      <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest">{table.capacity} PAX</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-900 text-white border-none rounded-xl p-3 shadow-2xl">
                    <div className="space-y-1 text-[10px]">
                      <p className="font-black text-xs uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Module {table.number}</p>
                      <p className="font-medium opacity-70">{table.capacity} Capacity · {table.section}</p>
                      {table.assignedWaiter && <p className="font-medium text-primary">Service: {table.assignedWaiter}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Action Panel */}
        <AnimatePresence>
          {selected && (
            <div className="absolute top-6 right-6 z-20">
              <TableActionPanel
                table={selected}
                onClose={() => setSelected(null)}
                onUpdateStatus={updateTableStatus}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
