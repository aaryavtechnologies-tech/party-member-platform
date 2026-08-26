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
    voterId: user.memberProfile.voterId || "",
    aadhaar: user.memberProfile.aadhaar || "",
    image: user.image || user.memberProfile.profilePic || "",
    gender: user.memberProfile.gender || "",
    state: user.memberProfile.state || "",
    district: user.memberProfile.district || "",
    taluka: user.memberProfile.taluka || "",
    village: user.memberProfile.village || "",
    occupation: user.memberProfile.occupation || "",
    memberId: user.memberProfile.memberId?.toString() || "",
    membershipType: user.memberProfile.membershipType || "",
    status: user.memberProfile.status || "",
    referralCode: user.memberProfile.referralCode || "",
    issueDate: user.memberProfile.issueDate ? new Date(user.memberProfile.issueDate).toISOString().split('T')[0] : ""
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
