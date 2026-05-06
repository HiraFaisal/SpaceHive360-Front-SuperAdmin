"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  getAllCompanies, 
  approveCompany, 
  rejectCompany,
  Company 
} from "@/lib/api/superadmin-companies";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
} from "@/components/ui/card";
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal,
  RefreshCw,
  Search,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleApproveAction = async () => {
    if (!selectedCompany) return;
    
    setActionLoading(true);
    try {
      await approveCompany(selectedCompany.companyId);
      setIsApproveModalOpen(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectAction = async () => {
    if (!selectedCompany || !remarks.trim()) return;
    
    setActionLoading(true);
    try {
      await rejectCompany(selectedCompany.companyId, remarks);
      setIsRejectModalOpen(false);
      setSelectedCompany(null);
      setRemarks("");
      fetchCompanies();
    } catch (err) {
      console.error("Rejection failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesFilter = filter === "All" || c.status === filter;
    const matchesSearch = (c.companyName?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) || 
                          (c.email?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="size-3 mr-1" /> Approved</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20"><Clock className="size-3 mr-1" /> Pending</Badge>;
      case "Rejected":
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-rose-500/20"><XCircle className="size-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Ecosystem Partners</h1>
          <p className="text-muted-foreground font-medium">Global governance of space providers and partner entities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCompanies} className="h-10 rounded-xl gap-2 font-semibold">
             <RefreshCw className={cn("size-4", loading && "animate-spin")} />
             Sync Data
          </Button>
          <Button size="sm" className="h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 font-semibold px-6">
             Global Report
          </Button>
        </div>
      </div>

      <Card className="shadow-none border-none bg-transparent">
        <CardHeader className="p-0 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input 
                placeholder="Search ecosystem..." 
                className="pl-9 h-10 bg-card rounded-full border-border/40 focus-visible:border-primary/50 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-1 bg-card border border-border/40 p-1 rounded-xl shadow-sm">
               {["All", "Pending", "Approved", "Rejected"].map((s) => (
                 <button
                   key={s}
                   onClick={() => setFilter(s)}
                   className={cn(
                     "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                     filter === s 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                   )}
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-separate border-spacing-y-2.5">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70 h-10 px-6">Provider / Entity</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70 h-10">Contact Details</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70 h-10">Registered</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70 h-10">Status</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-widest text-muted-foreground/70 h-10 pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow key="loading-row" className="border-none bg-transparent">
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="text-sm font-semibold text-muted-foreground">Synchronizing ecosystem data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow key="empty-row" className="border-none bg-transparent">
                  <TableCell colSpan={5} className="h-64 text-center">
                     <div className="flex flex-col items-center justify-center gap-4">
                        <div className="size-16 rounded-2xl bg-muted/30 flex items-center justify-center border border-dashed border-border">
                            <Building2 className="size-8 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">No partners found</p>
                            <p className="text-xs text-muted-foreground">Try adjusting your filters or search terms.</p>
                        </div>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow 
                    key={company.companyId} 
                    className="group border-none bg-card hover:bg-accent/5 transition-all shadow-sm ring-1 ring-border/40 hover:ring-primary/20"
                  >
                    <TableCell className="py-4 px-6 first:rounded-l-2xl">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shadow-inner ring-1 ring-primary/20">
                          {company.companyName?.substring(0, 2).toUpperCase() ?? "??"}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm tracking-tight text-foreground underline-offset-4 group-hover:underline group-hover:text-primary transition-colors">{company.companyName}</span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/50 px-1.5 py-0.5 rounded w-fit">PID: {company.companyId.split('-')[0]}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col text-xs gap-1">
                        <span className="font-bold text-foreground/80">{company.email}</span>
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                           <div className="size-1 rounded-full bg-primary/40 animate-pulse" />
                           {company.contactPersonName || "Unassigned"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground/70">
                            {new Date(company.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">{new Date(company.createdAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(company.status)}
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6 last:rounded-r-2xl">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                    <MoreHorizontal className="size-5" />
                                    <span className="sr-only">Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-border/60">
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 py-2">Management</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {company.status === "Pending" && (
                                    <>
                                        <DropdownMenuItem 
                                            className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 font-semibold cursor-pointer py-2.5 rounded-lg mx-1"
                                            onClick={() => {
                                                setSelectedCompany(company);
                                                setIsApproveModalOpen(true);
                                            }}
                                        >
                                            <Check className="size-4 mr-2" />
                                            Approve Partner
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 font-semibold cursor-pointer py-2.5 rounded-lg mx-1"
                                            onClick={() => {
                                                setSelectedCompany(company);
                                                setIsRejectModalOpen(true);
                                            }}
                                        >
                                            <X className="size-4 mr-2" />
                                            Reject Partner
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem className="font-semibold cursor-pointer py-2.5 rounded-lg mx-1">
                                    View Full Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-semibold cursor-pointer py-2.5 rounded-lg mx-1">
                                    Security Audit
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* APPROVAL MODAL */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl gap-6">
          <DialogHeader className="items-center text-center">
            <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mb-2 ring-8 ring-emerald-50/50">
              <Check className="size-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-bold">Approve Ecosystem Partner?</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              You are about to grant <span className="text-foreground font-bold">"{selectedCompany?.companyName}"</span> full access to the SpaceHive360 ecosystem.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-xs leading-relaxed text-primary/80 font-medium">
                This action will notify the provider via email and enable their workspace management capabilities immediately.
            </p>
          </div>
          <DialogFooter className="sm:justify-center gap-3">
            <Button 
                variant="outline" 
                onClick={() => setIsApproveModalOpen(false)}
                className="flex-1 rounded-xl h-11 font-bold text-muted-foreground"
            >
                Cancel
            </Button>
            <Button 
                onClick={handleApproveAction}
                disabled={actionLoading}
                className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold"
            >
                {actionLoading ? "Processing..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECTION MODAL */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl gap-6">
          <DialogHeader className="items-center text-center">
            <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center mb-2 ring-8 ring-rose-50/50">
              <X className="size-8 text-rose-600" />
            </div>
            <DialogTitle className="text-xl font-bold">Reject Partner Application</DialogTitle>
            <DialogDescription className="text-sm font-medium">
                Please provide detailed reasoning for rejecting <span className="text-foreground font-bold">"{selectedCompany?.companyName}"</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Rejection Remarks (Mandatory)</Label>
                  <Textarea 
                       id="remarks"
                       placeholder="e.g., Missing documentation, incomplete security credentials, or invalid entity records..."
                       className="rounded-xl min-h-[120px] focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 transition-all bg-muted/20"
                       value={remarks}
                       onChange={(e) => setRemarks(e.target.value)}
                  />
                  {!remarks.trim() && (
                      <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-1 ml-1">
                          <AlertCircle className="size-3" /> Remarks are required to finalize rejection
                      </p>
                  )}
              </div>
          </div>

          <DialogFooter className="sm:justify-center gap-3">
            <Button 
                variant="outline" 
                onClick={() => {
                    setIsRejectModalOpen(false);
                    setRemarks("");
                }}
                className="flex-1 rounded-xl h-11 font-bold text-muted-foreground"
            >
                Abort
            </Button>
            <Button 
                onClick={handleRejectAction}
                disabled={actionLoading || !remarks.trim()}
                className="flex-1 rounded-xl h-11 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 font-bold"
            >
                {actionLoading ? "Processing..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
