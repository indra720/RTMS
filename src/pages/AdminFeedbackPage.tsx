import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star, MessageSquare, ThumbsUp, ThumbsDown,
  Search, Filter, Reply, CheckCircle2, AlertCircle,
  TrendingUp, BarChart2, Quote, Clock, MoreHorizontal,
  Smile, Frown, Meh
} from "lucide-react";

const mockFeedback = [
  { id: 1, customer: "Aarav Mehta", rating: 5, comment: "The wood-fired pizza was exceptional! Best in the city.", date: "2024-03-10", status: "resolved", sentiment: "positive" },
  { id: 2, customer: "Ishani Kapoor", rating: 2, comment: "Wait time was too long even with a reservation. Pasta was cold.", date: "2024-03-09", status: "pending", sentiment: "negative" },
  { id: 3, customer: "Vikram Singh", rating: 4, comment: "Great ambiance and staff. The Butter Chicken is a must-try.", date: "2024-03-08", status: "resolved", sentiment: "positive" },
  { id: 4, customer: "Ananya Iyer", rating: 3, comment: "Food is good but prices are on the higher side. Service was okay.", date: "2024-03-07", status: "pending", sentiment: "neutral" },
];

const sentimentIcons = {
  positive: Smile,
  neutral: Meh,
  negative: Frown,
};

const sentimentColors = {
  positive: "text-emerald-500 bg-emerald-500/10",
  neutral: "text-amber-500 bg-amber-500/10",
  negative: "text-rose-500 bg-rose-500/10",
};

export default function AdminFeedbackPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeedback = mockFeedback.filter((f) => {
    if (activeTab !== "all" && f.sentiment !== activeTab) return false;
    if (searchQuery && !f.comment.toLowerCase().includes(searchQuery.toLowerCase()) && !f.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: "Total Reviews", value: "1.2K", icon: MessageSquare, change: "+12%", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "NPS Score", value: "72", icon: TrendingUp, change: "+5 pts", color: "text-primary", bg: "bg-primary/10" },
    { label: "Positive", value: "88%", icon: ThumbsUp, change: "+3%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Critical", value: "4%", icon: AlertCircle, change: "-1%", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Guest Reviews</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor satisfaction levels, track sentiment, and respond to guest feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border/50 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-heading font-bold text-xl text-foreground">4.8</span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
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
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-status-available' : 'text-rose-500'}`}>
                {stat.change}
              </span>
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
            placeholder="Search reviews or customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 bg-card"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["all", "positive", "neutral", "negative"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeTab === tab
                  ? "bg-primary border-primary text-white shadow-md"
                  : "bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-foreground">Latest Reviews</h2>
          <Button variant="ghost" size="sm" className="text-xs font-bold gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredFeedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl border border-border/50 p-12 text-center"
            >
              <MessageSquare className="h-12 w-12 mx-auto text-muted/30 mb-4" />
              <h3 className="font-heading font-bold text-lg text-foreground">No reviews found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
            </motion.div>
          ) : (
            filteredFeedback.map((f, i) => {
              const SentimentIcon = sentimentIcons[f.sentiment as keyof typeof sentimentIcons];
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="group relative bg-card rounded-xl border border-border/50 p-6 hover:shadow-glass transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Customer info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center font-heading font-bold text-muted-foreground text-lg shrink-0">
                        {f.customer.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h4 className="font-heading font-bold text-foreground">{f.customer}</h4>
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${sentimentColors[f.sentiment as keyof typeof sentimentColors]}`}>
                            <SentimentIcon className="h-3 w-3" />
                            <span className="capitalize">{f.sentiment}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {f.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{f.rating}/5</span>
                          </div>
                          <Badge variant="outline" className={`text-[8px] font-bold uppercase ${
                            f.status === 'resolved' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'
                          }`}>
                            {f.status}
                          </Badge>
                        </div>
                        <p className="text-foreground leading-relaxed italic border-l-2 border-border/50 pl-4">
                          "{f.comment}"
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 md:self-center">
                      <Button size="sm" variant="ghost" className="rounded-lg h-9 px-3 text-muted-foreground hover:text-primary hover:bg-primary/5">
                        <Reply className="h-4 w-4 mr-1.5" /> Reply
                      </Button>
                      {f.status === 'pending' && (
                        <Button size="sm" variant="ghost" className="rounded-lg h-9 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" /> Resolve
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
