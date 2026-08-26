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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DigitalCardClient from "@/app/[locale]/dashboard/card/DigitalCardClient";
import CertificateClient from "@/app/[locale]/dashboard/certificate/CertificateClient";
import { formatMemberId } from "@/lib/utils";
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

  const assignment = profile.officeBearers?.find((a: any) => a.status === "ACTIVE");
  const stateDistrict = assignment 
    ? `${assignment.unit.nameEn}` 
    : profile.state 
      ? `${profile.state || ''} / ${profile.district || ''}`
      : "India";

  const cardData = {
    name: profile.user.name,
    fatherName: profile.fatherName || "",
    dob: profile.dob ? new Date(profile.dob).toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric"
    }) : "",
    mobile: profile.mobile || "",
    address: profile.fullAddress ? `${profile.fullAddress}, ${profile.pincode}` : "",
    memberId: formatMemberId(profile.memberId),
    photoUrl: profile.user.image || profile.profilePic || "",
    issueDate: profile.issueDate ? new Date(profile.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    }) : "N/A",
    location: stateDistrict,
    membershipType: profile.membershipType.replace("_", " ") + " Member"
  };

  const certData = {
    name: profile.user.name,
    memberId: formatMemberId(profile.memberId),
    membershipType: profile.membershipType.replace("_", " "),
    issueDate: profile.issueDate ? new Date(profile.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    }) : "N/A"
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

      {/* Main Layout Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="idcard">ID Card</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
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
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Aadhaar</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.aadhaar || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Voter ID</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.voterId || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Occupation</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.occupation || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Address</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.fullAddress || "N/A"}, {profile.pincode || ""}</p>
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

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" /> Referral History
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Referred By</p>
                {profile.referralHistory && profile.referralHistory.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-500 text-xs">
                      {profile.referralHistory[0].referrer.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {profile.referralHistory[0].referrer.user.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {profile.referralHistory[0].referrer.memberId}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No referrer (Direct join)</p>
                )}
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Members Referred ({profile.referralsMade?.length || 0})
                </p>
                {profile.referralsMade && profile.referralsMade.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Member</th>
                          <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                          <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Tier</th>
                          <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {profile.referralsMade.map((ref: any) => (
                          <tr key={ref.id} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {ref.referredMember.user.name}
                              </p>
                              <p className="text-xs text-slate-500 font-mono">
                                {formatMemberId(ref.referredMember.memberId)}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                              {new Date(ref.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric"
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase shadow-sm">
                                {ref.referredMember.membershipType?.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                ref.referredMember.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                  : ref.referredMember.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {ref.referredMember.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">This member has not referred anyone yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
        </TabsContent>
        <TabsContent value="idcard">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex justify-center overflow-x-auto">
            <DigitalCardClient data={cardData} />
          </div>
        </TabsContent>
        <TabsContent value="certificate">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex justify-center overflow-x-auto">
            <CertificateClient data={certData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
