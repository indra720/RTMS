import { motion } from "framer-motion";
import { X, User, Mail, Phone, Heart, Calendar, DollarSign, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CustomerProfile } from "@/data/mock-data";

interface CustomerProfilePanelProps {
  profile: CustomerProfile;
  onClose: () => void;
}

export function CustomerProfilePanel({ profile, onClose }: CustomerProfilePanelProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border/50 shadow-glass z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-heading font-bold text-foreground">Customer Profile</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Profile Info */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-foreground">{profile.name}</h4>
              <Badge variant="secondary" className="text-xs rounded-md mt-1">Regular Guest</Badge>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-5 border-b border-border/50">
          <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Customer History</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Visits", value: profile.totalVisits, icon: Calendar },
              { label: "Total Spent", value: `$${profile.totalSpending.toLocaleString()}`, icon: DollarSign },
              { label: "Last Visit", value: profile.lastVisit, icon: UtensilsCrossed },
              { label: "Fav Table", value: `T${profile.favoriteTable}`, icon: Heart },
            ].map((s) => (
              <div key={s.label} className="bg-muted/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="font-heading font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Dishes */}
        <div className="p-5 border-b border-border/50">
          <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Favorite Dishes</h4>
          <div className="flex flex-wrap gap-2">
            {profile.favoriteDishes.map((d) => (
              <Badge key={d} variant="outline" className="rounded-lg text-xs">{d}</Badge>
            ))}
          </div>
        </div>

        {/* Visit Timeline */}
        <div className="p-5">
          <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Visit Timeline</h4>
          <div className="space-y-3">
            {profile.visitHistory.map((v, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground w-24">{v.date}</span>
                <span className="text-foreground">Table {v.table}</span>
                <span className="ml-auto font-semibold text-foreground">${v.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
