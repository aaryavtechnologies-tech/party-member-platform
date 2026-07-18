import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const tNav = useTranslations("Navigation");

  return (
    <main>
      <InnerPageHeader 
        title="Login" 
        breadcrumbs={[
          { label: tNav("membership"), href: "/membership" },
          { label: "Login", href: "/membership/login" }
        ]}
      />
      <div className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[70vh] flex items-center justify-center px-4">
        <LoginForm />
      </div>
    </main>
  );
}
