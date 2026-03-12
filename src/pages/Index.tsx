import { useState } from "react";
import { motion } from "framer-motion";
import { tables, revenueData, hourlyOrders, popularDishes, staffMembers, reservations, notifications } from "@/data/mock-data";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Users, DollarSign, UtensilsCrossed, Clock, ArrowUpRight,
  CalendarCheck, ShoppingCart, AlertCircle, Trophy, ChefHat
} from "lucide-react";

const statCards = [
  { label: "Total Revenue", value: "$23,800", change: "+12.5%", icon: DollarSign, color: "text-status-available" },
  { label: "Active Tables", value: `${tables.filter(t => ["occupied", "serving", "billing"].includes(t.status)).length}/${tables.length}`, change: "67%", icon: UtensilsCrossed, color: "text-primary" },
  { label: "Today's Orders", value: "148", change: "+8.2%", icon: ShoppingCart, color: "text-status-reserved" },
  { label: "Reservations", value: `${reservations.filter(r => r.status !== "cancelled").length}`, change: "+3", icon: CalendarCheck, color: "text-chart-5" },
];

const occupancyData = [
  { name: "Available", value: tables.filter(t => t.status === "available").length, color: "hsl(var(--status-available))" },
  { name: "Occupied", value: tables.filter(t => ["occupied", "serving"].includes(t.status)).length, color: "hsl(var(--status-occupied))" },
  { name: "Reserved", value: tables.filter(t => t.status === "reserved").length, color: "hsl(var(--status-reserved))" },
  { name: "Other", value: tables.filter(t => ["dirty", "billing"].includes(t.status)).length, color: "hsl(var(--muted-foreground))" },
];

const Index = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back! Here's your restaurant overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
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
              <ArrowUpRight className="h-3.5 w-3.5 text-status-available" />
              <span className="text-xs font-medium text-status-available">{stat.change}</span>
              <span className="text-xs text-muted-foreground ml-1">vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground">Weekly Revenue</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Revenue trend this week</p>
            </div>
            <Badge variant="secondary" className="rounded-md text-xs">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 13 }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Table Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <h3 className="font-heading font-semibold text-foreground mb-1">Table Occupancy</h3>
          <p className="text-xs text-muted-foreground mb-4">Current floor status</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {occupancyData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {occupancyData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders per Hour */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <h3 className="font-heading font-semibold text-foreground mb-1">Orders per Hour</h3>
          <p className="text-xs text-muted-foreground mb-4">Today's order distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 13 }} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Popular Dishes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <h3 className="font-heading font-semibold text-foreground mb-1">Popular Dishes</h3>
          <p className="text-xs text-muted-foreground mb-4">Most ordered items</p>
          <div className="space-y-3">
            {popularDishes.map((dish, i) => (
              <div key={dish.name} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{dish.name}</p>
                  <p className="text-xs text-muted-foreground">{dish.orders} orders</p>
                </div>
                <span className="text-sm font-semibold text-foreground">${dish.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Staff Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-status-reserved" />
            <h3 className="font-heading font-semibold text-foreground">Staff Leaderboard</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">This week's performance</p>
          <div className="space-y-3">
            {staffMembers.sort((a, b) => b.revenue - a.revenue).map((staff, i) => (
              <div key={staff.id} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.tablesServed} tables · {staff.ordersHandled} orders</p>
                </div>
                <span className="text-sm font-semibold text-foreground">${staff.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated"
      >
        <h3 className="font-heading font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${n.type === "reservation" ? "bg-primary/10 text-primary" : n.type === "order" ? "bg-status-available/10 text-status-available" : n.type === "vip" ? "bg-status-reserved/10 text-status-reserved" : "bg-muted text-muted-foreground"}`}>
                {n.type === "reservation" ? <CalendarCheck className="h-4 w-4" /> : n.type === "order" ? <ChefHat className="h-4 w-4" /> : n.type === "vip" ? <Users className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2" />}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
