"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Users, Target, ShieldCheck, Zap, Heart, Monitor, UserPlus, FileText, Settings, BookOpen, Flag, CheckCircle, Smartphone } from "lucide-react";
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

interface NationalTeamViewProps {
  bearers: OfficeBearer[];
  contentData?: any; // For future CMS integration
}

export function NationalTeamView({ bearers, contentData }: NationalTeamViewProps) {
  const locale = useLocale();
  const isGu = locale === "gu";

  // Fallback Content
  const content = contentData || {
    hero: {
      title: isGu ? "રાષ્ટ્રીય ટીમ" : "National Team",
      subtitle: isGu 
        ? "મજબૂત રાષ્ટ્રીય નેતૃત્વ • મજબૂત સંગઠન • સમૃદ્ધ ભારત"
        : "Strong National Leadership • Strong Organization • Prosperous India",
      cta: isGu ? "સભ્ય બનો" : "Join Membership"
    },
    intro: {
      text1: isGu 
        ? "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટીની રાષ્ટ્રીય ટીમ દેશના સર્વાંગી વિકાસ, ખેડૂતોના હિતોનું રક્ષણ અને સામાજિક ન્યાય માટે સમર્પિત છે."
        : "The National Team of Rashtriya Annadata Vikas Party is dedicated to the holistic development of the country, protecting farmers' interests, and social justice.",
      quote: isGu
        ? "અમારું લક્ષ્ય એક મજબૂત અને પારદર્શક સંગઠન ઊભું કરવાનું છે જે દેશના દરેક નાગરિકના અવાજને રાષ્ટ્રીય સ્તર સુધી પહોંચાડે."
        : "Our goal is to build a strong and transparent organization that brings the voice of every citizen of the country to the national level."
    },
    vision: {
      title: isGu ? "રાષ્ટ્રીય ટીમ વિઝન" : "National Team Vision",
      items: [
        { icon: <Flag />, title: isGu ? "દેશવ્યાપી સંકલન" : "Nationwide Coordination" },
        { icon: <Heart />, title: isGu ? "જનસેવા" : "Public Service" },
        { icon: <ShieldCheck />, title: isGu ? "પારદર્શિતા" : "Transparency" },
        { icon: <Zap />, title: isGu ? "નેતૃત્વ" : "Leadership" },
        { icon: <Users />, title: isGu ? "યુવા ભાગીદારી" : "Youth Participation" },
        { icon: <CheckCircle />, title: isGu ? "મહિલા નેતૃત્વ" : "Women Leadership" },
        { icon: <Target />, title: isGu ? "ખેડૂત પ્રતિનિધિત્વ" : "Farmer Representation" },
        { icon: <Monitor />, title: isGu ? "ટેક્નોલોજી" : "Technology" }
      ]
    },
    objectives: {
      title: isGu ? "ઉદ્દેશ્યો" : "Objectives",
      items: [
        { title: isGu ? "રાષ્ટ્રીય નીતિ" : "National Policy" },
        { title: isGu ? "સંગઠન વિસ્તરણ" : "Organization Expansion" },
        { title: isGu ? "સભ્યપદ અભિયાન" : "Membership Campaign" },
        { title: isGu ? "નેતૃત્વ વિકાસ" : "Leadership Development" },
        { title: isGu ? "રાજ્ય સંકલન" : "State Coordination" },
        { title: isGu ? "જનતાનું પ્રતિનિધિત્વ" : "Public Representation" },
        { title: isGu ? "લોકશાહી મૂલ્યો" : "Democratic Values" },
        { title: isGu ? "પારદર્શિતા" : "Transparency" }
      ]
    },
    responsibilities: {
      title: isGu ? "જવાબદારીઓ" : "Responsibilities",
      items: [
        { title: isGu ? "રાષ્ટ્રીય નેતૃત્વ" : "National Leadership", icon: <Flag /> },
        { title: isGu ? "નીતિ નિર્માણ" : "Policy Making", icon: <FileText /> },
        { title: isGu ? "સંગઠન વિસ્તરણ" : "Organization Expansion", icon: <Users /> },
        { title: isGu ? "સભ્યપદ વૃદ્ધિ" : "Membership Growth", icon: <UserPlus /> },
        { title: isGu ? "જનસંપર્ક" : "Public Communication", icon: <Target /> },
        { title: isGu ? "નેતૃત્વ તાલીમ" : "Leadership Training", icon: <BookOpen /> },
        { title: isGu ? "ટેક્નોલોજી સંચાલન" : "Technology Management", icon: <Monitor /> },
        { title: isGu ? "સંકલન" : "Coordination", icon: <Settings /> }
      ]
    },
    meetings: {
      title: isGu ? "બેઠક અને સંકલન" : "Meeting & Coordination",
      items: [
        { title: isGu ? "કાર્યકારિણી બેઠક" : "Executive Meeting" },
        { title: isGu ? "રાજ્ય સંકલન બેઠક" : "State Coordination Meeting" },
        { title: isGu ? "નીતિ સમિતિ બેઠક" : "Policy Committee Meeting" },
        { title: isGu ? "સંગઠન સમીક્ષા" : "Organization Review" },
        { title: isGu ? "રાષ્ટ્રીય અધિવેશન" : "National Convention" }
      ]
    },
    digital: {
      title: isGu ? "ડિજિટલ સંગઠન" : "Digital Organization",
      items: [
        { title: isGu ? "ડિજિટલ ડેશબોર્ડ" : "Digital Dashboard" },
        { title: isGu ? "સભ્ય સંચાલન" : "Member Management" },
        { title: isGu ? "મોબાઈલ એપ" : "Mobile App" },
        { title: isGu ? "સંચાર પ્લેટફોર્મ" : "Communication Platform" },
        { title: isGu ? "તાલીમ પોર્ટલ" : "Training Portal" },
        { title: isGu ? "એનાલિટિક્સ" : "Analytics" },
        { title: isGu ? "દસ્તાવેજ સંચાલન" : "Document Management" },
        { title: isGu ? "ઓનલાઈન બેઠકો" : "Online Meetings" }
      ]
    },
    commitment: {
      title: isGu ? "અમારો સંકલ્પ" : "Our Commitment",
      slogan: isGu ? "મજબૂત સંગઠન – મજબૂત લોકશાહી – મજબૂત ભારત" : "Strong Organization • Strong Democracy • Strong India",
      desc: isGu ? "અમે દેશના દરેક નાગરિકને સમાન અધિકાર અને વિકાસની તકો પૂરી પાડવા માટે કટિબદ્ધ છીએ." : "We are committed to providing equal rights and development opportunities to every citizen of the country.",
      btn1: isGu ? "સભ્યપદ મેળવો" : "Join Membership",
      btn2: isGu ? "સંપર્ક કરો" : "Contact Us"
    }
  };

  // Expected Leadership Structure
  const hierarchyPositions = [
    { key: "National President", priority: 1, labelEn: "National President", labelGu: "રાષ્ટ્રીય અધ્યક્ષ" },
    { key: "Working President", priority: 2, labelEn: "Working President", labelGu: "રાષ્ટ્રીય કાર્યકારી અધ્યક્ષ" },
    { key: "Vice President", priority: 3, labelEn: "Vice President", labelGu: "રાષ્ટ્રીય ઉપાધ્યક્ષ" },
    { key: "General Secretary", priority: 4, labelEn: "General Secretary", labelGu: "રાષ્ટ્રીય મહામંત્રી" },
    { key: "Organisation General Secretary", priority: 5, labelEn: "Organisation General Secretary", labelGu: "રાષ્ટ્રીય સંગઠન મહામંત્રી" },
    { key: "Secretary", priority: 6, labelEn: "Secretary", labelGu: "રાષ્ટ્રીય સચિવ" },
    { key: "Treasurer", priority: 7, labelEn: "Treasurer", labelGu: "રાષ્ટ્રીય કોષાધ્યક્ષ" },
    { key: "Spokesperson", priority: 8, labelEn: "Spokesperson", labelGu: "રાષ્ટ્રીય પ્રવક્તા" },
    { key: "Executive Committee", priority: 9, labelEn: "Executive Committee", labelGu: "રાષ્ટ્રીય કાર્યકારિણી" }
  ];

  const getBearerForPosition = (priority: number) => {
    return bearers.find(b => b.position.priority === priority);
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-r from-slate-900 via-primary to-slate-900 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="text-sm font-medium mb-4 text-primary-200 tracking-wider uppercase">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> &gt; 
            <Link href="/organization" className="hover:text-white transition-colors ml-2">Organization</Link> &gt; 
            <span className="ml-2 text-white">{content.hero.title}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">{content.hero.title}</h1>
          <h2 className="text-xl md:text-3xl font-semibold mb-8 text-amber-400">{content.hero.subtitle}</h2>
          <Link href="/membership" className="inline-block bg-white text-primary hover:bg-amber-400 hover:text-slate-900 font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            {content.hero.cta}
          </Link>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed font-medium">
          {content.intro.text1}
        </p>
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border-l-4 border-primary shadow-sm inline-block">
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
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
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

      {/* 5 & 6. Leadership Structure and Cards */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">{isGu ? "રાષ્ટ્રીય નેતૃત્વ માળખું" : "National Leadership Structure"}</h3>
        
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 -ml-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 hidden md:block"></div>
          
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
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-primary shadow-lg mb-4 md:mb-0">
                    <span className="text-primary font-bold">{pos.priority}</span>
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

                  {/* Leader Card - Shown below node on mobile, absolute positioned on desktop */}
                  <div className="w-full md:absolute md:w-[45%] bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/50 hover:shadow-2xl z-20"
                       style={{ [isEven ? 'right' : 'left']: '0' }}>
                    
                    {/* Mobile Header */}
                    <div className="md:hidden text-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                       <h4 className="text-lg font-bold text-slate-900 dark:text-white">{positionLabel}</h4>
                    </div>

                    {bearer ? (
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-inner">
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
                          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-1">
                            {isGu ? bearer.position.nameGu : bearer.position.nameEn}
                          </p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <Target className="w-3 h-3" /> {bearer.member.state}, {bearer.member.district}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-slate-500 flex flex-col items-center">
                        <Users className="w-10 h-10 mb-2 opacity-50" />
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
      <section className="bg-primary/5 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.responsibilities.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.responsibilities.items.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/10">
                <div className="text-primary mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Meetings */}
      <section className="max-w-4xl mx-auto px-6 py-10">
         <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{content.meetings.title}</h3>
         <div className="flex flex-wrap justify-center gap-4">
            {content.meetings.items.map((item: any, i: number) => (
              <span key={i} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-semibold shadow-sm border border-slate-200 dark:border-slate-700">
                {item.title}
              </span>
            ))}
         </div>
      </section>

      {/* 9. Digital Organization */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <Smartphone className="w-16 h-16 text-amber-400 mb-6 mx-auto md:mx-0" />
              <h3 className="text-3xl font-bold mb-4">{content.digital.title}</h3>
              <p className="text-slate-400">{isGu ? "આધુનિક ટેકનોલોજી દ્વારા પક્ષનું સંચાલન" : "Managing the party through modern technology"}</p>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.digital.items.map((item: any, i: number) => (
                <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center hover:bg-slate-800 transition-colors">
                  <Monitor className="w-6 h-6 text-primary-400 mx-auto mb-2 opacity-70" />
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
        <p className="text-2xl font-semibold text-primary mb-6">"{content.commitment.slogan}"</p>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">{content.commitment.desc}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/membership" className="px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary/90 transition-colors">
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
