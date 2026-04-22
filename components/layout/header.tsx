"use client";

import { Search, Bell, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-border/40 bg-background/60 px-4 md:px-6 backdrop-blur-md transition-all">
      
      {/* Mobile Menu Trigger */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden -ml-2 text-muted-foreground"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Global Command Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden lg:flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            <Input 
                placeholder="Global ecosystem search..." 
                className="pl-9 h-9 w-full rounded-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-ring/30 focus-visible:ring-0 transition-all shadow-none" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
            </div>
        </div>
        
        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
             <Search className="size-5" />
        </Button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
         {/* AI / System Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-xs font-medium text-primary/80 mr-2">
            <Sparkles className="size-3" />
            <span className="text-[10px] uppercase tracking-wider font-bold">System Governance Active</span>
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-[1.5px] border-background"></span>
        </Button>
        
        <div className="h-8 w-px bg-border/40 mx-2 hidden sm:block" />
        
        <div className="flex items-center gap-2 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Super Admin</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">Global Console</p>
            </div>
            <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                SA
            </div>
        </div>
      </div>
    </header>
  );
}
