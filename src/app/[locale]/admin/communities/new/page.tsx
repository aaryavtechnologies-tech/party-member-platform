import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import NewCommunityClient from "./NewCommunityClient";

export default function NewCommunityPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Create New Community" 
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Communities", href: "/admin/communities" },
          { label: "Create", href: "/admin/communities/new" }
        ]}
      />
      
      <div className="p-6 max-w-4xl mx-auto">
        <NewCommunityClient />
      </div>
    </main>
  );
}
