/**
 * Seed Script: Creates Admin + Demo Member accounts
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@better-auth/utils/password";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function createUser(opts: {
  name: string;
  email: string;
  password: string;
  role: string;
  withMemberProfile?: boolean;
}) {
  const existing = await prisma.user.findUnique({ where: { email: opts.email } });

  if (existing) {
    // Ensure role is correct
    await prisma.user.update({
      where: { email: opts.email },
      data: { role: opts.role, emailVerified: true },
    });
    return { existed: true, user: existing };
  }

  const hashedPass = await hashPassword(opts.password);
  const userId = crypto.randomUUID();

  const userData: any = {
    id: userId,
    name: opts.name,
    email: opts.email,
    emailVerified: true,
    role: opts.role,
    accounts: {
      create: {
        accountId: opts.email,
        providerId: "credential",
        provider: "credential",
      },
    },
  };

  // Create user without password first, then update the account with the password
  const user = await prisma.user.create({ data: userData });

  // Update the account to set password
  await prisma.account.updateMany({
    where: { userId: user.id, providerId: "credential" },
    data: { password: hashedPass } as any,
  });

  if (opts.withMemberProfile) {
    const existingMobile = await prisma.memberProfile.findUnique({ where: { mobile: "9876543210" } });
    const existingMemberId = await prisma.memberProfile.findUnique({ where: { memberId: "RAVP-2026-000001" } });

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        memberId: existingMemberId ? `RAVP-DEMO-${Date.now()}` : "RAVP-2026-000001",
        fatherName: "Rameshbhai Demo",
        gender: "Male",
        dob: new Date("1990-06-15"),
        mobile: existingMobile ? `987654${Math.floor(1000 + Math.random() * 9000)}` : "9876543210",
        state: "Gujarat",
        district: "Rajkot",
        taluka: "Paddhari",
        village: "Govindpar",
        fullAddress: "123, Gandhi Nagar, Near Temple, Govindpar",
        pincode: "360110",
        referralCode: `RAVPDEMO${Math.floor(100000 + Math.random() * 900000)}`,
        membershipType: "PRIMARY",
        status: "ACTIVE",
      },
    });
  }

  return { existed: false, user };
}

async function main() {
  console.log("\n🌱 Seeding demo accounts...\n");

  // ─── ADMIN ───
  const adminResult = await createUser({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "ADMIN",
  });

  if (adminResult.existed) {
    console.log("✅ Admin already existed — role updated to ADMIN");
  } else {
    console.log("✅ Admin created — ID:", adminResult.user.id);
  }
  console.log("   📧  Email    : admin@gmail.com");
  console.log("   🔑  Password : admin123");
  console.log("   👑  Role     : ADMIN\n");

  // ─── DEMO MEMBER ───
  const memberResult = await createUser({
    name: "Demo Member",
    email: "member@demo.com",
    password: "member123",
    role: "USER",
    withMemberProfile: true,
  });

  if (memberResult.existed) {
    console.log("✅ Demo member already existed — skipping");
  } else {
    const profile = await prisma.memberProfile.findUnique({ where: { userId: memberResult.user.id } });
    console.log("✅ Demo member created — ID:", memberResult.user.id, "| Member ID:", profile?.memberId);
  }
  console.log("   📧  Email    : member@demo.com");
  console.log("   🔑  Password : member123");
  console.log("   👤  Role     : USER\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🎉 Done! Login at: http://localhost:3001/en/membership/login");
  console.log("  ADMIN  → admin@gmail.com  / admin123");
  console.log("  MEMBER → member@demo.com  / member123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ─── CONTACT MODULE SEED ───
  console.log("📌 Seeding Contact Module defaults...");
  const hqOffice = await prisma.contactOffice.findFirst({ where: { isHeadquarters: true } });
  if (!hqOffice) {
    const office = await prisma.contactOffice.create({
      data: {
        officeNameEn: "Rashtriya Annadata Vikas Party (RAVP)",
        officeNameGu: "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP)",
        addressEn: "336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot – 360001, Gujarat, India",
        addressGu: "૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ – ૩૬૦૦૦૧, ગુજરાત, ભારત",
        phone: "9016641851",
        email: "info@rashtriyaannadatavikasparty.org",
        website: "www.rashtriyaannadatavikasparty.org",
        googleMapUrl: "https://maps.google.com/?q=Dhebar+Road+Rajkot+Gujarat",
        embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.688137351659!2d70.8005391!3d22.2907481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca086a982dfb%3A0x63ebc980fb5c5f4!2sDhebar%20Rd%2C%20Rajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        isHeadquarters: true,
        order: 1,
      },
    });

    await prisma.contactWorkingHour.createMany({
      data: [
        { officeId: office.id, dayRangeEn: "Monday – Saturday", dayRangeGu: "સોમવાર – શનિવાર", timingEn: "10:00 AM – 6:00 PM", timingGu: "સવારે 10:00 – સાંજે 6:00", isClosed: false, order: 1 },
        { officeId: office.id, dayRangeEn: "Sunday", dayRangeGu: "રવિવાર", timingEn: "Closed", timingGu: "બંધ", isClosed: true, order: 2 },
        { officeId: office.id, dayRangeEn: "Public Holidays", dayRangeGu: "જાહેર રજાઓ", timingEn: "Closed", timingGu: "બંધ", isClosed: true, order: 3 },
      ],
    });
    console.log("  ✅ Headquarters & Working Hours created");
  }

  const socialCount = await prisma.contactSocialLink.count();
  if (socialCount === 0) {
    await prisma.contactSocialLink.createMany({
      data: [
        { platform: "FACEBOOK", platformNameEn: "Facebook", platformNameGu: "ફેસબુક", url: "https://facebook.com/ravp", isEnabled: true, order: 1 },
        { platform: "INSTAGRAM", platformNameEn: "Instagram", platformNameGu: "ઇન્સ્ટાગ્રામ", url: "https://instagram.com/ravp", isEnabled: true, order: 2 },
        { platform: "TWITTER", platformNameEn: "X (Twitter)", platformNameGu: "X (ટ્વિટર)", url: "https://x.com/ravp", isEnabled: true, order: 3 },
        { platform: "YOUTUBE", platformNameEn: "YouTube", platformNameGu: "યુટ્યુબ", url: "https://youtube.com/ravp", isEnabled: true, order: 4 },
        { platform: "WHATSAPP", platformNameEn: "WhatsApp Channel", platformNameGu: "વોટ્સએપ ચેનલ", url: "", isEnabled: true, order: 5 },
        { platform: "TELEGRAM", platformNameEn: "Telegram Channel", platformNameGu: "ટેલિગ્રામ ચેનલ", url: "", isEnabled: true, order: 6 },
      ],
    });
    console.log("  ✅ Social Links created");
  }

  const faqCount = await prisma.contactFaq.count();
  if (faqCount === 0) {
    await prisma.contactFaq.createMany({
      data: [
        {
          questionEn: "How can I become a member?",
          questionGu: "હું સભ્ય કેવી રીતે બની શકું?",
          answerEn: "You can click on the 'Become a Member' button at the top of the page, fill in your details, and complete registration.",
          answerGu: "તમે પૃષ્ઠના ઉપરના ભાગમાં 'સભ્ય બનો' બટન પર ક્લિક કરી શકો છો, તમારી વિગતો ભરી શકો છો અને નોંધણી પૂર્ણ કરી શકો છો.",
          order: 1,
        },
        {
          questionEn: "How do I upgrade my membership?",
          questionGu: "હું મારી સભ્યપદ કેવી રીતે અપગ્રેડ કરું?",
          answerEn: "Log in to your member portal and navigate to the Membership Upgrade section to select Lifetime Primary or Active status.",
          answerGu: "તમારા સભ્ય પોર્ટલમાં લૉગ ઇન કરો અને આજીવન પ્રાથમિક અથવા સક્રિય સભ્યપદ પસંદ કરવા માટે 'અપગ્રેડ' વિભાગ પર જાઓ.",
          order: 2,
        },
        {
          questionEn: "Where is the headquarters?",
          questionGu: "પક્ષનું મુખ્ય કાર્યાલય ક્યાં આવેલું છે?",
          answerEn: "RAVP Headquarters is located at 336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot – 360001, Gujarat, India.",
          answerGu: "RAVP મુખ્ય કાર્યાલય ૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ – ૩૬૦૦૦૧, ગુજરાત, ભારતમાં આવેલું છે.",
          order: 3,
        },
        {
          questionEn: "How do I contact the District Team?",
          questionGu: "જિલ્લા ટીમનો સંપર્ક કેવી રીતે કરવો?",
          answerEn: "Visit our Organization section in the main menu to view details and contact info of district office bearers.",
          answerGu: "જિલ્લા હોદ્દેદારોની વિગતો અને સંપર્ક માહિતી જોવા માટે મુખ્ચ મેનૂમાં સંગઠન વિભાગની મુલાકાત લો.",
          order: 4,
        },
        {
          questionEn: "How can I submit a complaint?",
          questionGu: "હું ફરિયાદ ક્યાં દાખલ કરી શકું?",
          answerEn: "Fill out the online contact form on this page with the subject 'Complaint' or visit our office directly.",
          answerGu: "આ પૃષ્ઠ પર 'ફરિયાદ' વિષય સાથે ઑનલાઇન સંપર્ક ફોર્મ ભરો અથવા સીધા અમારા કાર્યાલયની મુલાકાત લો.",
          order: 5,
        },
        {
          questionEn: "How can I volunteer?",
          questionGu: "હું સ્વયંસેવક તરીકે કેવી રીતે જોડાઈ શકું?",
          answerEn: "Click on 'Volunteer Registration' in our services section or select 'Volunteer' in the inquiry form subject.",
          answerGu: "અમારી સેવાઓ વિભાગમાં 'સ્વયંસેવક નોંધણી' પર ક્લિક કરો અથવા સંપર્ક ફોર્મમાં 'સ્વયંસેવક' વિષય પસંદ કરો.",
          order: 6,
        },
        {
          questionEn: "How do I contact the media department?",
          questionGu: "મીડિયા વિભાગનો સંપર્ક કેવી રીતે કરવો?",
          answerEn: "Send an email to info@rashtriyaannadatavikasparty.org with subject 'Media Query' or call 9016641851.",
          answerGu: "'મીડિયા પૂછપરછ' વિષય સાથે info@rashtriyaannadatavikasparty.org પર ઇમેઇલ મોકલો અથવા 9016641851 પર કૉલ કરો.",
          order: 7,
        },
      ],
    });
    console.log("  ✅ FAQs created");
  }

  const settingCount = await prisma.contactSetting.count();
  if (settingCount === 0) {
    await prisma.contactSetting.createMany({
      data: [
        {
          key: "contact_hero",
          value: JSON.stringify({
            titleEn: "Contact Us",
            titleGu: "અમારો સંપર્ક કરો",
            subtitleEn: "Your Contact, Our Trust – Always With You For Public Service",
            subtitleGu: "આપનો સંપર્ક, અમારો વિશ્વાસ – જનસેવા માટે હંમેશા આપની સાથે",
            heroImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=2000&q=80",
          }),
        },
        {
          key: "contact_intro",
          value: JSON.stringify({
            headingEn: "Dedicated to Serving Farmers & Citizens Across Gujarat and India",
            headingGu: "ગુજરાત અને ભારતના ખેડૂતો અને નાગરિકોની સેવા માટે સમર્પિત",
            contentEn: "Rashtriya Annadata Vikas Party (RAVP) believes in open governance, direct communication, and unyielding dedication to public welfare. Whether you have questions regarding membership, local district issues, or party initiatives, our team is always ready to support you.",
            contentGu: "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP) પારદર્શી શાસન, સીધા સંવાદ અને જનકલ્યાણ માટે અવિરત સમર્પણમાં માને છે. સભ્યપદ, સ્થાનિક સમસ્યાઓ કે પક્ષની પહેલો અંગે તમારી પાસે કોઈ પ્રશ્ન હોય, તો અમારી ટીમ હંમેશા આપની મદદ માટે તૈયાર છે.",
          }),
        },
        {
          key: "contact_motto",
          value: JSON.stringify({
            textEnLine1: "Your Voice, Our Trust.",
            textEnLine2: "Public Connection Creates Public Trust.",
            textGuLine1: "આપનો અવાજ, અમારો વિશ્વાસ.",
            textGuLine2: "જનસંપર્કથી જનવિશ્વાસ, જનવિશ્વાસથી સમૃદ્ધ ભારત.",
          }),
        },
        {
          key: "contact_commitment",
          value: JSON.stringify({
            titleEn: "Our Commitment to Public Service",
            titleGu: "જનસેવા માટે અમારું વચન",
            contentEn: "Every voice matters. Every concern will be heard. RAVP promises transparency, prompt response, and steadfast commitment to solving every public grievance for a prosperous India.",
            contentGu: "દરેક અવાજ મહત્વપૂર્ણ છે. દરેક સમસ્યા સાંભળવામાં આવશે. RAVP સમૃદ્ધ ભારત માટે પારદર્શિતા, ઝડપી પ્રતિસાદ અને દરેક લોકપ્રશ્નનું નિવારણ લાવવાનું વચન આપે છે.",
          }),
        },
      ],
    });
    console.log("  ✅ Contact Settings created");
  }

  // ─── FAQ MODULE SEED ───
  console.log("📌 Seeding FAQ Module categories & 20 FAQs...");
  const catCount = await prisma.faqCategory.count();
  let categories: Record<string, string> = {};

  if (catCount === 0) {
    const createdCats = await Promise.all([
      prisma.faqCategory.create({ data: { nameEn: "General", nameGu: "સામાન્ય માહિતી", slug: "general", icon: "HelpCircle", sortOrder: 1 } }),
      prisma.faqCategory.create({ data: { nameEn: "Membership", nameGu: "સભ્યપદ", slug: "membership", icon: "UserPlus", sortOrder: 2 } }),
      prisma.faqCategory.create({ data: { nameEn: "Payments", nameGu: "પેમેન્ટ્સ", slug: "payments", icon: "CreditCard", sortOrder: 3 } }),
      prisma.faqCategory.create({ data: { nameEn: "Dashboard", nameGu: "ડેશબોર્ડ", slug: "dashboard", icon: "LayoutDashboard", sortOrder: 4 } }),
      prisma.faqCategory.create({ data: { nameEn: "Organization", nameGu: "સંગઠન", slug: "organization", icon: "Network", sortOrder: 5 } }),
      prisma.faqCategory.create({ data: { nameEn: "Contact", nameGu: "સંપર્ક", slug: "contact", icon: "PhoneCall", sortOrder: 6 } }),
      prisma.faqCategory.create({ data: { nameEn: "Security", nameGu: "સુરક્ષા", slug: "security", icon: "ShieldCheck", sortOrder: 7 } }),
      prisma.faqCategory.create({ data: { nameEn: "Technical", nameGu: "ટેકનિકલ સહાય", slug: "technical", icon: "Wrench", sortOrder: 8 } }),
    ]);

    createdCats.forEach((c) => {
      categories[c.slug] = c.id;
    });
    console.log("  ✅ 8 FAQ Categories created");
  } else {
    const existingCats = await prisma.faqCategory.findMany();
    existingCats.forEach((c) => {
      categories[c.slug] = c.id;
    });
  }

  const faqItemsCount = await prisma.faq.count();
  if (faqItemsCount === 0) {
    const rawFaqs = [
      {
        slug: "faq-1-what-is-ravp",
        categorySlug: "general",
        questionGu: "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP) શું છે?",
        questionEn: "What is Rashtriya Annadata Vikas Party (RAVP)?",
        answerGu: "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP) એ ભારતની કૃષિ, શ્રમિકો, યુવાનો અને સામાન્ય નાગરિકોના હિત અને વિકાસ માટે સમર્પિત રાષ્ટ્રીય રાજકીય પક્ષ છે.",
        answerEn: "Rashtriya Annadata Vikas Party (RAVP) is a national political party dedicated to the welfare, rights, and holistic development of farmers, workers, youth, and common citizens across India.",
        featured: true,
        sortOrder: 1,
      },
      {
        slug: "faq-2-motto-and-objective",
        categorySlug: "general",
        questionGu: "પક્ષનું મુખ્ય સૂત્ર અને ધ્યેય શું છે?",
        questionEn: "What is the main motto and objective of the party?",
        answerGu: "પક્ષનું સૂત્ર 'આપનો અવાજ, અમારો વિશ્વાસ. જનસંપર્કથી જનવિશ્વાસ, જનવિશ્વાસથી સમૃદ્ધ ભારત' છે. અમારો મુખ્ય ધ્યેય ખેડૂતોને યોગ્ય ભાવ, દરેક યુવાને રોજગાર અને ગ്രാമീણ ભારતનો વિકાસ કરવાનો છે.",
        answerEn: "Our motto is 'Your Voice, Our Trust. Public Connection Creates Public Trust.' Our primary objective is ensuring fair compensation for farmers, youth employment, and comprehensive rural development.",
        featured: true,
        sortOrder: 2,
      },
      {
        slug: "faq-3-how-to-become-member",
        categorySlug: "membership",
        questionGu: "પક્ષમાં સભ્યપદ કેવી રીતે મેળવવું?",
        questionEn: "How to become a member of RAVP?",
        answerGu: "તમે RAVP ની સત્તાવાર વેબસાઇટ પર 'સભ્ય બનો' બટન પર ક્લિક કરી તમારી પ્રાથમિક વિગતો, આધાર/મોબાઈલ નંબર આપી ઑનલાઇન સભ્યપદ મેળવી શકો છો.",
        answerEn: "You can click on the 'Become a Member' button on our official website, enter your personal details, verify your mobile number, and complete instant online registration.",
        featured: true,
        sortOrder: 3,
      },
      {
        slug: "faq-4-membership-types",
        categorySlug: "membership",
        questionGu: "સભ્યપદના પ્રકારો કયા કયા છે?",
        questionEn: "What are the types of membership?",
        answerGu: "પક્ષમાં ત્રણ મુખ્ય સભ્યપદ સ્તર છે: ૧. પ્રાથમિક સભ્ય (Primary Member), ૨. આજીવન પ્રાથમિક સભ્ય (Lifetime Primary Member), અને ૩. આજીવન સક્રિય સભ્ય (Lifetime Active Member).",
        answerEn: "RAVP offers three membership tiers: 1. Primary Member, 2. Lifetime Primary Member, and 3. Lifetime Active Member.",
        featured: false,
        sortOrder: 4,
      },
      {
        slug: "faq-5-primary-vs-active",
        categorySlug: "membership",
        questionGu: "પ્રાથમિક અને આજીવન સભ્યપદ વચ્ચે શું તફાવત છે?",
        questionEn: "What is the difference between Primary and Lifetime Membership?",
        answerGu: "પ્રાથમિક સભ્યપદથી આપ પક્ષના નોંધાયેલા સભ્ય બનો છો. આજીવન તથા સક્રિય સભ્યપદથી આપને પક્ષ સંગઠનની ચૂંટણીઓમાં ભાગ લેવા તથા પદો માટે દાવેદારી કરવાનો અધિકાર મળે છે.",
        answerEn: "Primary Membership registers you as an official supporter. Lifetime and Active Memberships grant eligibility for organizational leadership posts and internal decision-making processes.",
        featured: false,
        sortOrder: 5,
      },
      {
        slug: "faq-6-download-id-card",
        categorySlug: "dashboard",
        questionGu: "સભ્યપદ આઈડી કાર્ડ કેવી રીતે ડાઉનલોડ કરવું?",
        questionEn: "How to download the Membership ID Card?",
        answerGu: "સભ્ય પોર્ટલમાં લૉગ ઇન કરી તમારા ડેશબોર્ડ પરથી એક જ ક્લિકમાં કલરફુલ ડિજિટલ સભ્યપદ આઈડી કાર્ડ ક્યુઆર કોડ સાથે ડાઉનલોડ કરી શકો છો.",
        answerEn: "Log in to the Member Dashboard portal and click 'Download ID Card' to get your high-resolution digital membership card with verified QR code.",
        featured: true,
        sortOrder: 6,
      },
      {
        slug: "faq-7-pay-membership-fee",
        categorySlug: "payments",
        questionGu: "સભ્યપદ ફી અથવા દાન ઓનલાઇન કેવી રીતે ચૂકવવું?",
        questionEn: "How to pay membership fee or contribution online?",
        answerGu: "ડેશબોર્ડમાં 'Membership Upgrade' અથવા 'Contribution' વિભાગમાં જઈ UPI (Google Pay, PhonePe, Paytm), ક્રેડિટ/ડેબિટ કાર્ડ કે નેટબૅન્કિંગ દ્વારા Razorpay સુરક્ષિત ગેટવેથી ચૂકવણી કરી શકો છો.",
        answerEn: "Navigate to the Upgrade section in your dashboard and pay securely via UPI, Cards, or Net Banking using our Razorpay integrated payment gateway.",
        featured: false,
        sortOrder: 7,
      },
      {
        slug: "faq-8-payment-security",
        categorySlug: "payments",
        questionGu: "ઓનલાઇન પેમેન્ટ સિસ્ટમ કેટલી સુરક્ષિત છે?",
        questionEn: "How secure is the online payment system?",
        answerGu: "અમારું પેમેન્ટ સિસ્ટમ ૨૫૬-બીટ SSL એન્ક્રિપ્શન અને RBI માન્ય Razorpay ગેટવેથી સંપૂર્ણ સુરક્ષિત છે. દરેક ચુકવણીની પાવતી ઓટોમેટિક જનરેટ થાય છે.",
        answerEn: "Our payment architecture uses 256-bit SSL encryption and RBI-certified Razorpay payment gateway. Automated instant receipts and invoices are generated for all transactions.",
        featured: false,
        sortOrder: 8,
      },
      {
        slug: "faq-9-referral-code-usage",
        categorySlug: "membership",
        questionGu: "રેફરલ કોડ શું છે અને તેનો ઉપયોગ કેવી રીતે કરવો?",
        questionEn: "What is a Referral Code and how to use it?",
        answerGu: "દરેક સભ્યને એક અનન્ય રેફરલ કોડ (દા.ત. RAVP123456) મળે છે. અન્ય નાગરિકોને જોડતી વખતે તમારા કોડનો ઉપયોગ કરી આપ રેફરલ ટ્રેક કરી શકો છો.",
        answerEn: "Every registered member gets a unique referral code. You can share your code with friends and fellow citizens to invite them and build your grassroots network.",
        featured: false,
        sortOrder: 9,
      },
      {
        slug: "faq-10-forgot-password",
        categorySlug: "security",
        questionGu: "જો હું મારો લૉગિન પાસવર્ડ ભૂલી જાઉં તો શું કરવું?",
        questionEn: "What should I do if I forget my login password?",
        answerGu: "લૉગિન પેજ પર 'Forgot Password' પર ક્લિક કરો. તમારા નોંધાયેલા ઇમેઇલ અથવા મોબાઈલ પર OTP પ્રાપ્ત થશે, જે દાખલ કરી આપ નવો પાસવર્ડ બનાવી શકો છો.",
        answerEn: "Click 'Forgot Password' on the login screen. An OTP will be sent to your registered email or mobile number to reset your password safely.",
        featured: false,
        sortOrder: 10,
      },
      {
        slug: "faq-11-member-login",
        categorySlug: "dashboard",
        questionGu: "સભ્ય ડેશબોર્ડ પોર્ટલમાં લૉગ ઇન કેવી રીતે કરવું?",
        questionEn: "How to log in to the Member Dashboard portal?",
        answerGu: "મુખ્ય મેનૂમાંથી 'Member Login' પસંદ કરો, તમારો નોંધાયેલ ઇમેઇલ/મોબાઈલ અને પાસવર્ડ દાખલ કરો અથવા ઇમેઇલ OTP દ્વારા સીધા લૉગ ઇન કરો.",
        answerEn: "Click 'Member Login' in the main menu, enter your credentials or authenticate via Email OTP for instant login access.",
        featured: false,
        sortOrder: 11,
      },
      {
        slug: "faq-12-update-profile",
        categorySlug: "dashboard",
        questionGu: "સભ્ય પ્રોફાઈલ માહિતી કેવી રીતે અપડેટ કરી શકાય?",
        questionEn: "How can I update my Member Profile details?",
        answerGu: "ડેશબોર્ડમાં લૉગ ઇન કર્યા બાદ 'My Profile' અથવા 'Edit Profile' પર જઈ આપ તમારું સરનામું, પ્રોફાઇલ ફોટો તથા વિગતો અપડેટ કરી શકો છો.",
        answerEn: "After logging in, click 'My Profile' or 'Settings' in your member portal to update address, photo, and profile information.",
        featured: false,
        sortOrder: 12,
      },
      {
        slug: "faq-13-organization-structure",
        categorySlug: "organization",
        questionGu: "પક્ષનું રાષ્ટ્રીય અને પ્રદેશ સંગઠનાત્મક માળખું કેવું છે?",
        questionEn: "What is the national and state organizational structure?",
        answerGu: "RAVP સંગઠન ૫ સ્તરોમાં વહેંચાયેલું છે: રાષ્ટ્રીય ટીમ, રાજ્ય ટીમ, જિલ્લા ટીમ, તાલુકા ટીમ અને ગ્રામ્ય સમિતિ.",
        answerEn: "RAVP structure functions across 5 distinct tiers: National Committee, State Executive, District Committee, Taluka Committee, and Village Units.",
        featured: true,
        sortOrder: 13,
      },
      {
        slug: "faq-14-contact-district-team",
        categorySlug: "organization",
        questionGu: "મારા જિલ્લા અથવા તાલુકાના પક્ષ અધિકારીઓનો સંપર્ક કેવી રીતે કરવો?",
        questionEn: "How to contact District or Taluka party officials?",
        answerGu: "અમારા 'Organization' મેનૂમાં જઈ 'District Team' અથવા 'Taluka Team' પસંદ કરી તમારા વિસ્તારના તમામ હોદ્દેદારોના સંપર્ક જોઈ શકો છો.",
        answerEn: "Go to the 'Organization' menu and select 'District Team' or 'Taluka Team' to view list and contact information of local office bearers.",
        featured: false,
        sortOrder: 14,
      },
      {
        slug: "faq-15-submit-grievance",
        categorySlug: "contact",
        questionGu: "લોકપ્રશ્નો, સમસ્યા કે સુચન અંગે રજૂઆત ક્યાં કરવી?",
        questionEn: "Where to submit grievances, issues, or suggestions?",
        answerGu: "અમારા 'Contact Us' પેજ પર ઑનલાઇન સંપર્ક ફોર્મ ભરી અથવા તમારા સભ્ય ડેશબોર્ડમાંથી Support Ticket ઓપન કરીને રજૂઆત કરી શકો છો.",
        answerEn: "Submit your grievances via the online form on our 'Contact Us' page or raise a Support Ticket directly inside the Member Portal.",
        featured: true,
        sortOrder: 15,
      },
      {
        slug: "faq-16-volunteer-registration",
        categorySlug: "contact",
        questionGu: "પક્ષમાં સ્વયંસેવક (Volunteer) તરીકે કેવી રીતે જોડાવું?",
        questionEn: "How to join as a Volunteer for party initiatives?",
        answerGu: "સંપર્ક પેજ અથવા સભ્યપદ ફોર્મમાં 'Volunteer Interest' પસંદ કરો. અમારી સ્થાનિક સંકલન સમિતિ આપનો સંપર્ક કરશે.",
        answerEn: "Select 'Volunteer' on our contact page or member portal. Our local organization committee will reach out to involve you in community initiatives.",
        featured: false,
        sortOrder: 16,
      },
      {
        slug: "faq-17-press-releases-news",
        categorySlug: "contact",
        questionGu: "પક્ષની સત્તાવાર અખબારી યાદી અને સમાચાર ક્યાંથી મળશે?",
        questionEn: "Where to access official press releases and news?",
        answerGu: "વેબસાઇટના 'News & Media' વિભાગમાં જઈ આપ પક્ષની તાજી અખબારી યાદીઓ, પ્રેસ નોટ અને નિવેદનો વાંચી શકો છો.",
        answerEn: "Visit the 'News & Media' section on our portal to access press releases, official media statements, and party announcements.",
        featured: false,
        sortOrder: 17,
      },
      {
        slug: "faq-18-data-privacy-security",
        categorySlug: "security",
        questionGu: "મારી અંગત માહિતી અને ડેટાની સુરક્ષા કેવી રીતે થાય છે?",
        questionEn: "How is my personal information protected?",
        answerGu: "RAVP આપના ડેટાની ગોપનીયતાનું પૂર્ણ પાલન કરે છે. તમારો ડેટા સુરક્ષિત સર્વર પર એનક્રિપ્ટેડ સ્વરૂપે સ્ટોર થાય છે અને ક્યારેય તૃતીય પક્ષને વેચવામાં આવતો નથી.",
        answerEn: "RAVP strictly adheres to data protection guidelines. Personal information is encrypted and securely stored, and never shared or sold to third parties.",
        featured: false,
        sortOrder: 18,
      },
      {
        slug: "faq-19-contact-headquarters",
        categorySlug: "contact",
        questionGu: "પક્ષના મુખ્ય કાર્યાલય (રાજકોટ) નો સંપર્ક કેવી રીતે કરવો?",
        questionEn: "How to contact Party Headquarters in Rajkot?",
        answerGu: "મુખ્ય કાર્યાલય: ૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ - ૩૬૦૦૦૧. ફોન: 9016641851, ઇમેઇલ: info@rashtriyaannadatavikasparty.org.",
        answerEn: "Central Office: 336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot - 360001. Phone: 9016641851, Email: info@rashtriyaannadatavikasparty.org.",
        featured: true,
        sortOrder: 19,
      },
      {
        slug: "faq-20-further-assistance",
        categorySlug: "technical",
        questionGu: "વધુ માહિતી, માર્ગદર્શન અને સહાયતા માટે શું કરવું?",
        questionEn: "What to do for further information and assistance?",
        answerGu: "આપ અમારા 24x7 હેલ્પલાઇન નંબર 9016641851 પર કૉલ કરી શકો છો અથવા 'Contact Us' પેજ પરથી ઑનલાઇન મેસેજ મોકલી શકો છો.",
        answerEn: "Call our helpline at 9016641851 or send a direct query through our 'Contact Us' page. Our team is always ready to assist you.",
        featured: true,
        sortOrder: 20,
      },
    ];

    for (const f of rawFaqs) {
      const categoryId = categories[f.categorySlug] || categories["general"];
      await prisma.faq.create({
        data: {
          categoryId,
          questionGu: f.questionGu,
          questionEn: f.questionEn,
          answerGu: f.answerGu,
          answerEn: f.answerEn,
          featured: f.featured,
          published: true,
          sortOrder: f.sortOrder,
          slug: f.slug,
          metaTitle: f.questionEn,
          metaDescription: f.answerEn.substring(0, 150),
          keywords: "RAVP, FAQ, Gujarat, Farmer Party",
        },
      });
    }
    console.log("  ✅ 20 Bilingual FAQs created");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
