import { getAdminEvents } from "@/actions/admin/events";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { EventsListClient } from "./EventsListClient";

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      <EventsListClient initialEvents={events} />
    </div>
  );
}

