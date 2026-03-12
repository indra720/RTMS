import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staffMembers as mockStaff, type StaffMember } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Clock, Sun, Sunset, Moon, Plus, UserPlus, X,
  Users, Calendar, ChevronLeft, ChevronRight, GripVertical
} from "lucide-react";
import { toast } from "sonner";

interface Shift {
  id: string;
  name: string;
  icon: typeof Sun;
  startTime: string;
  endTime: string;
  color: string;
  bgColor: string;
  borderColor: string;
  staff: StaffMember[];
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

export default function AdminShiftsPage() {
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState("Mar 10 – Mar 16, 2025");
  const [viewMode, setViewMode] = useState<"cards" | "grid">("cards");

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: "morning",
      name: "Morning Shift",
      icon: Sun,
      startTime: "9:00 AM",
      endTime: "3:00 PM",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      staff: staff.filter(s => s.shift.start.includes("09") || s.shift.start.includes("10")),
    },
    {
      id: "afternoon",
      name: "Afternoon Shift",
      icon: Sunset,
      startTime: "3:00 PM",
      endTime: "9:00 PM",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      staff: staff.filter(s => s.shift.start.includes("12") || s.shift.start.includes("04")),
    },
    {
      id: "evening",
      name: "Evening Shift",
      icon: Moon,
      startTime: "9:00 PM",
      endTime: "1:00 AM",
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      staff: [],
    },
  ]);

  const unassignedStaff = staff.filter(
    s => !shifts.some(shift => shift.staff.some(ss => ss.id === s.id))
  );

  const handleAssign = () => {
    if (!selectedShift || !selectedStaffId) return;
    const member = staff.find(s => s.id === parseInt(selectedStaffId));
    if (!member) return;

    setShifts(prev => prev.map(shift => {
      if (shift.id === selectedShift) {
        if (shift.staff.some(s => s.id === member.id)) return shift;
        return { ...shift, staff: [...shift.staff, member] };
      }
      return shift;
    }));

    setAssignOpen(false);
    setSelectedStaffId("");
    toast.success("Staff Assigned", { description: `${member.name} assigned to ${shifts.find(s => s.id === selectedShift)?.name}.` });
  };

  const handleRemoveFromShift = (shiftId: string, staffId: number) => {
    setShifts(prev => prev.map(shift => {
      if (shift.id === shiftId) {
        return { ...shift, staff: shift.staff.filter(s => s.id !== staffId) };
      }
      return shift;
    }));
    toast.info("Staff removed from shift");
  };

  const totalAssigned = shifts.reduce((sum, s) => sum + s.staff.length, 0);

  // Build grid data for visual schedule
  const getStaffScheduleGrid = () => {
    return staff.map(member => {
      const assignedShift = shifts.find(s => s.staff.some(ss => ss.id === member.id));
      return { member, shift: assignedShift };
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Staff Shifts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and assign staff to morning, afternoon, and evening shifts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border/50 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "cards" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
            >
              Schedule Grid
            </button>
          </div>
          <Button
            onClick={() => { setAssignOpen(true); setSelectedShift(null); }}
            className="gradient-primary text-primary-foreground border-0 rounded-xl h-11 px-5 shadow-lg shadow-primary/20 gap-2 font-bold"
          >
            <UserPlus className="h-4 w-4" /> Assign Staff
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-card border border-border/50 rounded-xl p-4 shadow-sm">
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-heading font-bold text-foreground">{currentWeek}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: staff.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Assigned", value: totalAssigned, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Unassigned", value: unassignedStaff.length, icon: UserPlus, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Shifts Active", value: shifts.length, icon: Sun, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-sm"
          >
            <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold font-heading text-foreground mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {viewMode === "cards" ? (
        /* Shift Cards View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {shifts.map((shift, i) => {
              const ShiftIcon = shift.icon;
              return (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all`}
                >
                  {/* Shift Header */}
                  <div className={`${shift.bgColor} p-6 border-b border-border/50`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl bg-background/80 flex items-center justify-center shadow-sm`}>
                          <ShiftIcon className={`h-6 w-6 ${shift.color}`} />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground text-lg">{shift.name}</h3>
                          <p className="text-xs text-muted-foreground font-medium">
                            {shift.startTime} — {shift.endTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${shift.borderColor} ${shift.color} font-bold text-[10px] px-3 py-1 rounded-lg`}>
                        {shift.staff.length} staff
                      </Badge>
                    </div>
                  </div>

                  {/* Staff List */}
                  <div className="p-4 space-y-2 min-h-[160px]">
                    {shift.staff.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Users className="h-8 w-8 mb-2 opacity-30" />
                        <p className="text-xs font-medium">No staff assigned</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary text-xs font-bold gap-1"
                          onClick={() => { setSelectedShift(shift.id); setAssignOpen(true); }}
                        >
                          <Plus className="h-3 w-3" /> Add Staff
                        </Button>
                      </div>
                    ) : (
                      shift.staff.map((member, j) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg overflow-hidden border border-border/50 shadow-sm">
                              <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{member.name}</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{member.role}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveFromShift(shift.id, member.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Add More */}
                  {shift.staff.length > 0 && (
                    <div className="px-4 pb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl h-10 border-dashed border-2 text-xs font-bold gap-1.5 hover:border-primary hover:text-primary transition-colors"
                        onClick={() => { setSelectedShift(shift.id); setAssignOpen(true); }}
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Staff Member
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Visual Schedule Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="text-left p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-48 sticky left-0 bg-muted/30 z-10">
                    Staff Member
                  </th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="text-center p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getStaffScheduleGrid().map(({ member, shift: assignedShift }, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/20 hover:bg-muted/10 transition-colors"
                  >
                    <td className="p-3 sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg overflow-hidden border border-border/50">
                          <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{member.name}</p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    {daysOfWeek.map(day => (
                      <td key={day} className="p-2 text-center">
                        {assignedShift ? (
                          <div className={`${assignedShift.bgColor} ${assignedShift.color} rounded-lg py-2 px-1 text-[9px] font-bold`}>
                            {assignedShift.startTime.replace(":00", "")}
                            <br />
                            <span className="opacity-60">to</span>
                            <br />
                            {assignedShift.endTime.replace(":00", "")}
                          </div>
                        ) : (
                          <div className="text-[9px] text-muted-foreground/40 font-bold">OFF</div>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Unassigned Staff */}
      {unassignedStaff.length > 0 && (
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base text-foreground">Unassigned Staff</h3>
              <p className="text-[11px] text-muted-foreground">{unassignedStaff.length} team members not assigned to any shift</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {unassignedStaff.map(member => (
              <div key={member.id} className="flex items-center gap-2 bg-muted/20 border border-border/50 rounded-xl px-3 py-2 shadow-sm">
                <div className="h-7 w-7 rounded-lg overflow-hidden border border-border/50">
                  <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-xs font-bold text-foreground">{member.name}</span>
                <Badge variant="outline" className="text-[8px] font-bold uppercase px-1.5 py-0 rounded-md">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Staff Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border border-border/50 shadow-2xl bg-card p-8">
          <DialogHeader className="mb-6">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold font-heading tracking-tight">
              Assign Staff
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select a team member and assign them to a shift.
            </p>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Select Shift</Label>
              <Select value={selectedShift || ""} onValueChange={setSelectedShift}>
                <SelectTrigger className="rounded-xl h-12 bg-muted/20 border-border/50 font-bold">
                  <SelectValue placeholder="Choose a shift" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {shifts.map(shift => (
                    <SelectItem key={shift.id} value={shift.id} className="rounded-lg font-bold">
                      <div className="flex items-center gap-2">
                        <shift.icon className={`h-4 w-4 ${shift.color}`} />
                        {shift.name} ({shift.startTime} – {shift.endTime})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Select Staff Member</Label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger className="rounded-xl h-12 bg-muted/20 border-border/50 font-bold">
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {staff.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{member.name}</span>
                        <span className="text-muted-foreground text-xs">({member.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3">
            <Button variant="ghost" onClick={() => setAssignOpen(false)} className="rounded-xl h-11 px-6 font-bold flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedShift || !selectedStaffId}
              className="gradient-primary border-0 rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20 flex-[2]"
            >
              Assign to Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
