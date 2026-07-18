import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <main>
      <InnerPageHeader 
        title="Forgot Password" 
        breadcrumbs={[
          { label: tNav("membership"), href: "/membership" },
          { label: "Login", href: "/membership/login" },
          { label: "Forgot Password", href: "/membership/forgot-password" }
        ]}
      />
      <div className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[70vh] flex items-center justify-center px-4">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
