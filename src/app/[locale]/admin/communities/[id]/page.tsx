import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { getCommunityDetails, getCommunityJoinRequests } from "@/actions/communities/fetch";
import CommunityAdminClient from "./CommunityAdminClient";
import { redirect } from "next/navigation";

export default async function AdminCommunityDetailsPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  const community = await getCommunityDetails(id);
  if (!community) {
    redirect("/admin/communities");
  }

  const joinRequests = await getCommunityJoinRequests(id);

  return (
    <main>
      <InnerPageHeader 
        title={`Manage: ${community.name}`} 
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Communities", href: "/admin/communities" },
          { label: community.name, href: `/admin/communities/${id}` }
        ]}
      />
      
      <div className="p-6">
        <CommunityAdminClient community={community} initialRequests={joinRequests} />
      </div>
    </main>
  );
}
