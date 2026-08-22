import { getAdminEventById } from "@/actions/admin/events";
import { EditEventClient } from "./EditEventClient";
import { notFound } from "next/navigation";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const event = await getAdminEventById(id);

  if (!event) {
    notFound();
  }

  return <EditEventClient event={event} />;
}
