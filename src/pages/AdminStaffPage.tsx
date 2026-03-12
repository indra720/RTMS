import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staffMembers as mockStaff, type StaffMember } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, UserPlus, Mail, Phone, Calendar, Clock, Edit2, Trash2, MoreVertical, Shield, UserCircle } from "lucide-react";
import { toast } from "sonner";

const roleStyles: Record<string, { badge: string; icon: any }> = {
  admin: { badge: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Shield },
  manager: { badge: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: UserCircle },
  waiter: { badge: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: UserPlus },
  chef: { badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: Shield },
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500",
  "on-break": "bg-orange-500",
  "off-duty": "bg-muted-foreground",
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch = 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || s.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  const handleDelete = (id: number) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    toast.error("Staff Removed", { description: "Employee record has been deleted." });
  };

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "waiter" as StaffMember["role"],
    shift: { start: "09:00 AM", end: "06:00 PM" }
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) {
      toast.error("Missing Information");
      return;
    }
    const member: StaffMember = {
      id: Date.now(),
      ...newStaff,
      status: "off-duty",
      joinDate: new Date().toISOString().split('T')[0],
      tablesServed: 0,
      ordersHandled: 0,
      revenue: 0,
      avatar: `https://i.pravatar.cc/150?u=${newStaff.name}`,
    };
    setStaff(prev => [...prev, member]);
    setIsAddModalOpen(false);
    toast.success("Staff Added", { description: `${newStaff.name} is now part of the team.` });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Staff Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your team members, roles and schedules.</p>
        </div>
        
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl h-11 px-5 shadow-elevated gap-2 font-medium">
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50 shadow-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48 h-11 rounded-xl bg-card border-border/50 shadow-sm">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="chef">Chef</SelectItem>
            <SelectItem value="waiter">Waiter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStaff.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-background shadow-inner">
                    <img src={s.avatar} alt={s.name} className="h-full w-full object-cover" />
                  </div>
                  <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${statusStyles[s.status]}`} />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setEditingStaff(s)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-foreground">{s.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`rounded-lg px-2 py-0 text-[10px] font-bold uppercase tracking-wide border ${roleStyles[s.role].badge}`}>
                    {s.role}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• Joined {s.joinDate}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/20 p-2 rounded-xl border border-border/50">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Shift: {s.shift.start} — {s.shift.end}</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-border/30 grid grid-cols-2 gap-4">
                <div className="text-center p-2 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-0.5">Orders</p>
                  <p className="font-heading font-bold text-primary">{s.ordersHandled}</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-0.5">Revenue</p>
                  <p className="font-heading font-bold text-emerald-600">₹{s.revenue}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border border-border shadow-elevated bg-card p-8">
          <DialogHeader className="mb-6 text-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold font-heading">Add Team Member</DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Create a new staff account and assign their role.</p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Full Name</Label>
              <Input 
                placeholder="e.g. John Wick" 
                className="rounded-xl h-11 bg-muted/20" 
                value={newStaff.name}
                onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Role</Label>
                <Select value={newStaff.role} onValueChange={(v: any) => setNewStaff(prev => ({ ...prev, role: v }))}>
                  <SelectTrigger className="rounded-xl h-11 bg-muted/20"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="waiter">Waiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Phone</Label>
                <Input 
                  placeholder="+91..." 
                  className="rounded-xl h-11 bg-muted/20" 
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Email Address</Label>
              <Input 
                type="email" 
                placeholder="john@rtms.com" 
                className="rounded-xl h-11 bg-muted/20" 
                value={newStaff.email}
                onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Shift Start</Label>
                <Input 
                  placeholder="09:00 AM" 
                  className="rounded-xl h-11 bg-muted/20" 
                  value={newStaff.shift.start}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, shift: { ...prev.shift, start: e.target.value } }))}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Shift End</Label>
                <Input 
                  placeholder="06:00 PM" 
                  className="rounded-xl h-11 bg-muted/20" 
                  value={newStaff.shift.end}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, shift: { ...prev.shift, end: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-11 px-6 font-bold flex-1">Cancel</Button>
            <Button className="rounded-xl h-11 px-8 font-bold shadow-elevated flex-[2]" onClick={handleAddStaff}>Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
