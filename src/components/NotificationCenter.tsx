import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications as mockNotifications } from "@/data/mock-data";
import { Bell, CalendarCheck, ChefHat, Users, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

const typeIcons = {
  reservation: CalendarCheck,
  order: ChefHat,
  cleaning: AlertCircle,
  vip: Users,
};

const typeColors = {
  reservation: "bg-primary/10 text-primary",
  order: "bg-status-available/10 text-status-available",
  cleaning: "bg-muted text-muted-foreground",
  vip: "bg-status-reserved/10 text-status-reserved",
};

export function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const [items, setItems] = useState(mockNotifications);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-12 right-0 w-80 bg-card border border-border/50 rounded-xl shadow-glass z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">Notifications</h3>
              {unread > 0 && <Badge className="rounded-full text-[10px] px-1.5 h-5">{unread}</Badge>}
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>Mark all read</Button>
          </div>
          <div className="max-h-80 overflow-auto">
            {items.map((n) => {
              const Icon = typeIcons[n.type];
              return (
                <div key={n.id} className={`flex items-start gap-3 p-3 border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
