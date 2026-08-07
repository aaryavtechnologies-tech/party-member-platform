"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { 
  Users, Target, ShieldCheck, Zap, Heart, Monitor, UserPlus, 
  FileText, Settings, BookOpen, Map, CheckCircle, Search, 
  ChevronDown, Flag, ArrowDown, MapPin, Building, Activity, 
  PhoneCall, Star, Briefcase, Award, ArrowRight, Home
} from "lucide-react";
import Image from "next/image";

interface OfficeBearer {
  id: string;
  member: {
    user: { name: string; image: string | null; };
    state: string; district: string; taluka: string; village: string;
  };
  position: { nameEn: string; nameGu: string; priority: number; };
  startDate: string;
}

interface UnitOption { name: string; parentName: string; }

interface VillageTeamViewProps {
  bearers: OfficeBearer[];
  currentState: string;
  currentDistrict: string;
  currentTaluka: string;
  currentVillage: string;
  availableDistricts: UnitOption[];
  availableTalukas: UnitOption[];
  availableVillages: UnitOption[];
  stats: { households: number; members: number; activeMembers: number; };
}

const indianStates = [
  "Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Bihar", "Karnataka", "Tamil Nadu" // Abridged for demo
];

export function VillageTeamView({ 
  bearers, currentState, currentDistrict, currentTaluka, currentVillage,
  availableDistricts, availableTalukas, availableVillages, stats 
}: VillageTeamViewProps) {
  const locale = useLocale();
  const isGu = locale === "gu";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Selectors State
  const [openSelector, setOpenSelector] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleSelect = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    if (type === "state") { params.delete("district"); params.delete("taluka"); params.delete("village"); }
    if (type === "district") { params.delete("taluka"); params.delete("village"); }
    if (type === "taluka") { params.delete("village"); }
    router.push(`${pathname}?${params.toString()}` as any);
    setOpenSelector(null);
    setSearch("");
  };

  // Filter logic for dropdowns
  const districtsForState = availableDistricts.filter(d => d.parentName.toLowerCase() === currentState.toLowerCase());
  const displayDistricts = districtsForState.length > 0 ? districtsForState.map(d => d.name) : ["Ahmedabad", "Surat", "Rajkot"];
  
  const talukasForDistrict = availableTalukas.filter(t => t.parentName.toLowerCase() === currentDistrict.toLowerCase());
  const displayTalukas = talukasForDistrict.length > 0 ? talukasForDistrict.map(t => t.name) : ["City Taluka", "Rural Taluka"];

  const villagesForTaluka = availableVillages.filter(v => v.parentName.toLowerCase() === currentTaluka.toLowerCase());
  const displayVillages = villagesForTaluka.length > 0 ? villagesForTaluka.map(v => v.name) : ["Village A", "Village B"];

  const getFilteredList = (type: string) => {
    const list = type === "state" ? indianStates : type === "district" ? displayDistricts : type === "taluka" ? displayTalukas : displayVillages;
    return list.filter(item => item.toLowerCase().includes(search.toLowerCase()));
  };

  // Sticky Sidebar Active State logic
  const [activeSection, setActiveSection] = useState("intro");
  const sectionIds = ["intro", "vision", "objectives", "structure", "digital", "commitment"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "intro", label: isGu ? "પ્રસ્તાવના" : "Introduction" },
    { id: "vision", label: isGu ? "વિઝન" : "Vision" },
    { id: "objectives", label: isGu ? "ઉદ્દેશ્યો" : "Objectives" },
    { id: "structure", label: isGu ? "માળખું" : "Structure" },
    { id: "digital", label: isGu ? "ડિજિટલ સંચાલન" : "Digital Management" },
    { id: "commitment", label: isGu ? "સંકલ્પ" : "Commitment" },
  ];

  return (
    <div className="bg-emerald-50/50 dark:bg-slate-950 min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="text-sm font-semibold mb-6 text-emerald-300 tracking-wider uppercase flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> &gt; 
            <Link href="/organization" className="hover:text-white transition-colors">Organization</Link> &gt; 
            <span className="text-white">{isGu ? "ગ્રામ ટીમ" : "Village Team"}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-xl tracking-tight text-white">
            {isGu ? "ગ્રામ ટીમ" : "Village Team"}
          </h1>
          <h2 className="text-xl md:text-3xl font-medium mb-10 text-emerald-400 max-w-3xl mx-auto leading-snug">
            {isGu ? "મજબૂત ગ્રામ સંગઠન – સમૃદ્ધ ખેડૂત" : "Strong Village Organization – Prosperous Farmer"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership" className="bg-white text-emerald-950 hover:bg-emerald-400 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl">
              {isGu ? "સભ્ય બનો" : "Become Member"}
            </Link>
            <button onClick={() => scrollTo('structure')} className="bg-emerald-800/50 backdrop-blur text-white border border-emerald-400/30 hover:bg-emerald-700/50 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:-translate-y-1">
              {isGu ? "સંગઠન માળખું જુઓ" : "Organization Structure"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-12 items-start relative">
        
        {/* Sticky Sidebar Navigation */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-28 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 z-20">
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm border-b pb-4 dark:border-slate-800">
            {isGu ? "ઝડપી લિંક્સ" : "Quick Links"}
          </h4>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between group ${
                  activeSection === link.id 
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.id && <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full space-y-24">
          
          {/* Section 1: Introduction */}
          <section id="intro" className="scroll-mt-28">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {isGu ? "પ્રસ્તાવના" : "Introduction"}
              </h3>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isGu 
                ? "ગ્રામ ટીમ એ રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટીનું પાયાનું એકમ છે. ગામના દરેક ખેડૂત અને નાગરિક સુધી પહોંચવા, તેમના પ્રશ્નો સાંભળવા અને સરકારી યોજનાઓના લાભ અપાવવા માટે ગ્રામ ટીમ સક્રિય છે."
                : "The Village Team is the grassroots unit of Rashtriya Annadata Vikas Party. It is actively working to reach every farmer and citizen in the village, listen to their issues, and help them avail the benefits of government schemes."
              }
            </p>
          </section>

          {/* Section 2: Vision */}
          <section id="vision" className="scroll-mt-28">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b pb-4 dark:border-slate-800">
              {isGu ? "વિઝન" : "Vision"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { i: <Home />, t: isGu ? "આદર્શ ગામ" : "Model Village" },
                { i: <Zap />, t: isGu ? "ઝડપી ન્યાય" : "Quick Justice" },
                { i: <ShieldCheck />, t: isGu ? "સામાજિક સુરક્ષા" : "Social Security" },
                { i: <Target />, t: isGu ? "ખેડૂત કલ્યાણ" : "Farmer Welfare" },
                { i: <Users />, t: isGu ? "ગ્રામ સભા" : "Village Assembly" },
                { i: <Heart />, t: isGu ? "ભાઈચારો" : "Brotherhood" },
              ].map((v, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-500 transition-colors group">
                  <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">{v.i}</div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{v.t}</h4>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Objectives */}
          <section id="objectives" className="scroll-mt-28">
             <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b pb-4 dark:border-slate-800">
              {isGu ? "ઉદ્દેશ્યો" : "Objectives"}
            </h3>
            <div className="space-y-6 border-l-4 border-emerald-100 dark:border-slate-800 ml-4 pl-6 relative">
              {[
                { t: isGu ? "ગ્રામ સંપર્ક" : "Village Outreach", d: isGu ? "ગામના દરેક પરિવાર સાથે સંપર્ક બનાવવો." : "Establish contact with every family in the village." },
                { t: isGu ? "યોજના માહિતી" : "Scheme Information", d: isGu ? "સરકારી યોજનાઓ વિશે માહિતગાર કરવા." : "Inform about government schemes." },
                { t: isGu ? "સમસ્યા નિવારણ" : "Problem Solving", d: isGu ? "ખેતી અને સિંચાઈ સંબંધિત પ્રશ્નો ઉકેલવા." : "Solve issues related to farming and irrigation." }
              ].map((obj, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[37px] top-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-md">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{obj.t}</h4>
                  <p className="text-slate-600 dark:text-slate-400">{obj.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Triple Selector & Section 4: Structure */}
          <section id="structure" className="scroll-mt-28 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b pb-8 dark:border-slate-800">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {isGu ? `${currentVillage} ગ્રામ ટીમ` : `${currentVillage} Village Team`}
                </h3>
                <p className="text-slate-500 font-medium flex items-center gap-2"><MapPin className="w-4 h-4"/> {currentState} &gt; {currentDistrict} &gt; {currentTaluka}</p>
              </div>

              {/* Advanced Quadruple Dropdowns */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {['state', 'district', 'taluka', 'village'].map((type) => {
                  const currentValue = type === 'state' ? currentState : type === 'district' ? currentDistrict : type === 'taluka' ? currentTaluka : currentVillage;
                  const label = type.toUpperCase();
                  
                  return (
                    <div key={type} className="relative flex-1 min-w-[120px]">
                      <button 
                        onClick={() => setOpenSelector(openSelector === type ? null : type)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors"
                      >
                        <span className="truncate">{currentValue}</span>
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>
                      
                      {openSelector === type && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg z-50 overflow-hidden">
                          <div className="p-2 border-b dark:border-slate-700">
                            <input 
                              type="text" placeholder={`Search ${label}...`}
                              value={search} onChange={(e) => setSearch(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded text-sm outline-none"
                            />
                          </div>
                          <div className="max-h-60 overflow-y-auto p-1">
                            {getFilteredList(type).map(item => (
                              <button 
                                key={item} onClick={() => handleSelect(type, item)}
                                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hierarchical Tree Cards */}
            <div className="space-y-6">
              {[
                { priority: 1, labelEn: "Village President", labelGu: "ગ્રામ પ્રમુખ" },
                { priority: 2, labelEn: "Vice President", labelGu: "ઉપપ્રમુખ" },
                { priority: 3, labelEn: "General Secretary", labelGu: "મહામંત્રી" },
                { priority: 4, labelEn: "Secretary", labelGu: "મંત્રી" },
                { priority: 5, labelEn: "Treasurer", labelGu: "કોષાધ્યક્ષ" },
                { priority: 6, labelEn: "Media Coordinator", labelGu: "મીડિયા સંયોજક" }
              ].map((pos) => {
                const bearer = bearers.find(b => b.position.priority === pos.priority);
                const title = isGu ? pos.labelGu : pos.labelEn;
                
                return (
                  <div key={pos.priority} className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-inner flex items-center justify-center shrink-0 border-2 border-emerald-100 dark:border-slate-700">
                      {bearer?.member.user.image ? (
                        <Image src={bearer.member.user.image} alt="Profile" width={64} height={64} className="rounded-full object-cover w-full h-full" />
                      ) : (
                        <Users className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{bearer ? bearer.member.user.name : (isGu ? "ખાલી પદ" : "Vacant")}</h4>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider">{title}</p>
                    </div>
                    {bearer && (
                       <div className="text-xs font-medium bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm text-slate-500">
                         {new Date(bearer.startDate).toLocaleDateString()}
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 8: Digital Management */}
          <section id="digital" className="scroll-mt-28 bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
             <h3 className="text-3xl font-bold mb-10 relative z-10">{isGu ? "ડિજિટલ સંચાલન" : "Digital Management"}</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
               {[
                 { i: <Monitor />, t: "Village Dashboard" },
                 { i: <FileText />, t: "Public Issues" },
                 { i: <Users />, t: "Member Meetings" },
                 { i: <Target />, t: "Digital Campaigns" },
               ].map((item, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors text-center backdrop-blur-sm">
                   <div className="text-emerald-400 mb-4 flex justify-center">{item.i}</div>
                   <h5 className="font-semibold text-sm">{item.t}</h5>
                 </div>
               ))}
             </div>
          </section>

          {/* Section 12: Motto */}
          <section id="commitment" className="scroll-mt-28">
            <div className="bg-emerald-600 text-white p-12 rounded-3xl text-center shadow-xl">
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                {isGu ? "મજબૂત ગ્રામ સંગઠન, સમૃદ્ધ ખેડૂત" : "Strong Village Organization, Prosperous Farmer"}
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Link href="/membership" className="bg-white text-emerald-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-slate-100 transition-colors">
                  {isGu ? "સભ્યપદ મેળવો" : "Become a Member"}
                </Link>
                <Link href="/contact" className="bg-emerald-800 border border-emerald-400 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
                  {isGu ? "સંપર્ક કરો" : "Contact Village Team"}
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
