import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <main>
      <InnerPageHeader 
        title="Reset Password" 
        breadcrumbs={[
          { label: tNav("membership"), href: "/membership" },
          { label: "Login", href: "/membership/login" },
          { label: "Reset Password", href: "/membership/reset-password" }
        ]}
      />
      <div className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[70vh] flex items-center justify-center px-4">
        <Suspense fallback={<div className="animate-pulse">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
