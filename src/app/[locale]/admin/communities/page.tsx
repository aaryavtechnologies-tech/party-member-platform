import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { getAdminCommunities } from "@/actions/communities/fetch";
import CommunitiesClient from "./CommunitiesClient";

export default async function AdminCommunitiesPage() {
  const communities = await getAdminCommunities();

  return (
    <main>
      <InnerPageHeader 
        title="Manage Communities" 
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Communities", href: "/admin/communities" }
        ]}
      />
      
      <div className="p-6">
        <CommunitiesClient initialData={communities} />
      </div>
    </main>
  );
}
