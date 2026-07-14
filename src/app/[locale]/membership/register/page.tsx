import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { RegistrationForm } from "@/components/forms/RegistrationForm";

export default function RegisterPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Become a Member" 
        description="Join our movement to build a stronger, prosperous, and inclusive nation. Registration is free for all citizens."
        breadcrumbs={[
          { label: "Membership", href: "/membership" },
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
