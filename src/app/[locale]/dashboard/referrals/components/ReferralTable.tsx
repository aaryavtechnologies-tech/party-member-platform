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

export type ReferralData = {
  id: string;
  name: string;
  date: string;
  status: string;
  tier: string;
};

export function ReferralTable({ data }: { data: ReferralData[] }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-500">No referrals yet. Share your link to start building your network!</div>;
  }

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
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-white">{row.name}</div>
                <div className="text-xs text-slate-500">{row.id}</div>
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-400">{row.date}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  row.tier === "LIFETIME_ACTIVE" ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10" : 
                  row.tier === "LIFETIME_PRIMARY" ? "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-500/10" : ""
                }>
                  {row.tier.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={row.status === "ACTIVE" ? "default" : "secondary"} className={row.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400" : ""}>
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
