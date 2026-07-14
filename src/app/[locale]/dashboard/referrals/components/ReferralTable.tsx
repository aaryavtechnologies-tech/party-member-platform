"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const dummyData = [
  { id: "RAVP-2026-100234", name: "Rahul Patel", date: "Oct 12, 2026", status: "Active", tier: "Lifetime Active" },
  { id: "RAVP-2026-100235", name: "Sunita Sharma", date: "Oct 10, 2026", status: "Active", tier: "Primary" },
  { id: "RAVP-2026-100236", name: "Vikram Singh", date: "Oct 08, 2026", status: "Pending", tier: "Primary" },
  { id: "RAVP-2026-100237", name: "Amit Desai", date: "Oct 05, 2026", status: "Active", tier: "Lifetime Primary" },
];

export function ReferralTable() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-white">{row.name}</div>
                <div className="text-xs text-slate-500">{row.id}</div>
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-400">{row.date}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  row.tier === "Lifetime Active" ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10" : 
                  row.tier === "Lifetime Primary" ? "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-500/10" : ""
                }>
                  {row.tier}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={row.status === "Active" ? "default" : "secondary"} className={row.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400" : ""}>
                  {row.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
