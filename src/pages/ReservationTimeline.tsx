import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { tables as mockTables, reservations as mockReservations } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, Filter } from "lucide-react";

const timeSlots = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM",
];

interface TimelineReservation {
  id: string;
  guestName: string;
  tableNumber: string;
  startSlot: number;
  duration: number; // in half-hour slots
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
}

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  confirmed: { bg: "bg-primary/15", border: "border-primary/30", text: "text-primary" },
  pending: { bg: "bg-status-reserved/15", border: "border-status-reserved/30", text: "text-status-reserved" },
  cancelled: { bg: "bg-destructive/10", border: "border-destructive/20", text: "text-destructive" },
  available: { bg: "bg-status-available/10", border: "border-status-available/20", text: "text-status-available" },
  occupied: { bg: "bg-status-occupied/10", border: "border-status-occupied/20", text: "text-status-occupied" },
};

export default function ReservationTimelinePage() {
  const [selectedDate, setSelectedDate] = useState("2024-03-20");
  const [filterStatus, setFilterStatus] = useState("all");

  // Convert reservations to timeline format
  const timelineReservations: TimelineReservation[] = useMemo(() => {
    return mockReservations
      .filter(r => filterStatus === "all" || r.status === filterStatus)
      .map(r => {
        const timeStr = r.time.replace(" PM", "").replace(" AM", "");
        const slotIndex = timeSlots.findIndex(s => s === r.time);
        return {
          id: r.id,
          guestName: r.guestName,
          tableNumber: r.tableNumber,
          startSlot: slotIndex >= 0 ? slotIndex : 10,
          duration: 3, // 1.5 hours default
          guests: r.guests,
          status: r.status,
        };
      });
  }, [filterStatus]);

  const tables = mockTables;

  const getReservationForSlot = (tableNum: string, slotIdx: number) => {
    return timelineReservations.find(
      r => r.tableNumber === tableNum && slotIdx >= r.startSlot && slotIdx < r.startSlot + r.duration
    );
  };

  const isReservationStart = (tableNum: string, slotIdx: number) => {
    return timelineReservations.find(
      r => r.tableNumber === tableNum && slotIdx === r.startSlot
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Reservation Timeline
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visual overview of table availability throughout the day.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-10 rounded-xl bg-card border-border/50 shadow-sm">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-card border border-border/50 rounded-xl p-4 shadow-sm">
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-heading font-bold text-foreground text-lg">Wednesday, March 20, 2024</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {[
          { label: "Available", color: "bg-status-available" },
          { label: "Reserved", color: "bg-primary" },
          { label: "Pending", color: "bg-status-reserved" },
          { label: "Occupied", color: "bg-status-occupied" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Time Header */}
            <div className="flex border-b border-border/50 bg-muted/30 sticky top-0 z-10">
              <div className="w-32 shrink-0 p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-r border-border/30 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" /> Table
              </div>
              {timeSlots.map((slot, i) => (
                <div
                  key={slot}
                  className={`flex-1 min-w-[60px] p-2 text-center text-[9px] font-bold border-r border-border/10 last:border-r-0 ${
                    i % 2 === 0 ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  {i % 2 === 0 ? slot.replace(":00", "") : ""}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {tables.map((table, tableIdx) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: tableIdx * 0.03 }}
                className="flex border-b border-border/20 last:border-b-0 hover:bg-muted/5 transition-colors"
              >
                {/* Table Label */}
                <div className="w-32 shrink-0 p-3 border-r border-border/30 flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    table.status === "available" ? "bg-status-available" :
                    table.status === "occupied" ? "bg-status-occupied" :
                    table.status === "reserved" ? "bg-status-reserved" :
                    "bg-status-dirty"
                  }`} />
                  <div>
                    <p className="font-bold text-xs text-foreground">T{table.number}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">{table.capacity} seats</p>
                  </div>
                </div>

                {/* Time Cells */}
                <div className="flex flex-1 relative">
                  {timeSlots.map((_, slotIdx) => {
                    const reservation = getReservationForSlot(table.number.replace("T", ""), slotIdx);
                    const isStart = isReservationStart(table.number.replace("T", ""), slotIdx);

                    return (
                      <div
                        key={slotIdx}
                        className={`flex-1 min-w-[60px] border-r border-border/10 last:border-r-0 relative ${
                          slotIdx % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                        }`}
                        style={{ minHeight: 48 }}
                      >
                        {isStart && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute inset-y-1 left-0 ${statusColors[reservation!.status].bg} ${statusColors[reservation!.status].border} border rounded-lg z-10 flex items-center px-2 gap-1.5 cursor-pointer hover:shadow-md transition-shadow`}
                            style={{ width: `${reservation!.duration * 100}%`, minWidth: 120 }}
                          >
                            <div className={`h-2 w-2 rounded-full ${reservation!.status === "confirmed" ? "bg-primary" : "bg-status-reserved"}`} />
                            <div className="overflow-hidden flex-1">
                              <p className={`text-[10px] font-bold truncate ${statusColors[reservation!.status].text}`}>
                                {reservation!.guestName}
                              </p>
                              <p className="text-[8px] text-muted-foreground font-bold flex items-center gap-1">
                                <Users className="h-2.5 w-2.5" /> {reservation!.guests} guests
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Current Time Indicator Info */}
      <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold font-heading text-foreground">Pro Tip</p>
          <p className="text-[11px] text-muted-foreground font-medium">
            Hover over a reservation block to see details. Click to modify or cancel. Empty slots indicate table availability.
          </p>
        </div>
      </div>
    </div>
  );
}
