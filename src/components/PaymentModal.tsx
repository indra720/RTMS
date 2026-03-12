import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Users, 
  Trophy, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft,
  Divide,
  History,
  Smartphone,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { RestaurantTable } from "@/data/mock-data";

interface PaymentModalProps {
  table: RestaurantTable;
  onClose: () => void;
  onPaymentSuccess: (tableId: number) => void;
}

type PaymentStep = "summary" | "split" | "method" | "processing" | "success";
type PaymentMethod = "cash" | "card" | "upi" | "loyalty";

export function PaymentModal({ table, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("summary");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [splitCount, setSplitCount] = useState(1);
  const [loyaltyPoints, setLoyaltyPoints] = useState(450); // Mock points
  
  const order = table.currentOrder || { id: "N/A", items: [], total: 0 };
  const subtotal = order.total;
  const tax = subtotal * 0.18; // 18% GST
  const grandTotal = subtotal + tax;
  const perPersonAmount = grandTotal / splitCount;

  const handleProcessPayment = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      toast.success("Payment Successful!", {
        description: `Order ${order.id} has been fully paid.`,
      });
    }, 2000);
  };

  const handleFinalize = () => {
    onPaymentSuccess(table.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-border/50 rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            {step !== "summary" && step !== "success" && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep(step === "method" ? (splitCount > 1 ? "split" : "summary") : "summary")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h3 className="font-heading font-black text-lg text-foreground uppercase tracking-tight">Table {table.number} Checkout</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Order #{order.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={onClose} disabled={step === "processing"}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-6 pb-8">
          <AnimatePresence mode="wait">
            {step === "summary" && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-base">Order Summary</h4>
                    <Badge variant="outline" className="font-bold border-primary/20 text-primary h-5 text-[10px]">{order.items.length} Items</Badge>
                  </div>
                  <div className="space-y-2.5 bg-muted/20 rounded-xl p-4 border border-border/30">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-md bg-foreground text-background flex items-center justify-center text-[9px] font-black">{item.quantity}</span>
                          <span className="font-bold text-foreground">{item.name}</span>
                        </div>
                        <span className="font-black text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-1 border-t border-border/30 space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <span>GST (18%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-heading font-black text-primary pt-1">
                        <span>Total Payable</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 group hover:border-primary/50 transition-all"
                    onClick={() => setStep("split")}
                  >
                    <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Split Bill</span>
                  </Button>
                  <Button 
                    className="h-16 rounded-xl gradient-primary flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition-all"
                    onClick={() => setStep("method")}
                  >
                    <CreditCard className="h-5 w-5 text-primary-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Full Payment</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "split" && (
              <motion.div 
                key="split"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-2"
              >
                <div className="text-center space-y-1">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Divide className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-heading font-black tracking-tight">Split the Bill</h4>
                  <p className="text-xs text-muted-foreground font-medium">How many people are sharing?</p>
                </div>

                <div className="flex items-center justify-center gap-5 max-w-xs mx-auto">
                  <Button 
                    variant="outline" 
                    className="h-10 w-10 rounded-lg border-2 text-xl font-black"
                    onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                    disabled={splitCount <= 1}
                  >
                    -
                  </Button>
                  <div className="text-center">
                    <span className="text-4xl font-heading font-black text-foreground">{splitCount}</span>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">People</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-10 w-10 rounded-lg border-2 text-xl font-black"
                    onClick={() => setSplitCount(Math.min(20, splitCount + 1))}
                  >
                    +
                  </Button>
                </div>

                <Card className="border-2 border-primary/20 bg-primary/5 overflow-hidden rounded-xl">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">Per Person</p>
                      <h5 className="text-2xl font-heading font-black text-primary">₹{perPersonAmount.toFixed(2)}</h5>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Total</p>
                      <p className="font-bold text-sm text-foreground">₹{grandTotal.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full h-12 rounded-xl gradient-primary font-black uppercase tracking-widest text-xs shadow-lg" onClick={() => setStep("method")}>
                  Proceed with Split <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {step === "method" && (
              <motion.div 
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="text-center mb-2">
                  <h4 className="text-lg font-heading font-black text-foreground">Payment Method</h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    {splitCount > 1 ? `Paying ₹${perPersonAmount.toFixed(2)} per person` : `Paying full ₹${grandTotal.toFixed(2)}`}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "upi", label: "UPI / Scan QR", icon: QrCode, sub: "G-Pay, PhonePe", color: "text-blue-600 bg-blue-50 border-blue-100" },
                    { id: "card", label: "Card Payment", icon: CreditCard, sub: "Debit or Credit", color: "text-purple-600 bg-purple-50 border-purple-100" },
                    { id: "cash", label: "Cash Payment", icon: Banknote, sub: "Physical Currency", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                    { id: "loyalty", label: "Loyalty Points", icon: Trophy, sub: `${loyaltyPoints} available`, color: "text-amber-600 bg-amber-50 border-amber-100" }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === method.id 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-border/50 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${method.color}`}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-xs text-foreground leading-tight">{method.label}</p>
                        <p className="text-[9px] text-muted-foreground font-medium mt-0.5">{method.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg border border-blue-200">
                      <QrCode className="h-12 w-12 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-900 leading-tight">Scan to pay ₹{splitCount > 1 ? perPersonAmount.toFixed(2) : grandTotal.toFixed(2)}</p>
                      <p className="text-[9px] text-blue-700 font-medium">Any UPI app supported</p>
                    </div>
                  </motion.div>
                )}

                <Button 
                  className="w-full h-12 rounded-xl gradient-primary font-black uppercase tracking-widest text-xs shadow-lg" 
                  disabled={!paymentMethod}
                  onClick={handleProcessPayment}
                >
                  Confirm & Pay ₹{splitCount > 1 ? perPersonAmount.toFixed(2) : grandTotal.toFixed(2)}
                </Button>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-heading font-black text-foreground tracking-tight">Processing</h4>
                  <p className="text-xs text-muted-foreground font-medium">Connecting to payment gateway...</p>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                  >
                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                  </motion.div>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-2xl font-heading font-black text-foreground tracking-tight uppercase">Success!</h4>
                  <p className="text-sm text-muted-foreground font-medium">Table {table.number} cleared.</p>
                </div>

                <div className="w-full bg-muted/20 p-4 rounded-2xl border border-border/30 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>E-Invoice Sent</span>
                    <span className="text-foreground font-black">table-{table.number}@sync.com</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Points Earned</span>
                    <span className="text-amber-600 font-black">+85 PTS</span>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl gradient-primary font-black uppercase tracking-widest text-xs shadow-lg" onClick={handleFinalize}>
                  Back to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
