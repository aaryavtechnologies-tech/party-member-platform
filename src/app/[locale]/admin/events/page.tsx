import { getAdminEvents } from "@/actions/admin/events";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Search, Plus, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminBreadcrumbs />
        <Link href="/admin/events/create">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Create Event
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Event Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {events.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No events found in your jurisdiction.
            </div>
          ) : (
            events.map((event: any) => (
              <div key={event.id} className="group relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{event.title}</h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      {new Date(event.date).toLocaleDateString()} {event.startTime && `at ${event.startTime}`}
                    </p>
                    <p className="flex items-center gap-2 line-clamp-1">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      {event.venue || "TBA"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      {event._count.registrations} Registrations {event.maxParticipants && `/ ${event.maxParticipants}`}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500">
                      {event.village || event.taluka || event.district || event.state || "National"} Scope
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
