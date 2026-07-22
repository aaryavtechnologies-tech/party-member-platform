import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [office, socialLinks, faqs, settingsRaw] = await Promise.all([
      prisma.contactOffice.findFirst({
        where: { isHeadquarters: true },
        include: {
          workingHours: {
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.contactSocialLink.findMany({
        where: { isEnabled: true },
        orderBy: { order: "asc" },
      }),
      prisma.contactFaq.findMany({
        where: { isEnabled: true },
        orderBy: { order: "asc" },
      }),
      prisma.contactSetting.findMany(),
    ]);

    const settings: Record<string, any> = {};
    settingsRaw.forEach((item) => {
      try {
        settings[item.key] = JSON.parse(item.value);
      } catch {
        settings[item.key] = item.value;
      }
    });

    return NextResponse.json({
      success: true,
      office: office || {
        officeNameEn: "Rashtriya Annadata Vikas Party (RAVP)",
        officeNameGu: "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP)",
        addressEn: "336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot – 360001, Gujarat, India",
        addressGu: "૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ – ૩૬૦૦૦૧, ગુજરાત, ભારત",
        phone: "9016641851",
        email: "info@rashtriyaannadatavikasparty.org",
        website: "www.rashtriyaannadatavikasparty.org",
        googleMapUrl: "https://maps.google.com/?q=Dhebar+Road+Rajkot+Gujarat",
        embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.688137351659!2d70.8005391!3d22.2907481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca086a982dfb%3A0x63ebc980fb5c5f4!2sDhebar%20Rd%2C%20Rajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        workingHours: [
          { dayRangeEn: "Monday – Saturday", dayRangeGu: "સોમવાર – શનિવાર", timingEn: "10:00 AM – 6:00 PM", timingGu: "સવારે 10:00 – સાંજે 6:00", isClosed: false },
          { dayRangeEn: "Sunday", dayRangeGu: "રવિવાર", timingEn: "Closed", timingGu: "બંધ", isClosed: true },
          { dayRangeEn: "Public Holidays", dayRangeGu: "જાહેર રજાઓ", timingEn: "Closed", timingGu: "બંધ", isClosed: true },
        ],
      },
      socialLinks: socialLinks || [],
      faqs: faqs || [],
      settings: {
        hero: settings.contact_hero || {
          titleEn: "Contact Us",
          titleGu: "અમારો સંપર્ક કરો",
          subtitleEn: "Your Contact, Our Trust – Always With You For Public Service",
          subtitleGu: "આપનો સંપર્ક, અમારો વિશ્વાસ – જનસેવા માટે હંમેશા આપની સાથે",
        },
        intro: settings.contact_intro || {
          headingEn: "Dedicated to Serving Farmers & Citizens Across Gujarat and India",
          headingGu: "ગુજરાત અને ભારતના ખેડૂતો અને નાગરિકોની સેવા માટે સમર્પિત",
          contentEn: "Rashtriya Annadata Vikas Party (RAVP) believes in open governance, direct communication, and unyielding dedication to public welfare.",
          contentGu: "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP) પારદર્શી શાસન, સીધા સંવાદ અને જનકલ્યાણ માટે અવિરત સમર્પણમાં માને છે.",
        },
        motto: settings.contact_motto || {
          textEnLine1: "Your Voice, Our Trust.",
          textEnLine2: "Public Connection Creates Public Trust.",
          textGuLine1: "આપનો અવાજ, અમારો વિશ્વાસ.",
          textGuLine2: "જનસંપર્કથી જનવિશ્વાસ, જનવિશ્વાસથી સમૃદ્ધ ભારત.",
        },
        commitment: settings.contact_commitment || {
          titleEn: "Our Commitment to Public Service",
          titleGu: "જનસેવા માટે અમારું વચન",
          contentEn: "Every voice matters. Every concern will be heard. RAVP promises transparency, prompt response, and steadfast commitment to solving every public grievance.",
          contentGu: "દરેક અવાજ મહત્વપૂર્ણ છે. દરેક સમસ્યા સાંભળવામાં આવશે.",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching contact settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load contact settings" },
      { status: 500 }
    );
  }
}
