"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Users, Target, Shield, Zap, TrendingUp, Monitor, Heart, ShieldCheck, Flag, Briefcase, GraduationCap, Leaf } from "lucide-react";

export function PublicOrganizationStructure() {
  const locale = useLocale();
  const isGu = locale === "gu";

  // Content Dictionaries
  const content = {
    hero: {
      title: isGu ? "સંગઠન માળખું" : "Organization Structure",
      subtitle: isGu 
        ? "મજબૂત સંગઠન • મજબૂત લોકશાહી • મજબૂત ભારત"
        : "Strong Organization • Strong Democracy • Strong India",
      desc: isGu 
        ? "દેશના દરેક રાજ્ય, જિલ્લા, તાલુકા અને ગામ સુધી મજબૂત, જવાબદાર અને ટેક્નોલોજી આધારિત સંગઠનનું નિર્માણ."
        : "Build a transparent, responsible, and technology-driven organization from the national level to every village across India.",
      cta: isGu ? "સંગઠન સાથે જોડાઓ" : "Join Organization"
    },
    intro: {
      title: isGu ? "પ્રસ્તાવના" : "Introduction",
      text1: isGu 
        ? "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટીનું માનવું છે કે કોઈપણ રાજકીય પક્ષની સૌથી મોટી શક્તિ તેનું મજબૂત, જવાબદાર અને લોકો સાથે સતત જોડાયેલું સંગઠન છે. સંગઠન માત્ર હોદ્દાઓની વ્યવસ્થા નથી, પરંતુ જનસેવા, શિસ્ત, પારદર્શિતા અને જવાબદારીના સિદ્ધાંતો પર કાર્ય કરતી એક સક્રિય ટીમ છે."
        : "The Rashtriya Annadata Vikas Party believes that the greatest strength of any political party is its strong, responsible, and people-connected organization. An organization is not just a system of positions, but an active team working on the principles of public service, discipline, transparency, and accountability.",
      text2: isGu
        ? "અમારું સંગઠન દેશના દરેક રાજ્ય, જિલ્લા, તાલુકા અને ગામ સુધી પહોંચે તે રીતે બહુસ્તરીય માળખામાં રચવામાં આવશે, જેથી દરેક નાગરિકને પક્ષ સાથે જોડાવાની અને વિકાસની પ્રક્રિયામાં સહભાગી બનવાની સમાન તક મળે."
        : "Our organization will be structured in a multi-level framework to reach every state, district, taluka, and village, ensuring every citizen has an equal opportunity to join the party and participate in the development process.",
      text3: isGu
        ? "અમારો વિશ્વાસ છે કે મજબૂત સંગઠન દ્વારા જ લોકોના પ્રશ્નો અસરકારક રીતે સમજી શકાય, યોગ્ય નીતિઓ ઘડી શકાય અને લોકશાહી વધુ સશક્ત બની શકે."
        : "We believe that only through a strong organization can people's issues be effectively understood, appropriate policies formulated, and democracy strengthened."
    },
    vision: {
      title: isGu ? "અમારું વિઝન" : "Our Vision",
      items: [
        { icon: <Flag />, title: isGu ? "દેશવ્યાપી સક્રિય સંગઠન" : "Active Nationwide Organization" },
        { icon: <Heart />, title: isGu ? "જનસેવા સર્વોચ્ચ પ્રાથમિકતા" : "Public Service First" },
        { icon: <Users />, title: isGu ? "સમાન તક" : "Equal Opportunity" },
        { icon: <ShieldCheck />, title: isGu ? "પારદર્શિતા" : "Transparency" },
        { icon: <Zap />, title: isGu ? "યુવા નેતૃત્વ" : "Youth Leadership" },
        { icon: <Briefcase />, title: isGu ? "મહિલા નેતૃત્વ" : "Women Leadership" },
        { icon: <Monitor />, title: isGu ? "ટેક્નોલોજી આધારિત" : "Technology Driven" }
      ]
    },
    levels: {
      title: isGu ? "સંગઠનનું માળખું" : "Organization Hierarchy",
      items: [
        { level: isGu ? "રાષ્ટ્રીય સ્તર" : "National Level", desc: isGu ? "સમગ્ર દેશનું સંકલન" : "Nationwide Coordination" },
        { level: isGu ? "રાજ્ય સ્તર" : "State Level", desc: isGu ? "રાજ્યનું સંચાલન" : "State Management" },
        { level: isGu ? "જિલ્લા સ્તર" : "District Level", desc: isGu ? "જિલ્લા કક્ષાની કામગીરી" : "District Operations" },
        { level: isGu ? "તાલુકા સ્તર" : "Taluka Level", desc: isGu ? "તાલુકા સંકલન" : "Taluka Coordination" },
        { level: isGu ? "શહેર / નગર સ્તર" : "City Level", desc: isGu ? "શહેરી પ્રવૃત્તિઓ" : "City Activities" },
        { level: isGu ? "ગામ સ્તર" : "Village Level", desc: isGu ? "પાયાનું એકમ" : "Grassroots Unit" }
      ]
    },
    wings: {
      title: isGu ? "વિશેષ મોરચા" : "Special Wings",
      items: [
        { icon: <Leaf />, title: isGu ? "ખેડૂત મોરચો" : "Farmer Wing" },
        { icon: <Zap />, title: isGu ? "યુવા મોરચો" : "Youth Wing" },
        { icon: <Users />, title: isGu ? "મહિલા મોરચો" : "Women Wing" },
        { icon: <GraduationCap />, title: isGu ? "વિદ્યાર્થી મોરચો" : "Student Wing" },
        { icon: <Briefcase />, title: isGu ? "વેપારી મોરચો" : "Business Wing" },
        { icon: <Briefcase />, title: isGu ? "વ્યાવસાયિક મંચ" : "Professional Wing" },
        { icon: <Target />, title: isGu ? "પર્યાવરણ મંચ" : "Environment Wing" },
        { icon: <Heart />, title: isGu ? "સામાજિક સેવા મંચ" : "Social Service Wing" }
      ]
    },
    principles: {
      title: isGu ? "અમારી કાર્યપદ્ધતિ" : "Working Principles",
      items: [
        isGu ? "જનસેવા પ્રથમ" : "Public Service First",
        isGu ? "પારદર્શિતા અને જવાબદારી" : "Transparency & Accountability",
        isGu ? "નિયમિત બેઠકો" : "Regular Meetings",
        isGu ? "તાલીમ અને ક્ષમતા વિકાસ" : "Training Programs",
        isGu ? "ટીમ વર્ક" : "Team Work",
        isGu ? "ડિજિટલ મેનેજમેન્ટ" : "Digital Management",
        isGu ? "લોકો સાથે સતત સંવાદ" : "Public Communication",
        isGu ? "બંધારણ અને કાયદાનું પાલન" : "Constitutional Values"
      ]
    },
    slogan: {
      line1: isGu ? "મજબૂત સંગઠન – મજબૂત લોકશાહી – મજબૂત ભારત" : "Strong Organization • Strong Democracy • Strong India",
      line2: isGu ? "કાર્યકર અમારી સૌથી મોટી શક્તિ, જનસેવા અમારો સર્વોચ્ચ ધર્મ." : "Our Workers Are Our Greatest Strength. Public Service Is Our Highest Duty."
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-md">{content.hero.title}</h1>
          <h2 className="text-2xl font-semibold mb-4 text-blue-200">{content.hero.subtitle}</h2>
          <p className="text-lg max-w-3xl mx-auto mb-10 opacity-90 leading-relaxed">{content.hero.desc}</p>
          <Link href="/membership" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            {content.hero.cta}
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{content.intro.title}</h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {content.intro.text1}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {content.intro.text2}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl border-l-4 border-blue-500">
            <p className="text-xl font-medium text-blue-900 dark:text-blue-200 italic">
              "{content.intro.text3}"
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{content.vision.title}</h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.vision.items.map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                {item.icon}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Hierarchy Timeline */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{content.levels.title}</h3>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-200 before:via-blue-500 before:to-transparent">
            {content.levels.items.map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 text-white font-bold shrink-0 shadow z-10">
                  {i + 1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.level}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wings */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{content.wings.title}</h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.wings.items.map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-xl transition-all cursor-default">
              <div className="text-blue-600 dark:text-blue-400">
                {item.icon}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Slogan & Commitment */}
      <section className="bg-orange-50 dark:bg-orange-950/20 py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Target className="w-16 h-16 mx-auto text-orange-500 mb-8 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {content.slogan.line1}
          </h2>
          <h3 className="text-xl md:text-2xl font-medium text-orange-600 dark:text-orange-400">
            "{content.slogan.line2}"
          </h3>
        </div>
      </section>
    </div>
  );
}
