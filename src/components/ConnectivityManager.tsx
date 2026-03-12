import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, CloudUpload, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function ConnectivityManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      syncOfflineOrders();
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncOfflineOrders = () => {
    const offlineOrders = JSON.parse(localStorage.getItem("offline_orders") || "[]");
    
    if (offlineOrders.length > 0) {
      setSyncing(true);
      // Simulate API call for each order
      setTimeout(() => {
        console.log(`Syncing ${offlineOrders.length} orders to kitchen...`);
        localStorage.removeItem("offline_orders");
        setSyncing(false);
        toast.success("Sync Complete", {
          description: `${offlineOrders.length} offline orders have been sent to the kitchen.`,
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        });
      }, 2000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {(!isOnline || showStatus || syncing) && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-center p-2 pointer-events-none`}
          >
            <div className={`px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 border pointer-events-auto ${
              !isOnline ? "bg-destructive text-white border-destructive/20" : 
              syncing ? "bg-amber-500 text-white border-amber-400" : 
              "bg-emerald-500 text-white border-emerald-400"
            }`}>
              {syncing ? (
                <>
                  <CloudUpload className="h-4 w-4 animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-widest">Syncing Orders...</span>
                </>
              ) : !isOnline ? (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Offline Mode Active</span>
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Internet Restored</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOnline && (
        <div className="fixed bottom-20 left-4 right-4 z-[50] pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/95 backdrop-blur-md border-2 border-destructive/20 p-4 rounded-2xl shadow-xl max-w-md mx-auto"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground uppercase tracking-tight">Connectivity Warning</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  You are currently offline. Orders will be saved locally and automatically sent to the kitchen once you reconnect.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
