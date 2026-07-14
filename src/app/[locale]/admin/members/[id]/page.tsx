import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { 
  User as UserIcon, Phone, Mail, MapPin, Calendar, CreditCard, 
  ShieldCheck, Share2, Edit, Ban, RefreshCw, MailWarning, FileText
} from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function AdminMemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.memberProfile.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!profile) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "ACTIVE": return "text-green-600 bg-green-100 border-green-200";
      case "SUSPENDED": return "text-red-600 bg-red-100 border-red-200";
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

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors">
            <MailWarning className="w-4 h-4" /> Email
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold transition-colors border border-red-200 dark:border-red-900/50">
            <Ban className="w-4 h-4" /> Suspend
          </button>
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
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Details</p>
                <div className="space-y-2">
                  <p className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400" /> {profile.mobile}
                  </p>
                  <p className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400" /> {profile.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Address & Region
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Address</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.fullAddress}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Village</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.village}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Taluka</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.taluka}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">District</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.district}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">State</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.state}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Data */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
              <button className="px-6 py-4 text-sm font-bold border-b-2 border-primary text-primary whitespace-nowrap">Overview</button>
              <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white whitespace-nowrap">Payments</button>
              <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white whitespace-nowrap">Referrals</button>
              <button className="px-6 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white whitespace-nowrap">Activity Logs</button>
            </div>

            <div className="p-6 space-y-8">
              
              {/* Membership Details */}
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Membership Data
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Registration Date</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Date</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> {new Date(profile.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium transition-colors">
                    <RefreshCw className="w-4 h-4" /> Regenerate ID Card
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium transition-colors">
                    <FileText className="w-4 h-4" /> Regenerate Certificate
                  </button>
                </div>
              </div>

              {/* Identity Documents */}
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Identity Documents
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Aadhaar Number</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 inline-block">
                      {profile.aadhaar || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Voter ID</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 inline-block">
                      {profile.voterId || "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Organization Assignment */}
              <div className="p-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Organization Assignment</h4>
                    <p className="text-sm text-slate-500">This member currently has no active party posts.</p>
                  </div>
                  <button className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    Assign Post
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
