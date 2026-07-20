import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { PublicOrganizationStructure } from "@/components/organization/PublicOrganizationStructure";
import { useTranslations } from "next-intl";

export default function OrganizationPage() {
  const tNav = useTranslations("Navigation");
  
  return (
    <main>
      {/* We can skip InnerPageHeader if we want since PublicOrganizationStructure has its own Hero, 
          but if it's required for consistency, we can keep it. The custom Hero might be better. 
          Let's just use the custom structure directly. */}
      <PublicOrganizationStructure />
    </main>
  );
}
