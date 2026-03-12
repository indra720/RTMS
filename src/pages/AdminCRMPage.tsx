import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Phone, 
  Mail, 
  History, 
  TrendingUp,
  MoreHorizontal,
  ChevronRight,
  Heart,
  Calendar,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { customers, Customer } from "@/data/mock-data";
import { toast } from "sonner";

const AdminCRMPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "VIP": return "bg-primary/10 text-primary border-primary/20";
      case "Regular": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "New": return "bg-blue-500/10 text-blue-600 border-blue-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container w-full p-2 space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-foreground tracking-tight uppercase">Customer Relationship</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">Manage guest history, loyalty points, and preferences.</p>
        </div>
        <Button className="gradient-primary gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add New Guest
        </Button>
      </div>

      {/* CRM Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Guests", value: customers.length, icon: Users, color: "text-blue-600" },
          { label: "VIP Members", value: customers.filter(c => c.status === "VIP").length, icon: Star, color: "text-primary" },
          { label: "Avg. Spending", value: "₹2,450", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Loyalty Issued", value: "14.2K", icon: Wallet, color: "text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-heading font-black text-foreground mt-0.5">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                className="pl-10 h-11 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                <Filter className="h-3.5 w-3.5" /> Filter VIP
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Customer Details</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Total Visits</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Loyalty Pts</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-heading font-black text-primary text-xs border border-border/50">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{customer.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{customer.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-lg border shadow-none px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-bold text-foreground">{customer.totalVisits}</span>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Visits</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {customer.loyaltyPoints}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-background shadow-none">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
          {selectedCustomer && (
            <div className="flex flex-col">
              <div className="gradient-primary p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10 flex items-center gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/30">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-heading font-black tracking-tight">{selectedCustomer.name}</h2>
                      <Badge className="bg-white/20 text-white border-none font-black text-[9px] uppercase">{selectedCustomer.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                      <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {selectedCustomer.phone}</span>
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {selectedCustomer.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-card max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Spent</p>
                    <p className="text-lg font-heading font-black text-foreground">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Points</p>
                    <p className="text-lg font-heading font-black text-amber-600">{selectedCustomer.loyaltyPoints}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Last Visit</p>
                    <p className="text-lg font-heading font-black text-foreground">{new Date(selectedCustomer.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-primary fill-current" /> Favorite Dishes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.favoriteDishes.map((dish, i) => (
                      <Badge key={i} variant="secondary" className="rounded-xl px-3 py-1.5 font-bold bg-muted/50 border-border/50 text-foreground">
                        {dish}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="h-3.5 w-3.5" /> Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/30">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border border-border/50">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Dine-in Order #ORD-92{i}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">March {10-i}, 2024 • 8:30 PM</p>
                          </div>
                        </div>
                        <p className="font-heading font-black text-foreground">₹{(1200 + i*450).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/20 border-t border-border/50 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-11 font-black uppercase text-[10px] tracking-widest" onClick={() => setSelectedCustomer(null)}>Close</Button>
                <Button className="flex-1 gradient-primary rounded-xl h-11 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Edit Profile</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Guest Dialog placeholder */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
          <div className="gradient-primary p-6 text-white">
            <DialogTitle className="text-xl font-heading font-black uppercase tracking-tight">Add New Guest</DialogTitle>
            <DialogDescription className="text-white/80 mt-1 text-xs">Create a new customer profile for loyalty tracking.</DialogDescription>
          </div>
          <div className="p-6 space-y-4 bg-card">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input placeholder="Enter guest name" className="h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input placeholder="+91 ..." className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</Label>
                <Input placeholder="New / Regular" className="h-11 rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/20 border-t border-border/50">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl h-11 font-black uppercase text-[10px] tracking-widest">Cancel</Button>
            <Button className="gradient-primary rounded-xl h-11 px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCRMPage;
