"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Users, Target, ShieldCheck, Zap, Heart, Monitor, UserPlus, FileText, Settings, BookOpen, Map, CheckCircle, Search, ChevronDown, Flag, ArrowDown } from "lucide-react";
import Image from "next/image";

interface OfficeBearer {
  id: string;
  member: {
    user: {
      name: string;
      image: string | null;
    };
    state: string;
    district: string;
  };
  position: {
    nameEn: string;
    nameGu: string;
    priority: number;
  };
}

interface StateTeamViewProps {
  bearers: OfficeBearer[];
  contentData?: any; 
  currentState: string;
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

export function StateTeamView({ bearers, contentData, currentState }: StateTeamViewProps) {
  const locale = useLocale();
  const isGu = locale === "gu";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State Selector Logic
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStates = indianStates.filter(state => 
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateSelect = (state: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("state", state);
    router.push(`${pathname}?${params.toString()}` as any);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  // Fallback Content
  const content = contentData || {
    hero: {
      title: isGu ? "રાજ્ય ટીમ" : "State Team",
      subtitle: isGu 
        ? "મજબૂત રાજ્ય સંગઠન • મજબૂત જનસંપર્ક"
        : "Strong State Organization • Strong Public Connection",
      cta: isGu ? "સભ્ય બનો" : "Join Membership"
    },
    intro: {
      text1: isGu 
        ? "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટીની રાજ્ય ટીમ રાજ્યના દરેક જિલ્લામાં સંગઠનને મજબૂત બનાવતી જવાબદાર, પારદર્શક અને જનસેવાને સમર્પિત ટીમ છે."
        : "The State Team of Rashtriya Annadata Vikas Party leads the party across every district through responsible leadership, transparent governance, and effective coordination.",
      quote: isGu
        ? "અમારું લક્ષ્ય રાજ્યના દરેક નાગરિકના હિતોનું રક્ષણ કરવું અને તેમને સમાન વિકાસની તકો પૂરી પાડવાનું છે."
        : "Our goal is to protect the interests of every citizen of the state and provide them with equal opportunities for development."
    },
    vision: {
      title: isGu ? "રાજ્ય ટીમ વિઝન" : "State Team Vision",
      items: [
        { icon: <Map />, title: isGu ? "જિલ્લાઓમાં સક્રિય" : "Active in Every District" },
        { icon: <Heart />, title: isGu ? "જનસેવા" : "Public Service" },
        { icon: <ShieldCheck />, title: isGu ? "પારદર્શિતા" : "Transparency" },
        { icon: <Zap />, title: isGu ? "સમાન તકો" : "Equal Opportunities" },
        { icon: <Users />, title: isGu ? "યુવા નેતૃત્વ" : "Youth Leadership" },
        { icon: <CheckCircle />, title: isGu ? "મહિલા નેતૃત્વ" : "Women Leadership" },
        { icon: <Target />, title: isGu ? "ખેડૂત પ્રતિનિધિત્વ" : "Farmer Representation" },
        { icon: <Monitor />, title: isGu ? "નાગરિક જોડાણ" : "Citizen Engagement" }
      ]
    },
    objectives: {
      title: isGu ? "ઉદ્દેશ્યો" : "Objectives",
      items: [
        { title: isGu ? "રાજ્ય સંગઠન વિસ્તરણ" : "State Organization Expansion" },
        { title: isGu ? "જિલ્લા માર્ગદર્શન" : "District Guidance" },
        { title: isGu ? "સભ્યપદ અભિયાન" : "Membership Campaigns" },
        { title: isGu ? "નેતૃત્વ વિકાસ" : "Leadership Development" },
        { title: isGu ? "જનસંપર્ક" : "Public Relations" },
        { title: isGu ? "નીતિ જાગૃતિ" : "Policy Awareness" },
        { title: isGu ? "રાષ્ટ્રીય સંકલન" : "National Coordination" },
        { title: isGu ? "સંગઠનાત્મક વૃદ્ધિ" : "Organizational Growth" }
      ]
    },
    responsibilities: {
      title: isGu ? "જવાબદારીઓ" : "Responsibilities",
      items: [
        { title: isGu ? "રાજ્ય નેતૃત્વ" : "State Leadership", icon: <Flag /> },
        { title: isGu ? "જિલ્લા સંકલન" : "District Coordination", icon: <Map /> },
        { title: isGu ? "સભ્યપદ વૃદ્ધિ" : "Membership Growth", icon: <UserPlus /> },
        { title: isGu ? "જનસંપર્ક" : "Public Outreach", icon: <Target /> },
        { title: isGu ? "તાલીમ કાર્યક્રમો" : "Training Programs", icon: <BookOpen /> },
        { title: isGu ? "નીતિ પ્રસાર" : "Policy Promotion", icon: <FileText /> },
        { title: isGu ? "સંગઠન વિકાસ" : "Organization Development", icon: <Users /> },
        { title: isGu ? "રાષ્ટ્રીય અહેવાલ" : "National Reporting", icon: <Settings /> }
      ]
    },
    workflow: {
      title: isGu ? "જિલ્લા સંકલન મોડલ" : "District Coordination Workflow",
      desc: isGu 
        ? "રાજ્ય ટીમ રાષ્ટ્રીય સ્તરની નીતિઓને જિલ્લા, તાલુકા અને ગ્રામ્ય સ્તર સુધી પહોંચાડવા માટે મહત્વની ભૂમિકા ભજવે છે." 
        : "The State Team plays a vital role in executing national policies down to the district, taluka, and village levels."
    },
    digital: {
      title: isGu ? "ડિજિટલ રાજ્ય સંચાલન" : "Digital State Management",
      items: [
        { title: isGu ? "સ્ટેટ ડેશબોર્ડ" : "State Dashboard" },
        { title: isGu ? "જિલ્લા પ્રદર્શન અહેવાલ" : "District Performance Reports" },
        { title: isGu ? "ડિજિટલ સભ્ય ડેટાબેઝ" : "Digital Member Database" },
        { title: isGu ? "ઓનલાઈન બેઠકો" : "Online Meetings" },
        { title: isGu ? "ઇવેન્ટ મેનેજમેન્ટ" : "Event Management" },
        { title: isGu ? "તાલીમ પોર્ટલ" : "Training Portal" },
        { title: isGu ? "આંતરિક સંચાર" : "Internal Communication" },
        { title: isGu ? "એનાલિટિક્સ અને રિપોર્ટ્સ" : "Analytics & Reports" }
      ]
    },
    commitment: {
      title: isGu ? "અમારો સંકલ્પ" : "Our Commitment",
      slogan: isGu ? "મજબૂત સંગઠન – મજબૂત લોકશાહી – મજબૂત ભારત" : "Strong Organization • Strong Democracy • Strong India",
      desc: isGu ? "અમે રાજ્યના સર્વાંગી વિકાસ માટે કટિબદ્ધ છીએ." : "We are committed to the holistic development of the state.",
      btn1: isGu ? "સભ્યપદ મેળવો" : "Become a Member",
      btn2: isGu ? "રાજ્ય ટીમનો સંપર્ક કરો" : "Contact State Team"
    }
  };

  // Expected Leadership Structure (State Level)
  const hierarchyPositions = [
    { key: "State President", priority: 1, labelEn: "State President", labelGu: "પ્રદેશ અધ્યક્ષ" },
    { key: "Vice President", priority: 2, labelEn: "Vice President", labelGu: "પ્રદેશ ઉપાધ્યક્ષ" },
    { key: "General Secretary", priority: 3, labelEn: "General Secretary", labelGu: "પ્રદેશ મહામંત્રી" },
    { key: "Secretary", priority: 4, labelEn: "Secretary", labelGu: "પ્રદેશ સચિવ" },
    { key: "Treasurer", priority: 5, labelEn: "Treasurer", labelGu: "પ્રદેશ કોષાધ્યક્ષ" },
    { key: "Media Coordinator", priority: 6, labelEn: "Media Coordinator", labelGu: "પ્રદેશ મીડિયા સંયોજક" },
    { key: "State Executive Committee", priority: 7, labelEn: "State Executive Committee", labelGu: "પ્રદેશ કાર્યકારિણી સભ્ય" }
  ];

  const getBearerForPosition = (priority: number) => {
    return bearers.find(b => b.position.priority === priority);
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="text-sm font-medium mb-4 text-primary-200 tracking-wider uppercase">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> &gt; 
            <Link href="/organization" className="hover:text-white transition-colors ml-2">Organization</Link> &gt; 
            <span className="ml-2 text-white">{content.hero.title}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">{content.hero.title}</h1>
          <h2 className="text-xl md:text-3xl font-semibold mb-8 text-amber-400">{content.hero.subtitle}</h2>
          <Link href="/membership" className="inline-block bg-white text-slate-900 hover:bg-amber-400 hover:text-slate-900 font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            {content.hero.cta}
          </Link>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed font-medium">
          {content.intro.text1}
        </p>
        <div className="bg-blue-50 dark:bg-slate-900 p-8 rounded-3xl border-l-4 border-blue-600 shadow-sm inline-block">
          <p className="text-xl font-bold text-slate-900 dark:text-white italic">
            "{content.intro.quote}"
          </p>
        </div>
      </section>

      {/* 3. Vision Section */}
      <section className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.vision.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.vision.items.map((item: any, i: number) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Objectives */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.objectives.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.objectives.items.map((item: any, i: number) => (
              <div key={i} className="bg-white dark:bg-slate-800 px-6 py-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 text-center">
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State Selector & Leadership Cards */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
           <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
             {isGu ? `${currentState} પ્રદેશ નેતૃત્વ` : `${currentState} State Leadership`}
           </h3>
           
           {/* Interactive State Selector */}
           <div className="relative w-full md:w-72 z-50" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg py-3 px-4 flex items-center justify-between font-semibold text-slate-800 dark:text-white"
              >
                <span>{currentState || "Select State"}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[400px]">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder={isGu ? "રાજ્ય શોધો..." : "Search state..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto p-2">
                    {filteredStates.length > 0 ? filteredStates.map(state => (
                      <button 
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-slate-700 ${currentState === state ? 'bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        {state}
                      </button>
                    )) : (
                      <div className="p-4 text-center text-slate-500 text-sm">No state found.</div>
                    )}
                  </div>
                </div>
              )}
           </div>
        </div>
        
        {/* Leadership Hierarchy Diagram */}
        <div className="relative mb-24">
          <div className="absolute left-1/2 -ml-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-500 to-blue-200 hidden md:block"></div>
          
          <div className="space-y-12">
            {hierarchyPositions.map((pos, index) => {
              const bearer = getBearerForPosition(pos.priority);
              const positionLabel = isGu ? pos.labelGu : pos.labelEn;
              const isEven = index % 2 === 0;
              
              return (
                <div key={pos.key} className="relative flex flex-col md:flex-row items-center justify-between w-full group">
                  
                  {/* Left Side (Empty for Odd) */}
                  <div className={`w-full md:w-5/12 hidden md:block ${!isEven ? 'opacity-0' : ''}`}>
                    {isEven && (
                      <div className="flex justify-end pr-8">
                        <div className="text-right">
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">{positionLabel}</h4>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Center Node */}
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-blue-500 shadow-lg mb-4 md:mb-0">
                    <span className="text-blue-600 font-bold">{pos.priority}</span>
                  </div>

                  {/* Right Side (Empty for Even) */}
                  <div className={`w-full md:w-5/12 hidden md:block ${isEven ? 'opacity-0' : ''}`}>
                    {!isEven && (
                      <div className="flex justify-start pl-8">
                        <div className="text-left">
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">{positionLabel}</h4>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Leader Card */}
                  <div className="w-full md:absolute md:w-[45%] bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/50 hover:shadow-2xl z-20"
                       style={{ [isEven ? 'right' : 'left']: '0' }}>
                    
                    <div className="md:hidden text-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                       <h4 className="text-lg font-bold text-slate-900 dark:text-white">{positionLabel}</h4>
                    </div>

                    {bearer ? (
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-inner border-2 border-slate-100 dark:border-slate-700">
                          {bearer.member.user.image ? (
                            <Image src={bearer.member.user.image} alt={bearer.member.user.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Users className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-slate-900 dark:text-white">{bearer.member.user.name}</h5>
                          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">
                            {isGu ? bearer.position.nameGu : bearer.position.nameEn}
                          </p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <Target className="w-3 h-3" /> {bearer.member.state}, {bearer.member.district}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-slate-500 flex flex-col items-center">
                        <Users className="w-10 h-10 mb-2 opacity-30" />
                        <p className="font-semibold">{isGu ? "પદ હાલમાં ખાલી છે" : "Position Currently Vacant"}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Responsibilities */}
      <section className="bg-blue-50/50 dark:bg-slate-900/50 py-16 px-6 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.responsibilities.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.responsibilities.items.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-700">
                <div className="text-blue-600 mb-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. District Coordination Workflow */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
         <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{content.workflow.title}</h3>
         <p className="text-slate-600 dark:text-slate-400 mb-10">{content.workflow.desc}</p>
         
         <div className="flex flex-col items-center max-w-sm mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">National Team</div>
            <ArrowDown className="w-6 h-6 my-2 text-blue-500" />
            <div className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md transform scale-105">State Team</div>
            <ArrowDown className="w-6 h-6 my-2 text-blue-500" />
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">District Teams</div>
            <ArrowDown className="w-6 h-6 my-2 text-slate-400" />
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Taluka Teams</div>
            <ArrowDown className="w-6 h-6 my-2 text-slate-400" />
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Village Teams</div>
         </div>
      </section>

      {/* 9. Digital State Management */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <Monitor className="w-16 h-16 text-blue-400 mb-6 mx-auto md:mx-0" />
              <h3 className="text-3xl font-bold mb-4">{content.digital.title}</h3>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.digital.items.map((item: any, i: number) => (
                <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Commitment */}
      <section className="max-w-4xl mx-auto px-6 text-center py-12">
        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">{content.commitment.title}</h3>
        <p className="text-2xl font-semibold text-blue-600 mb-6">"{content.commitment.slogan}"</p>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">{content.commitment.desc}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/membership" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors">
            {content.commitment.btn1}
          </Link>
          <Link href="/contact" className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full shadow-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors">
            {content.commitment.btn2}
          </Link>
        </div>
      </section>

    </div>
  );
}
