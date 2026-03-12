import { useState } from "react";
import { motion } from "framer-motion";
import { FloorPlan } from "@/components/FloorPlan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Move, MousePointer2, Save, Info, Layout } from "lucide-react";

export default function AdminFloorPlanPage() {
  return (
    <div className="p-2 space-y-2 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Floor Plan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Drag and drop tables to match your physical restaurant layout.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-xl border border-border/50">
            <div className="flex items-center gap-2">
              <MousePointer2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Select</span>
            </div>
            <div className="flex items-center gap-2">
              <Move className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Drag</span>
            </div>
          </div>
          <Button className="rounded-lg h-10 px-6 font-bold gap-2">
            <Save className="h-4 w-4" /> Save Blueprint
          </Button>
        </div>
      </div>

      {/* Main Designer Area */}
      <div className="flex-1 min-h-[600px] bg-card border border-border/50 rounded-xl overflow-hidden shadow-elevated relative">
        <div className="absolute inset-0 z-0">
          <FloorPlan />
        </div>

        {/* Legend / Info Overlay */}
        <div className="absolute bottom-6 left-6 z-10 hidden sm:block">
          <div className="bg-background/80 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-glass space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-border/50 pb-2 mb-2">Designer Guide</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-status-available" />
                <span className="text-[10px] font-bold text-foreground uppercase">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-status-occupied" />
                <span className="text-[10px] font-bold text-foreground uppercase">Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-status-reserved" />
                <span className="text-[10px] font-bold text-foreground uppercase">Reserved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Tip */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex">
          <Badge variant="outline" className="bg-background/50 backdrop-blur-md border-border/50 px-4 py-1.5 rounded-full shadow-sm gap-2 flex items-center">
            <Info className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-tight " >Drag tables to reposition. Changes auto-cached.</span>
          </Badge>
        </div>
      </div>
    </div>
  );
}
