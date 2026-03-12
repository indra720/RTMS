import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, MapPin, Globe, Percent, Clock, 
  Store, Phone, Mail, Camera, Save, Info,
  ChefHat, CreditCard, Banknote, QrCode, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export default function RestaurantSettingsPage() {
  const [isSaving, setIsProcessing] = useState(false);

  const handleSave = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Configuration Synced", { description: "Global restaurant parameters updated successfully." });
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">System Configuration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Global administrative controls and brand management.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="rounded-lg h-10 px-6 font-heading font-semibold text-xs uppercase tracking-wider gap-2 shadow-sm"
        >
          <Save className="h-4 w-4" /> {isSaving ? "Syncing..." : "Apply Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand & Identity Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Store className="h-4 w-4 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Brand Identity</h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-heading font-bold uppercase tracking-wider border-border/50 px-2 py-0">Verified Entity</Badge>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="space-y-3 shrink-0">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center justify-center group hover:border-primary/50 transition-all overflow-hidden">
                      <ChefHat className="h-7 w-7 text-muted-foreground group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[9px] font-heading font-bold uppercase text-muted-foreground tracking-wider">Brand Logo</span>
                    </div>
                    <Button size="icon" className="absolute -bottom-2 -right-2 rounded-lg h-8 w-8 shadow-lg border-2 border-background">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center font-medium max-w-[112px]">Min 500x500px, PNG or SVG.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Restaurant Name</Label>
                    <Input defaultValue="TableFlow Prime" className="rounded-lg h-10 border-border/50 font-medium focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Contact Hotline</Label>
                    <Input defaultValue="+91 11 4567 8900" className="rounded-lg h-10 border-border/50 font-medium focus-visible:ring-primary/20" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Corporate Headquarters</Label>
                    <Input defaultValue="Penthouse 42, Skyline Towers, Sector 18, Gurugram" className="rounded-lg h-10 border-border/50 font-medium focus-visible:ring-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Operational Hours</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { day: "Standard Weekdays", open: "10:00 AM", close: "11:00 PM" },
                { day: "Premium Weekends", open: "09:00 AM", close: "01:00 AM" },
              ].map((shift, i) => (
                <div key={i} className="p-5 bg-muted/20 rounded-xl border border-border/10">
                  <p className="text-[10px] font-heading font-bold text-primary uppercase tracking-widest mb-4">{shift.day}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-wider ml-1">Arrival</span>
                      <Input defaultValue={shift.open} className="rounded-lg h-9 bg-background border-border/20 font-semibold text-center text-xs" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-wider ml-1">Departure</span>
                      <Input defaultValue={shift.close} className="rounded-lg h-9 bg-background border-border/20 font-semibold text-center text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Finance & Protocols */}
        <div className="space-y-6">
          
          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center gap-3">
              <Percent className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground text-sm">Tax & Tariffs</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-muted/20 rounded-lg border border-border/10">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-foreground">GST Protocol</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Standard tax rate</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input defaultValue="18" className="h-8 w-12 rounded-md bg-background border-border/20 text-center font-bold text-[10px]" />
                  <span className="text-xs font-bold text-muted-foreground">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-muted/20 rounded-lg border border-border/10">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-foreground">Service Fee</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Auto-applied to bill</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary scale-90" />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground text-sm">Payment Gateways</h3>
            </div>
            <div className="p-3.5 space-y-1.5">
              {[
                { id: 'cash', icon: Banknote, label: 'Physical Currency' },
                { id: 'card', icon: CreditCard, label: 'Digital Terminal' },
                { id: 'upi', icon: QrCode, label: 'UPI Network' },
              ].map((method) => (
                <div key={method.id} className="flex items-center justify-between p-2.5 hover:bg-muted/30 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <method.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-foreground">{method.label}</span>
                  </div>
                  <Badge variant="outline" className="bg-status-available/10 text-status-available border-none font-heading font-bold text-[8px] px-1.5 py-0">ENABLED</Badge>
                </div>
              ))}
            </div>
          </section>

          <div className="p-5 bg-primary/5 rounded-xl border border-primary/10 relative overflow-hidden shadow-sm">
            <div className="flex gap-3 relative z-10">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-heading font-bold text-primary uppercase tracking-widest">Protocol Audit</p>
                <p className="text-[11px] text-foreground/70 leading-relaxed italic">
                  Changes to global tax and hours are logged and timestamped for regulatory compliance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

