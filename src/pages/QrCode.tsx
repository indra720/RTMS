import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tables as mockTables } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode, Download, Printer, Copy, ExternalLink,
  UtensilsCrossed, Bell, CreditCard, BookOpen,
  Check, Grid3X3
} from "lucide-react";
import { toast } from "sonner";

export default function QRCodePage() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tables = mockTables;
  const baseUrl = window.location.origin;

  const getTableUrl = (tableNumber: string) => {
    return `${baseUrl}/customer?table=${tableNumber}`;
  };

  const handleCopyLink = (tableNumber: string) => {
    navigator.clipboard.writeText(getTableUrl(tableNumber));
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = (tableNumber: string) => {
    const svg = document.getElementById(`qr-${tableNumber}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, 512, 512);
      ctx!.drawImage(img, 56, 56, 400, 400);

      // Add table label
      ctx!.fillStyle = "#000";
      ctx!.font = "bold 24px sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText(`Table ${tableNumber}`, 256, 490);

      const link = document.createElement("a");
      link.download = `table-${tableNumber}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    toast.success("QR Code downloaded");
  };

  const handlePrintQR = (tableNumber: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const url = getTableUrl(tableNumber);
    printWindow.document.write(`
      <html>
        <head><title>Table ${tableNumber} QR Code</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;">
          <h1 style="font-size:48px;margin-bottom:8px;">Table ${tableNumber}</h1>
          <p style="color:#888;margin-bottom:32px;">Scan to view menu & order</p>
          <div id="qr-print"></div>
          <p style="margin-top:24px;color:#666;font-size:14px;">${url}</p>
          <script>window.print();window.close();</script>
        </body>
      </html>
    `);
  };

  const qrFeatures = [
    { icon: BookOpen, label: "View Menu", desc: "Browse full digital menu" },
    { icon: UtensilsCrossed, label: "Place Order", desc: "Order directly from phone" },
    { icon: Bell, label: "Call Waiter", desc: "Request service instantly" },
    { icon: CreditCard, label: "Pay Bill", desc: "Settle bill via phone" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            QR Code Ordering
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generate and manage QR codes for contactless table ordering.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl h-11 px-5 font-bold shadow-sm gap-2"
          onClick={() => toast.info("Bulk download coming soon")}
        >
          <Download className="h-4 w-4" /> Download All QR Codes
        </Button>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {qrFeatures.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-sm text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-foreground">{feature.label}</h3>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* QR Code Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Grid3X3 className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg text-foreground">Table QR Codes</h2>
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tables.length} tables
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AnimatePresence>
            {tables.map((table, i) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer"
                onClick={() => setSelectedTable(table.number)}
              >
                {/* QR Preview */}
                <div className="p-6 flex items-center justify-center bg-muted/10 border-b border-border/50 group-hover:bg-primary/5 transition-colors">
                  <div className="relative">
                    <QRCodeSVG
                      id={`qr-grid-${table.number}`}
                      value={getTableUrl(table.number)}
                      size={120}
                      level="M"
                      fgColor="hsl(var(--foreground))"
                      bgColor="transparent"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary/90 text-primary-foreground rounded-lg px-3 py-1.5 text-[10px] font-bold shadow-lg">
                        <ExternalLink className="h-3 w-3 inline mr-1" /> View
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="font-heading font-bold text-foreground text-base">Table {table.number}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wider">{table.capacity} seats</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 rounded-lg text-[10px] font-bold gap-1 hover:text-primary hover:bg-primary/10"
                      onClick={(e) => { e.stopPropagation(); handleDownloadQR(table.number); }}
                    >
                      <Download className="h-3 w-3" /> Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 rounded-lg text-[10px] font-bold gap-1 hover:text-primary hover:bg-primary/10"
                      onClick={(e) => { e.stopPropagation(); handleCopyLink(table.number); }}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Link
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* QR Detail Modal */}
      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        <DialogContent className="sm:max-w-md rounded-xl border border-border/50 shadow-2xl bg-card p-8">
          <DialogHeader className="mb-4 text-center">
            <DialogTitle className="text-2xl font-bold font-heading tracking-tight">
              Table <span className="text-primary">{selectedTable}</span>
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Scan this QR code or share the link with guests.
            </p>
          </DialogHeader>

          {selectedTable && (
            <div className="space-y-6">
              {/* Large QR */}
              <div className="flex justify-center p-8 bg-white rounded-xl border border-border/30 shadow-inner">
                <QRCodeSVG
                  id={`qr-${selectedTable}`}
                  value={getTableUrl(selectedTable)}
                  size={220}
                  level="H"
                  includeMargin
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              {/* URL */}
              <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-2 border border-border/30">
                <code className="flex-1 text-xs font-mono text-muted-foreground truncate">
                  {getTableUrl(selectedTable)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg shrink-0"
                  onClick={() => handleCopyLink(selectedTable)}
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {/* Customer Actions */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Customers can:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {qrFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-muted/20 rounded-xl border border-border/20">
                      <f.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-bold text-foreground">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl font-bold gap-2"
                  onClick={() => handleDownloadQR(selectedTable)}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button
                  className="h-12 rounded-xl gradient-primary text-primary-foreground border-0 font-bold gap-2 shadow-lg shadow-primary/20"
                  onClick={() => handlePrintQR(selectedTable)}
                >
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
