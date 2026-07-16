import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("MembershipPage");

  return (
    <main>
      <InnerPageHeader 
        title="Login" 
        breadcrumbs={[
          { label: tNav("membership"), href: "/membership" },
          { label: "Login", href: "/membership/login" }
        ]}
      />
      <div className="py-24 bg-white dark:bg-slate-950 min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p className="text-xl">Login form will be integrated here.</p>
        </div>
      </div>
    </main>
  );
}
