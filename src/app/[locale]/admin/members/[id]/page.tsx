import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { 
  User as UserIcon, Phone, Mail, MapPin, Calendar, CreditCard, 
  ShieldCheck, Share2, Edit, Ban, RefreshCw, MailWarning, FileText
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { DeleteMemberButton } from "@/components/admin/DeleteMemberButton";
import { getAdminMemberById } from "@/actions/admin/members";
import MemberStatusActions from "./MemberStatusActions";

export default async function AdminMemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let profile;
  try {
    profile = await getAdminMemberById(id);
  } catch (error) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "ACTIVE": return "text-green-600 bg-green-100 border-green-200";
      case "SUSPENDED": return "text-red-600 bg-red-100 border-red-200";
      case "REJECTED": return "text-red-600 bg-red-100 border-red-200";
      case "PENDING_VERIFICATION": return "text-orange-600 bg-orange-100 border-orange-200";
      default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-white dark:border-slate-950 shadow-sm flex items-center justify-center shrink-0 overflow-hidden text-3xl font-black text-slate-400">
            {profile.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.user.image} alt={profile.user.name} className="w-full h-full object-cover" />
            ) : (
              profile.user.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{profile.user.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-sm text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                {profile.memberId}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusColor(profile.status)}`}>
                {profile.status.replace("_", " ")}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase">
                {profile.membershipType.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {profile.district}, {profile.state}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <MemberStatusActions memberId={profile.id} currentStatus={profile.status} />
          
          <DeleteMemberButton
            profileId={profile.id}
            memberId={String(profile.memberId)}
            memberName={profile.user.name}
            variant="button"
            redirectAfterDelete={true}
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Info & Assignment */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Father's Name</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.fatherName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.gender}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(profile.dob).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Occupation</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.occupation || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Contact & Location
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.email || profile.user.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location Scope</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">State:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{profile.state}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">District:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{profile.district}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Taluka:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{profile.taluka}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Village:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{profile.village}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Memberships, ID, Referrals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Membership Data
              </h3>
            </div>
            <div className="p-6 grid sm:grid-cols-3 gap-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                <Calendar className="w-5 h-5 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Registration Date</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approved By</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile.approvedById || "System / Pending"}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                <Calendar className="w-5 h-5 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expiry Date</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {profile.membershipExpiry ? new Date(profile.membershipExpiry).toLocaleDateString() : "Lifetime / N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
