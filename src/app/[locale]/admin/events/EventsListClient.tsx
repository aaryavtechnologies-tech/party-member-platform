"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { 
  Calendar, MapPin, Users, Plus, Search, Edit, Trash2, 
  Clock, CheckCircle, AlertCircle, Loader2 
} from "lucide-react";
import { deleteAdminEvent } from "@/actions/admin/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function EventsListClient({ initialEvents }: { initialEvents: any[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;
    
    setDeletingId(eventId);
    try {
      await deleteAdminEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Event Management</h1>
          <p className="text-sm text-slate-500">Plan, organize, and manage party events and rally schedules.</p>
        </div>
        <Link href="/admin/events/create">
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Create Event
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {["ALL", "PUBLISHED", "DRAFT", "CANCELLED"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === status 
                    ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title or venue..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No events found</p>
              <p className="text-sm text-slate-400 mt-1">Try changing your filters or create a new event.</p>
              <Link href="/admin/events/create">
                <Button variant="outline" size="sm" className="mt-4 rounded-xl">
                  <Plus className="w-4 h-4 mr-1" /> Create Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isDeleting = deletingId === event.id;
                
                return (
                  <div key={event.id} className="group relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      {/* Cover Thumbnail */}
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                        {event.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/60">
                            <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                            event.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 
                            event.status === 'CANCELLED' ? 'bg-red-500 text-white' : 
                            'bg-slate-700 text-white'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Body Info */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1" title={event.title}>
                          {event.title}
                        </h3>

                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                            {event.startTime && <span>at {event.startTime}</span>}
                          </p>
                          
                          <p className="flex items-center gap-2 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event.venue || "Venue TBA"}</span>
                          </p>
                          
                          <p className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event._count?.registrations || 0} Registrations {event.maxParticipants && `/ ${event.maxParticipants} max`}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
                      <span className="text-[11px] font-medium text-slate-400">
                        {event.village || event.taluka || event.district || event.state || "National"} Scope
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/events/edit/${event.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2.5 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => handleDelete(event.id, event.title)}
                          className="h-8 px-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg text-xs"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                          ) : (
                            <>
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
