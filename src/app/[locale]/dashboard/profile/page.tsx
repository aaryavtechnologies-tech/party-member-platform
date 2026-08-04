import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileFormClient, ProfileData } from "./ProfileFormClient";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/membership/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { memberProfile: true }
  });

  if (!user || !user.memberProfile) {
    redirect("/dashboard/membership");
  }

  // Pre-fill data
  const defaultValues: ProfileData = {
    fullName: user.name || "",
    fatherName: user.memberProfile.fatherName || "",
    dob: user.memberProfile.dob ? new Date(user.memberProfile.dob).toISOString().split('T')[0] : "",
    email: user.email || "",
    mobile: user.memberProfile.mobile || "",
    address: user.memberProfile.fullAddress || "",
    pincode: user.memberProfile.pincode || "",
    image: user.image || ""
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500">Manage your personal information and contact details.</p>
      </div>

      <ProfileFormClient defaultValues={defaultValues} />
    </div>
  );
}
