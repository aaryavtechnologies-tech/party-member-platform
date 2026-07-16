import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("MembershipPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("membership"), href: "/membership" },
          { label: "Register", href: "/membership/register" }
        ]}
      />
      <div className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
