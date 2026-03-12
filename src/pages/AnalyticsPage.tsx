import { motion } from "framer-motion";
import { revenueData, hourlyOrders, popularDishes, staffMembers, tables } from "@/data/mock-data";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, UtensilsCrossed, Percent } from "lucide-react";

const tableUsageData = tables.map((t) => ({
  table: `T${t.number}`,
  usage: Math.floor(Math.random() * 80 + 20),
}));

export default function AnalyticsPage() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = hourlyOrders.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const occupancyRate = Math.round((tables.filter(t => ["occupied", "serving", "billing"].includes(t.status)).length / tables.length) * 100);

  const cards = [
    { label: "Weekly Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Total Orders", value: totalOrders.toString(), icon: UtensilsCrossed },
    { label: "Avg Order Value", value: `$${avgOrderValue}`, icon: TrendingUp },
    { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: Percent },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Deep dive into your restaurant performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</p>
                <p className="font-heading font-bold text-2xl text-foreground mt-1">{c.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Revenue */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated">
          <h3 className="font-heading font-semibold text-foreground mb-4">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders per Hour */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated">
          <h3 className="font-heading font-semibold text-foreground mb-4">Orders per Hour</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 13 }} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Table Usage */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated">
          <h3 className="font-heading font-semibold text-foreground mb-4">Table Usage Rate</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tableUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="table" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 13 }} />
              <Bar dataKey="usage" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Popular Dishes Ranking */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card border border-border/50 rounded-xl p-5 shadow-elevated">
          <h3 className="font-heading font-semibold text-foreground mb-4">Most Popular Dishes</h3>
          <div className="space-y-4">
            {popularDishes.map((dish, i) => {
              const maxOrders = popularDishes[0].orders;
              return (
                <div key={dish.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{dish.name}</span>
                    <span className="text-xs text-muted-foreground">{dish.orders} orders · ${dish.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dish.orders / maxOrders) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Waiter Performance */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-elevated">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-heading font-semibold text-foreground">Waiter Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                {["Rank", "Name", "Role", "Shift", "Tables", "Orders", "Revenue"].map((h) => (
                  <th key={h} className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {staffMembers.sort((a, b) => b.revenue - a.revenue).map((s, i) => (
                <tr key={s.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "gradient-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-foreground">{s.name}</td>
                  <td className="py-4 px-6"><Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{s.role}</Badge></td>
                  <td className="py-4 px-6 text-sm text-muted-foreground font-medium capitalize">{s.shift.start} - {s.shift.end}</td>
                  <td className="py-4 px-6 text-sm font-bold font-heading text-foreground">{s.tablesServed}</td>
                  <td className="py-4 px-6 text-sm font-bold font-heading text-foreground">{s.ordersHandled}</td>
                  <td className="py-4 px-6 text-sm font-bold font-heading text-foreground">${s.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
