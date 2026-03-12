import { motion } from "framer-motion";
import { X, Printer, Download, CreditCard, Banknote, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bill } from "@/data/mock-data";
import { toast } from "sonner";

interface BillPanelProps {
  bill: Bill;
  onClose: () => void;
}

export function BillPanel({ bill, onClose }: BillPanelProps) {
  const handlePrint = () => {
    toast.success("Printing invoice...", { description: `Invoice ${bill.id} sent to printer.` });
  };

  const handleDownload = () => {
    toast.success("Downloading PDF...", { description: `Invoice ${bill.id} saved to downloads.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-border/50 rounded-2xl shadow-glass max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-foreground">Invoice Details</h3>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-bold">
              {bill.status}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Bill Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Invoice ID</p>
              <h4 className="font-heading font-bold text-foreground">{bill.id}</h4>
              <p className="text-xs text-muted-foreground mt-1">{bill.date} · {bill.time}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Table</p>
              <h4 className="font-heading font-bold text-foreground">Table {bill.tableNumber}</h4>
              <p className="text-xs text-muted-foreground mt-1">{bill.customerName}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border/30 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-[10px] font-bold uppercase text-muted-foreground">Item</th>
                  <th className="text-center p-3 text-[10px] font-bold uppercase text-muted-foreground">Qty</th>
                  <th className="text-right p-3 text-[10px] font-bold uppercase text-muted-foreground">Price</th>
                  <th className="text-right p-3 text-[10px] font-bold uppercase text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {bill.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-3 text-foreground font-medium">{item.name}</td>
                    <td className="p-3 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="p-3 text-right text-muted-foreground">₹{item.price.toFixed(2)}</td>
                    <td className="p-3 text-right text-foreground font-semibold">₹{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 bg-muted/20 p-4 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="text-foreground font-semibold">₹{bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">GST (18%)</span>
              <span className="text-foreground font-semibold">₹{bill.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border/30 flex justify-between items-center">
              <span className="font-heading font-bold text-foreground text-lg">Total Amount</span>
              <span className="font-heading font-bold text-primary text-xl">₹{bill.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center justify-between p-4 border border-border/30 rounded-xl bg-card">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {bill.paymentMethod === 'card' && <CreditCard className="h-5 w-5" />}
                {bill.paymentMethod === 'cash' && <Banknote className="h-5 w-5" />}
                {bill.paymentMethod === 'upi' && <QrCode className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Payment Method</p>
                <p className="text-sm font-bold text-foreground capitalize">{bill.paymentMethod}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" /> Paid
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 bg-muted/30 flex gap-3">
          <Button variant="outline" className="flex-1 gap-2 rounded-xl h-11 font-bold" onClick={handleDownload}>
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button className="flex-[2] gap-2 rounded-xl h-11 font-bold gradient-primary text-primary-foreground border-0" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
