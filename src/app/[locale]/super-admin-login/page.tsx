import { SuperAdminLoginForm } from "@/components/auth/SuperAdminLoginForm";

export const metadata = {
  title: "Super Admin Login | RAVP",
  description: "Secure Super Admin login portal for the Rashtriya Annadata Vikas Party platform",
};

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Soft background pattern matching website theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative w-full max-w-md z-10">
        <SuperAdminLoginForm />
      </div>
    </div>
  );
}
