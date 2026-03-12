import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reservations, type Reservation } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, Users, MapPin, 
  ChevronRight, Star, History, Info,
  AlertCircle, CheckCircle2, XCircle,
  QrCode, Utensils, Navigation,
  Trophy
} from "lucide-react";

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const userBookings = reservations.filter(res => 
    activeTab === "upcoming" ? res.status !== "cancelled" : res.status === "cancelled"
  );

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Reservations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your upcoming and past dining experiences.</p>
        </div>
        
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
          {["upcoming", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {userBookings.length > 0 ? (
            userBookings.map((res, i) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated group"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Status Hub */}
                  <div className="flex flex-col items-center justify-center gap-2 bg-muted/30 p-4 rounded-xl border border-border/10 shrink-0 sm:w-28">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-sm ${
                      res.status === 'confirmed' ? 'bg-status-available text-white' : 
                      res.status === 'pending' ? 'bg-status-reserved text-white' : 
                      'bg-destructive text-white'
                    }`}>
                      {res.status === 'confirmed' ? <CheckCircle2 size={20} /> : 
                       res.status === 'pending' ? <Clock size={20} /> : <XCircle size={20} />}
                    </div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-foreground">{res.status}</span>
                  </div>

                  {/* Content Hub */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">La Piazza Grande</h3>
                        <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                          <MapPin size={12} className="text-primary" />
                          <span className="text-xs">Connaught Place, Delhi</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] px-2 py-0 rounded-md">#{res.id}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" />
                          <span className="text-xs font-semibold">{res.date}</span>
                        </div>
                      </div>
                      <div className="space-y-0.5 border-x border-border/50 px-2">
                        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider text-center">Time</p>
                        <div className="flex items-center gap-1.5 justify-center">
                          <Clock size={14} className="text-primary" />
                          <span className="text-xs font-semibold">{res.time}</span>
                        </div>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">Guests</p>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Users size={14} className="text-primary" />
                          <span className="text-xs font-semibold">{res.guests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button className="flex-1 rounded-lg h-9 font-heading font-semibold text-xs uppercase tracking-wider gap-2">
                        <QrCode size={14} /> Entry Pass
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-lg h-9 font-heading font-semibold text-xs uppercase tracking-wider">
                        Modify
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-muted/50 border border-border/10 shrink-0">
                        <Navigation size={14} className="text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-muted/20 rounded-xl border border-dashed border-border/50">
              <div className="h-16 w-16 bg-muted/50 rounded-xl flex items-center justify-center mx-auto text-muted-foreground/30">
                <Utensils size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-foreground">No Records Found</h3>
                <p className="text-muted-foreground text-xs">Your culinary journey starts with your first booking.</p>
              </div>
              <Button variant="outline" className="rounded-lg h-10 px-8 font-heading font-semibold text-xs uppercase tracking-wider">
                Explore Top Restaurants
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Rewards HUD */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-foreground text-background rounded-xl p-8 relative overflow-hidden shadow-elevated"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Star size={120} className="fill-background" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <Badge className="bg-primary text-primary-foreground border-none font-heading font-bold text-[10px] uppercase tracking-wider px-2 py-0">Exclusive Perk</Badge>
            <h2 className="text-2xl font-heading font-bold tracking-tight">The Platinum Standard</h2>
            <p className="text-muted/80 text-sm max-w-sm">
              Complete 5 more reservations this month to unlock complimentary appetizers at any Tier-1 restaurant.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4 bg-background/10 border border-background/20 p-5 rounded-xl backdrop-blur-md w-full md:w-auto">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                <Trophy size={24} className="text-primary-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-heading font-bold text-muted/60 uppercase tracking-widest leading-none mb-1">Your Rank</p>
                <p className="text-lg font-heading font-bold">Silver Insider</p>
              </div>
              <ChevronRight className="text-muted/40 ml-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

