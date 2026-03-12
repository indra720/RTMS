import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems, type MenuItem } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Minus, 
  Plus, 
  X, 
  Send, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2,
  WifiOff,
  CloudUpload
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  item: MenuItem;
  quantity: number;
  notes: string;
}

export default function WaiterOrderPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [sent, setSent] = useState(false);
  const [isQueued, setIsQueued] = useState(false);

  const categories = useMemo(() => Array.from(new Set(menuItems.map((i) => i.category))), []);

  const filtered = useMemo(() => {
    let items = menuItems.filter(item => item.isAvailable); 
    if (search) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory) items = items.filter((i) => i.category === activeCategory);
    return items;
  }, [search, activeCategory]);

  const addItem = (item: MenuItem) => {
    setOrder((prev) => {
      const existing = prev.find((o) => o.item.id === item.id);
      if (existing) return prev.map((o) => (o.item.id === item.id ? { ...o, quantity: o.quantity + 1 } : o));
      return [...prev, { item, quantity: 1, notes: "" }];
    });
  };

  const removeItem = (id: number) => setOrder((prev) => prev.filter((o) => o.item.id !== id));

  const updateQuantity = (id: number, delta: number) => {
    setOrder((prev) => prev.map((o) => (o.item.id === id ? { ...o, quantity: o.quantity + delta } : o)).filter((o) => o.quantity > 0));
  };

  const subtotal = order.reduce((sum, o) => sum + o.item.price * o.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSendOrder = () => {
    const isOnline = navigator.onLine;
    
    if (!isOnline) {
      // Handle Offline Mode
      const offlineOrders = JSON.parse(localStorage.getItem("offline_orders") || "[]");
      const newOfflineOrder = {
        id: `OFF-${Date.now()}`,
        items: order.map(o => ({ name: o.item.name, quantity: o.quantity })),
        total: total,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("offline_orders", JSON.stringify([...offlineOrders, newOfflineOrder]));
      setIsQueued(true);
      toast.warning("Offline Mode", {
        description: "Internet is unavailable. Order saved to local queue.",
        icon: <WifiOff className="h-4 w-4" />
      });
    } else {
      setIsQueued(false);
      toast.success("Order Sent", {
        description: "Order successfully sent to kitchen."
      });
    }
    
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center bg-card rounded-[2.5rem] border border-border/50 shadow-2xl p-12 max-w-sm relative overflow-hidden"
        >
          {isQueued && (
            <div className="absolute top-0 left-0 right-0 bg-amber-500 py-1.5 flex items-center justify-center gap-2">
              <CloudUpload className="h-3 w-3 text-white animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Pending Sync</span>
            </div>
          )}
          
          <div className={`h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isQueued ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {isQueued ? <CloudUpload className="h-10 w-10" /> : <CheckCircle2 className="h-10 w-10" />}
          </div>
          
          <h2 className="font-heading font-black text-2xl text-foreground mb-2 uppercase tracking-tight">
            {isQueued ? "Order Queued!" : "Order Sent!"}
          </h2>
          <p className="text-sm text-muted-foreground mb-1 font-medium">
            {isQueued ? "Waiting for internet connection..." : "Directly sent to the kitchen"}
          </p>
          <p className="font-heading font-black text-4xl text-foreground mb-8 mt-4">₹{total.toFixed(2)}</p>
          
          <Button 
            onClick={() => { setOrder([]); setSent(false); }} 
            className="w-full gradient-primary text-primary-foreground border-0 rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            New Order
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left: Categories */}
      <div className="w-56 border-r border-border/50 bg-card/30 p-4 flex flex-col gap-1">
        <h3 className="font-heading font-semibold text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-2">Categories</h3>
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-left text-xs font-bold uppercase tracking-wider px-3 py-2.5 rounded-lg transition-all ${!activeCategory ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-left text-xs font-bold uppercase tracking-wider px-3 py-2.5 rounded-lg transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Center: Menu Items */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Take Order</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Select items to add to the order</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 bg-card border-border/50 rounded-xl"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => addItem(item)}
              className="text-left bg-card border border-border/50 rounded-xl p-5 shadow-elevated hover:shadow-glass hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <span className="font-heading text-lg font-bold text-foreground">₹{item.price}</span>
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">{item.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider rounded-md bg-primary/5 text-primary border-primary/10">
                  {item.category}
                </Badge>
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-80 border-l border-border/50 bg-card flex flex-col">
        <div className="p-5 border-b border-border/50 flex items-center gap-2 bg-muted/20">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Order Cart</h3>
          <Badge className="ml-auto rounded-full text-[10px] font-bold px-2 bg-primary text-primary-foreground">
            {order.length}
          </Badge>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          <AnimatePresence>
            {order.map((o) => (
              <motion.div
                key={o.item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-muted/30 rounded-xl p-4 border border-border/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{o.item.emoji}</span>
                    <span className="text-sm font-semibold text-foreground">{o.item.name}</span>
                  </div>
                  <button onClick={() => removeItem(o.item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(o.item.id, -1)} className="h-7 w-7 rounded-lg border border-border/50 flex items-center justify-center hover:bg-card hover:text-primary transition-all">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-heading font-bold text-sm w-6 text-center">{o.quantity}</span>
                    <button onClick={() => updateQuantity(o.item.id, 1)} className="h-7 w-7 rounded-lg border border-border/50 flex items-center justify-center hover:bg-card hover:text-primary transition-all">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-heading font-bold text-sm text-foreground">₹{(o.item.price * o.quantity).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {order.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-muted-foreground">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Select items from the menu</p>
            </div>
          )}
        </div>

        {order.length > 0 && (
          <div className="border-t border-border/50 p-5 space-y-3 bg-muted/20">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium uppercase tracking-wider">Subtotal</span>
                <span className="text-foreground font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium uppercase tracking-wider">GST (18%)</span>
                <span className="text-foreground font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-border/50">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSendOrder} className="flex-1 gap-2 gradient-primary text-primary-foreground border-0 rounded-xl h-12 font-bold shadow-lg shadow-primary/20">
                <Send className="h-4 w-4" /> Process Order
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all" onClick={() => setOrder([])}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
