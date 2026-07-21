"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Users, Target, ShieldCheck, Zap, Heart, Monitor, UserPlus, FileText, Settings, BookOpen, Map, CheckCircle, Search, ChevronDown, Flag, ArrowDown, MapPin, Building, Activity, PhoneCall, PieChart, Star } from "lucide-react";
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
  startDate: string;
}

interface DistrictOption {
  name: string;
  state: string;
}

interface DistrictTeamViewProps {
  bearers: OfficeBearer[];
  contentData?: any; 
  currentState: string;
  currentDistrict: string;
  availableDistricts: DistrictOption[];
  stats: {
    talukas: number;
    villages: number;
    members: number;
    bearers: number;
    events: number;
    resolutionRate: number;
  };
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

export function DistrictTeamView({ bearers, contentData, currentState, currentDistrict, availableDistricts, stats }: DistrictTeamViewProps) {
  const locale = useLocale();
  const isGu = locale === "gu";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State & District Selector Logic
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  
  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  
  const stateRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStates = indianStates.filter(s => 
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Filter districts belonging to the selected state (from our db records) or fallback to hardcoded if we want
  // To prevent zero results, we allow searching through all passed availableDistricts if the current state doesn't have many mapped
  const stateSpecificDistricts = availableDistricts.filter(d => d.state.toLowerCase() === currentState.toLowerCase());
  const districtsToSearch = stateSpecificDistricts.length > 0 ? stateSpecificDistricts.map(d => d.name) : ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"];

  const filteredDistricts = districtsToSearch.filter(d => 
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handleStateSelect = (state: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("state", state);
    params.delete("district"); // Reset district when state changes
    router.push(`${pathname}?${params.toString()}` as any);
    setIsStateOpen(false);
    setStateSearch("");
  };

  const handleDistrictSelect = (district: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("district", district);
    router.push(`${pathname}?${params.toString()}` as any);
    setIsDistrictOpen(false);
    setDistrictSearch("");
  };

  // Fallback Content
  const content = contentData || {
    hero: {
      title: isGu ? "જિલ્લા ટીમ" : "District Team",
      subtitle: isGu 
        ? "મજબૂત જિલ્લા સંગઠન • મજબૂત જનઆધાર"
        : "Strong District Organization • Strong Public Foundation",
      cta: isGu ? "સભ્ય બનો" : "Join Membership"
    },
    intro: {
      text1: isGu 
        ? "જનસેવા, જવાબદારી અને લોકભાગીદારી દ્વારા મજબૂત જિલ્લા સંગઠનનું નિર્માણ."
        : "Building a strong district organization through public service, transparent leadership, and active grassroots participation.",
      quote: isGu
        ? "અમારું લક્ષ્ય જિલ્લાના દરેક નાગરિકના પ્રશ્નોને વાચા આપવી અને તેમને સમાન વિકાસની તકો પૂરી પાડવાનું છે."
        : "Our goal is to give a voice to the issues of every citizen in the district and provide them with equal development opportunities."
    },
    vision: {
      title: isGu ? "જિલ્લા વિઝન" : "District Vision",
      items: [
        { icon: <Map />, title: isGu ? "દરેક તાલુકામાં સક્રિય" : "Active in Every Taluka" },
        { icon: <Heart />, title: isGu ? "જનસેવા" : "Public Service" },
        { icon: <Zap />, title: isGu ? "સમાન તકો" : "Equal Opportunities" },
        { icon: <ShieldCheck />, title: isGu ? "પારદર્શિતા" : "Transparency" },
        { icon: <Star />, title: isGu ? "નેતૃત્વ વિકાસ" : "Leadership Development" },
        { icon: <Users />, title: isGu ? "યુવા પ્રતિનિધિત્વ" : "Youth Representation" },
        { icon: <CheckCircle />, title: isGu ? "મહિલા ભાગીદારી" : "Women Participation" },
        { icon: <Building />, title: isGu ? "જિલ્લા વિકાસ" : "District Development" }
      ]
    },
    objectives: {
      title: isGu ? "મુખ્ય ઉદ્દેશ્યો" : "Key Objectives",
      items: [
        { title: isGu ? "સંગઠન વિસ્તરણ" : "Organization Expansion" },
        { title: isGu ? "તાલુકા અને ગ્રામ માર્ગદર્શન" : "Taluka & Village Guidance" },
        { title: isGu ? "સભ્યપદ અભિયાન" : "Membership Campaigns" },
        { title: isGu ? "જન જાગૃતિ" : "Public Awareness" },
        { title: isGu ? "નેતૃત્વ તાલીમ" : "Leadership Training" },
        { title: isGu ? "સ્થાનિક પ્રશ્ન નિરાકરણ" : "Local Issue Resolution" },
        { title: isGu ? "રાજ્ય સંકલન" : "State Coordination" },
        { title: isGu ? "સંગઠનાત્મક વિકાસ" : "Organizational Development" }
      ]
    },
    responsibilities: {
      title: isGu ? "જવાબદારીઓ" : "Responsibilities",
      items: [
        { title: isGu ? "તાલુકા ટીમોને મજબૂત કરવી" : "Strengthen Taluka Teams", icon: <Building /> },
        { title: isGu ? "ગ્રામ સંગઠન વિસ્તરણ" : "Expand Village Organization", icon: <Map /> },
        { title: isGu ? "સભ્યપદ નોંધણી" : "Membership Enrollment", icon: <UserPlus /> },
        { title: isGu ? "સ્થાનિક પ્રશ્ન સંકલન" : "Local Issue Coordination", icon: <Target /> },
        { title: isGu ? "જન જાગૃતિ અભિયાન" : "Public Awareness Campaigns", icon: <Flag /> },
        { title: isGu ? "નેતૃત્વ તાલીમ" : "Leadership Training", icon: <BookOpen /> },
        { title: isGu ? "જાહેર કાર્યક્રમો" : "Public Programs", icon: <Users /> },
        { title: isGu ? "રાજ્ય સંકલન" : "State Coordination", icon: <Settings /> }
      ]
    },
    workflow: {
      title: isGu ? "તાલુકા અને ગ્રામ સંકલન" : "Taluka & Village Coordination",
      desc: isGu 
        ? "જિલ્લા ટીમ તાલુકા અને ગ્રામ્ય સ્તરની ટીમો સાથે સતત સંપર્કમાં રહીને પક્ષની વિચારધારાને જમીન સ્તર સુધી પહોંચાડે છે." 
        : "The District Team coordinates continuously with Taluka and Village organizations to carry the party's ideology to the grassroots."
    },
    principles: {
      title: isGu ? "કાર્ય સિદ્ધાંતો" : "Working Principles",
      items: [
        { title: isGu ? "જનસેવા પ્રથમ" : "Public Service First" },
        { title: isGu ? "પારદર્શિતા" : "Transparency" },
        { title: isGu ? "જવાબદારી" : "Accountability" },
        { title: isGu ? "શિસ્ત" : "Discipline" },
        { title: isGu ? "ટીમ વર્ક" : "Teamwork" },
        { title: isGu ? "સમયસર અમલ" : "Timely Execution" },
        { title: isGu ? "લોકશાહી નિર્ણય પ્રક્રિયા" : "Democratic Decision Making" },
        { title: isGu ? "બંધારણીય મૂલ્યો" : "Constitutional Values" }
      ]
    },
    digital: {
      title: isGu ? "ડિજિટલ સંચાલન" : "Digital Management",
      items: [
        { title: isGu ? "જિલ્લા સભ્ય ડેશબોર્ડ" : "District Member Dashboard", icon: <Monitor /> },
        { title: isGu ? "તાલુકા-વાર રિપોર્ટ્સ" : "Taluka-wise Reports", icon: <FileText /> },
        { title: isGu ? "ઓનલાઈન બેઠક પ્લેટફોર્મ" : "Online Meeting Platform", icon: <Users /> },
        { title: isGu ? "ડિજિટલ સભ્યપદ રેકોર્ડ્સ" : "Digital Membership Records", icon: <Target /> },
        { title: isGu ? "ઇવેન્ટ મેનેજમેન્ટ સિસ્ટમ" : "Event Management System", icon: <Zap /> },
        { title: isGu ? "તાલીમ પોર્ટલ" : "Training Portal", icon: <BookOpen /> },
        { title: isGu ? "ફરિયાદ અને સૂચન સિસ્ટમ" : "Complaint & Suggestion System", icon: <PhoneCall /> },
        { title: isGu ? "પ્રદર્શન એનાલિટિક્સ" : "Performance Analytics", icon: <Activity /> }
      ]
    },
    commitment: {
      title: isGu ? "અમારો સંકલ્પ" : "Commitment & Party Motto",
      slogan: isGu ? "મજબૂત જિલ્લા સંગઠન – મજબૂત તાલુકા – સમૃદ્ધ જિલ્લો" : "Strong District Organization – Strong Talukas – Prosperous District",
      desc: isGu ? "જિલ્લાથી જનસેવા, જનસેવાથી જનવિશ્વાસ અને જનવિશ્વાસથી મજબૂત સંગઠન." : "Public Service Builds Public Trust, and Public Trust Builds a Strong Organization.",
      btn1: isGu ? "સભ્યપદ મેળવો" : "Become a Member",
      btn2: isGu ? "જિલ્લા ટીમનો સંપર્ક કરો" : "Contact District Team"
    }
  };

  // Expected Leadership Structure (District Level)
  const hierarchyPositions = [
    { key: "District President", priority: 1, labelEn: "District President", labelGu: "જિલ્લા પ્રમુખ" },
    { key: "District Vice President", priority: 2, labelEn: "District Vice President", labelGu: "જિલ્લા ઉપપ્રમુખ" },
    { key: "District General Secretary", priority: 3, labelEn: "District General Secretary", labelGu: "જિલ્લા મહામંત્રી" },
    { key: "District Secretary", priority: 4, labelEn: "District Secretary", labelGu: "જિલ્લા મંત્રી" },
    { key: "District Treasurer", priority: 5, labelEn: "District Treasurer", labelGu: "જિલ્લા કોષાધ્યક્ષ" },
    { key: "District Media Coordinator", priority: 6, labelEn: "District Media Coordinator", labelGu: "જિલ્લા મીડિયા સંયોજક" },
    { key: "District Executive Committee", priority: 7, labelEn: "District Executive Committee", labelGu: "જિલ્લા કારોબારી સભ્ય" }
  ];

  const getBearerForPosition = (priority: number) => {
    return bearers.find(b => b.position.priority === priority);
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-900 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] mix-blend-overlay" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="text-sm font-medium mb-4 text-emerald-300 tracking-wider uppercase">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> &gt; 
            <Link href="/organization" className="hover:text-white transition-colors ml-2">Organization</Link> &gt; 
            <span className="ml-2 text-white">{content.hero.title}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">{content.hero.title}</h1>
          <h2 className="text-xl md:text-3xl font-semibold mb-8 text-amber-400">{content.hero.subtitle}</h2>
          <Link href="/membership" className="inline-block bg-white text-emerald-900 hover:bg-amber-400 hover:text-emerald-950 font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            {content.hero.cta}
          </Link>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed font-medium">
          {content.intro.text1}
        </p>
        <div className="bg-emerald-50 dark:bg-slate-900 p-8 rounded-3xl border-l-4 border-emerald-600 shadow-sm inline-block">
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
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
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

      {/* Dual Selector & 5. Leadership Hierarchy */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
           <div className="flex-1">
             <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
               {isGu ? `${currentDistrict} જિલ્લા ટીમ` : `${currentDistrict} District Team`}
             </h3>
             <p className="text-slate-500 dark:text-slate-400 font-medium">{currentState}, India</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
               {/* State Selector */}
               <div className="relative w-full sm:w-56 z-50" ref={stateRef}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">State</p>
                  <button 
                    onClick={() => setIsStateOpen(!isStateOpen)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg py-2.5 px-4 flex items-center justify-between font-semibold text-slate-800 dark:text-white"
                  >
                    <span className="truncate mr-2">{currentState}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isStateOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isStateOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[300px]">
                      <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder={isGu ? "રાજ્ય શોધો..." : "Search state..."}
                            value={stateSearch}
                            onChange={(e) => setStateSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-md outline-none text-sm focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto p-1">
                        {filteredStates.length > 0 ? filteredStates.map(state => (
                          <button 
                            key={state}
                            onClick={() => handleStateSelect(state)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-slate-700 ${currentState === state ? 'bg-emerald-100 dark:bg-slate-700 text-emerald-700 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {state}
                          </button>
                        )) : (
                          <div className="p-3 text-center text-slate-500 text-sm">Not found.</div>
                        )}
                      </div>
                    </div>
                  )}
               </div>

               {/* District Selector */}
               <div className="relative w-full sm:w-56 z-40" ref={districtRef}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">District</p>
                  <button 
                    onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg py-2.5 px-4 flex items-center justify-between font-semibold text-slate-800 dark:text-white"
                  >
                    <span className="truncate mr-2">{currentDistrict}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDistrictOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[300px]">
                      <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder={isGu ? "જિલ્લો શોધો..." : "Search district..."}
                            value={districtSearch}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-md outline-none text-sm focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto p-1">
                        {filteredDistricts.length > 0 ? filteredDistricts.map(dist => (
                          <button 
                            key={dist}
                            onClick={() => handleDistrictSelect(dist)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-slate-700 ${currentDistrict === dist ? 'bg-emerald-100 dark:bg-slate-700 text-emerald-700 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {dist}
                          </button>
                        )) : (
                          <div className="p-3 text-center text-slate-500 text-sm">Not found.</div>
                        )}
                      </div>
                    </div>
                  )}
               </div>
           </div>
        </div>
        
        {/* Leadership Hierarchy Diagram */}
        <div className="relative mb-24">
          <div className="absolute left-1/2 -ml-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 via-emerald-500 to-emerald-200 hidden md:block"></div>
          
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
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-emerald-500 shadow-lg mb-4 md:mb-0">
                    <span className="text-emerald-600 font-bold">{pos.priority}</span>
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
                  <div className="w-full md:absolute md:w-[45%] bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/50 hover:shadow-2xl z-20"
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
                          <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                            {isGu ? bearer.position.nameGu : bearer.position.nameEn}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                            <MapPin className="w-3 h-3" /> Appointed: {new Date(bearer.startDate).toLocaleDateString()}
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

      {/* 11. District Statistics */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10 text-emerald-400">{isGu ? "જિલ્લાના આંકડા" : "District Statistics"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="text-4xl font-extrabold text-white mb-2">{stats.talukas}</div>
              <p className="text-slate-400 font-medium">{isGu ? "કુલ તાલુકા" : "Total Talukas"}</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="text-4xl font-extrabold text-white mb-2">{stats.villages}</div>
              <p className="text-slate-400 font-medium">{isGu ? "કુલ ગામ" : "Total Villages"}</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="text-4xl font-extrabold text-white mb-2">{stats.members.toLocaleString()}</div>
              <p className="text-slate-400 font-medium">{isGu ? "કુલ સભ્યો" : "Total Members"}</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="text-4xl font-extrabold text-emerald-400 mb-2">{stats.resolutionRate}%</div>
              <p className="text-slate-400 font-medium">{isGu ? "પ્રશ્ન નિરાકરણ" : "Resolution Rate"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Responsibilities */}
      <section className="bg-emerald-50/50 dark:bg-slate-900/50 py-16 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.responsibilities.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.responsibilities.items.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-700">
                <div className="text-emerald-600 mb-4 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Taluka & Village Coordination Workflow */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
         <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{content.workflow.title}</h3>
         <p className="text-slate-600 dark:text-slate-400 mb-10">{content.workflow.desc}</p>
         
         <div className="flex flex-col items-center max-w-sm mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">State Team</div>
            <ArrowDown className="w-6 h-6 my-2 text-emerald-500" />
            <div className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold shadow-md transform scale-105">District Team</div>
            <ArrowDown className="w-6 h-6 my-2 text-emerald-500" />
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Taluka Team</div>
            <ArrowDown className="w-6 h-6 my-2 text-slate-400" />
            <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Village Team</div>
         </div>
      </section>

      {/* 9. Working Principles */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">{content.principles.title}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {content.principles.items.map((item: any, i: number) => (
              <div key={i} className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Digital Management */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.digital.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.digital.items.map((item: any, i: number) => (
            <div key={i} className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all text-center">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors mx-auto mb-4">
                {item.icon}
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Commitment */}
      <section className="max-w-4xl mx-auto px-6 text-center py-12">
        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">{content.commitment.title}</h3>
        <div className="bg-emerald-50 dark:bg-slate-900/80 p-8 rounded-3xl border-l-4 border-emerald-500 mb-8 inline-block shadow-sm">
           <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">"{content.commitment.desc}"</p>
        </div>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-10 tracking-wide uppercase">{content.commitment.slogan}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/membership" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
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
