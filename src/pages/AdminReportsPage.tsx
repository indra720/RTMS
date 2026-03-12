import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Download, Calendar, BarChart3,
  TrendingUp, ArrowDownRight, ArrowUpRight,
  PieChart, Activity, DownloadCloud, History,
  ChevronRight
} from "lucide-react";

export default function AdminReportsPage() {
  const [selectedRange] = useState("This Month");

  const stats = [
    { label: "Net Revenue", value: "₹42,850", trend: "+12.5%", positive: true, icon: TrendingUp },
    { label: "Total Orders", value: "86", trend: "+4.2%", positive: true, icon: BarChart3 },
    { label: "Avg. Ticket", value: "₹498", trend: "-1.8%", positive: false, icon: PieChart },
  ];

  const reports = [
    { name: "Sales Performance", icon: FileText, date: "Mar 10, 2025", size: "2.4 MB" },
    { name: "Inventory Audit", icon: FileText, date: "Mar 09, 2025", size: "1.8 MB" },
    { name: "Staff Efficiency", icon: FileText, date: "Mar 08, 2025", size: "3.1 MB" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Analytical Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Export performance data and review financial summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-lg px-4 gap-1.5 text-xs font-medium">
            <Calendar className="h-3.5 w-3.5" /> {selectedRange}
          </Button>
          <Button size="sm" className="h-9 rounded-lg px-4 gap-1.5 text-xs font-medium">
            <DownloadCloud className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? "text-status-available" : "text-destructive"}`}>
                  {stat.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold font-heading text-foreground mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">vs last month</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold text-foreground text-lg">Daily Summary (EOD)</h2>
          </div>

          <div className="space-y-4">
            {/* Chart placeholder */}
            <div className="h-40 bg-muted/20 rounded-xl flex items-center justify-center border border-dashed border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue trend visualization</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Top Category</p>
                <p className="text-base font-bold font-heading text-foreground mt-1">North Indian</p>
                <p className="text-xs text-muted-foreground">62% of sales</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peak Hour</p>
                <p className="text-base font-bold font-heading text-foreground mt-1">7:30 PM - 9:00 PM</p>
                <p className="text-xs text-muted-foreground">34 orders avg.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Available Reports */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="font-heading font-semibold text-foreground text-lg">Available Reports</h2>
            </div>
            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-md">
              {reports.length} FILES
            </Badge>
          </div>

          <div className="space-y-3">
            {reports.map((report, i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-background shadow-sm flex items-center justify-center text-primary">
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{report.name}</p>
                    <p className="text-[10px] text-muted-foreground">{report.date} · {report.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="w-full mt-4 h-9 text-xs font-bold text-primary gap-1">
            View All Reports <ChevronRight className="h-3 w-3" />
          </Button>

          {/* Mini KPI */}
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Next Payout</p>
            <p className="text-2xl font-bold font-heading text-foreground">₹1,28,450</p>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for Mar 15, 2025</p>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground pt-4 uppercase tracking-widest">
        Data updates every 5 minutes · Last sync: 2 minutes ago
      </p>
    </div>
  );
}
