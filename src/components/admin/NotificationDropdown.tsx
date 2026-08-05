"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "@/i18n/routing";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // In a real app, you would fetch this via a server action or API route on mount
  // For now, we mock the behavior or leave it empty as a placeholder for the UI
  useEffect(() => {
    // Simulated fetch
    // fetchNotifications().then(data => {
    //   setNotifications(data);
    //   setUnreadCount(data.filter(n => !n.isRead).length);
    // })
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-primary font-semibold hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div key={idx} className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{notif.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Just now</p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link href="/admin/notifications" className="text-sm font-semibold text-primary hover:underline">
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
