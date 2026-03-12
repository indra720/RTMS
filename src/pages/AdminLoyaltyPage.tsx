import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customerProfiles, type CustomerProfile } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Star, Gift, Trophy, ArrowUpRight, 
  TrendingUp, Users, Zap, Crown, Flame, 
  ArrowRight, Sparkles, Filter, Medal
} from "lucide-react";

export default function AdminLoyaltyPage() {
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState("All");

  const filteredCustomers = useMemo(() => {
    return customerProfiles.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                           c.email.toLowerCase().includes(search.toLowerCase());
      const tier = c.totalVisits > 10 ? "Platinum" : "Silver";
      const matchesTier = activeTier === "All" || tier === activeTier;
      return matchesSearch && matchesTier;
    });
  }, [search, activeTier]);

  const stats = [
    { label: "Total Members", value: "482", icon: Users, change: "+12.5%", color: "text-blue-500" },
    { label: "Elite Tier", value: "12%", icon: Crown, change: "+2.4%", color: "text-amber-500" },
    { label: "Points Ledger", value: "1.2M", icon: Star, change: "+8.2%", color: "text-primary" },
    { label: "Avg. Retention", value: "84%", icon: TrendingUp, change: "+5.1%", color: "text-emerald-500" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Loyalty Program</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage customer rewards and retention strategies.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-lg h-10 px-4 font-bold gap-2">
            <Medal className="h-4 w-4 text-primary" /> Tiers & Perks
          </Button>
          <Button className="rounded-lg h-10 px-6 font-bold gap-2">
            <Sparkles className="h-4 w-4" /> Issue Points
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="font-heading font-bold text-2xl text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-xs font-medium text-status-available">{stat.change}</span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patron name, email or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 bg-card"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All", "Platinum", "Silver"].map(tier => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeTier === tier 
                ? "bg-primary border-primary text-white shadow-md" 
                : "bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Member Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-foreground">Member Registry</h2>
          <Button variant="ghost" size="sm" className="text-xs font-bold gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCustomers.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-xl p-6 shadow-elevated hover:shadow-glass transition-all duration-300"
              >
                <div className="flex flex-col h-full space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center font-heading font-bold text-primary text-lg">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground text-base">{c.name}</h4>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      c.totalVisits > 10 
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                      : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                    }>
                      {c.totalVisits > 10 ? "PLATINUM" : "SILVER"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Tier Progress</span>
                      <span className="text-foreground">{c.totalVisits} / 20 Visits</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (c.totalVisits / 20) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${c.totalVisits > 10 ? 'bg-amber-500' : 'bg-primary'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Spend</p>
                      <p className="font-heading font-bold text-lg text-foreground">₹{c.totalSpending}</p>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Points</p>
                      <div className="flex items-center gap-1 font-heading font-bold text-lg text-primary">
                        <Star className="h-3.5 w-3.5 fill-primary" /> {c.totalSpending * 10}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full h-10 rounded-lg font-bold text-xs gap-2">
                    Profile Dashboard <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
