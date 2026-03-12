import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Bell, Shield, Camera, Save, Phone, MapPin, Globe, Fingerprint } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const [isSaving, setIsProcessing] = useState(false);

  const handleSave = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Profile Updated", { description: "Your administrative profile has been synchronized." });
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure your professional identity and security protocols.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-lg h-9 px-4 font-heading font-semibold text-[10px] uppercase tracking-wider border-border/50">Discard</Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-lg h-9 px-6 font-heading font-semibold text-[10px] uppercase tracking-wider gap-2 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card & Security Status */}
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-elevated text-center relative overflow-hidden group">
            <div className="relative inline-block mb-6">
              <div className="h-28 w-28 rounded-2xl overflow-hidden ring-4 ring-muted shadow-sm mx-auto transition-transform duration-300 group-hover:scale-[1.02]">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="h-full w-full object-cover" />
              </div>
              <Button size="icon" className="absolute -bottom-2 -right-2 rounded-lg h-9 w-9 shadow-lg border-2 border-background">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <h2 className="font-heading font-bold text-xl text-foreground">Admin User</h2>
            <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mt-1">Super Administrator</p>
            
            <div className="mt-6 pt-6 border-t border-border/50 flex justify-center gap-2">
              <Badge variant="secondary" className="rounded-md text-[9px] font-heading font-bold px-2 py-0">HQ ACCESS</Badge>
              <Badge variant="outline" className="rounded-md text-[9px] font-heading font-bold px-2 py-0 border-border/50">ACTIVE</Badge>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 rounded-lg bg-status-available/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-status-available" />
              </div>
              <h3 className="font-heading font-semibold text-sm">Trust & Safety</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/10">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">2FA Security</span>
                </div>
                <Badge className="bg-status-available/10 text-status-available border-none font-heading font-bold text-[8px] px-1.5 py-0">ACTIVE</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/10">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">Cloud Sync</span>
                </div>
                <Badge className="bg-primary/10 text-primary border-none font-heading font-bold text-[8px] px-1.5 py-0">SYNCED</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Section */}
          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center gap-3">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Identity Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
                <Input defaultValue="Admin User" className="rounded-lg h-10 border-border/50 focus-visible:ring-primary/20 transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Primary Email</Label>
                <Input defaultValue="admin@rtms.com" className="rounded-lg h-10 border-border/50 focus-visible:ring-primary/20 transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Contact Phone</Label>
                <Input defaultValue="+91 98765 43210" className="rounded-lg h-10 border-border/50 focus-visible:ring-primary/20 transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Operational Base</Label>
                <Input defaultValue="New Delhi, India" className="rounded-lg h-10 border-border/50 focus-visible:ring-primary/20 transition-all font-medium" />
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center gap-3">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Communication Preferences</h3>
            </div>
            <div className="px-6 divide-y divide-border/50">
              {[
                { label: "Real-time Dashboard Alerts", desc: "Instant visual feedback for critical system events.", icon: Globe },
                { label: "Order Progress Notifications", desc: "Push alerts for table status changes and billing.", icon: User },
                { label: "Weekly Analytical Digest", desc: "Automated performance report delivered to your email.", icon: Shield },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 2} className="data-[state=checked]:bg-primary scale-90" />
                </div>
              ))}
            </div>
          </section>

          {/* Security Protocols */}
          <section className="bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20 flex items-center gap-3">
              <Lock className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">System Access</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground ml-1">Update Security Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="New Password" className="rounded-lg h-10 border-border/50 flex-1" />
                    <Button variant="outline" className="rounded-lg h-10 px-4 font-heading font-semibold text-[10px] uppercase tracking-wider border-border/50">Verify</Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">
                  Ensure your key contains at least 12 characters including symbols.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

