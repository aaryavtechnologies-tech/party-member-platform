"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminBroadcasts } from "@/actions/admin/broadcasts";

export function BroadcastBell() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);

  useEffect(() => {
    getAdminBroadcasts().then(data => {
      setBroadcasts(data);
    }).catch(console.error);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Bell className="w-5 h-5" />
          {broadcasts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 mt-2 rounded-xl">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {broadcasts.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
        ) : (
          broadcasts.map(b => (
            <DropdownMenuItem key={b.id} className="flex flex-col items-start p-3 gap-1 cursor-pointer">
              <span className="font-bold text-sm">{b.title}</span>
              <span className="text-xs text-slate-500 line-clamp-2">{b.message}</span>
              {b.imageUrl && (
                <div className="mt-1 w-full text-xs text-primary font-medium flex gap-2">
                  <a href={b.imageUrl} target="_blank" rel="noreferrer" className="underline" onClick={e => e.stopPropagation()}>View Image</a>
                  {b.fileUrl && <a href={b.fileUrl} target="_blank" rel="noreferrer" className="underline" onClick={e => e.stopPropagation()}>View File</a>}
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
