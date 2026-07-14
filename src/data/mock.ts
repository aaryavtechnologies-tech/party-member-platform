import { NavItem, StatItem, Resolution, CoreValue, Policy } from './types';

export const mainNav: NavItem[] = [
  { labelKey: 'home', href: '/' },
  { labelKey: 'about', href: '/about' },
  { labelKey: 'policies', href: '/policies' },
  { labelKey: 'organization', href: '/organization' },
  { labelKey: 'membership', href: '/membership' },
  { labelKey: 'media', href: '/media' },
  { labelKey: 'contact', href: '/contact' },
];

export const statistics: StatItem[] = [
  { id: '1', labelKey: 'Members', value: 1500000, icon: 'Users' },
  { id: '2', labelKey: 'Volunteers', value: 500000, icon: 'HandHeart' },
  { id: '3', labelKey: 'Districts', value: 750, icon: 'Map' },
  { id: '4', labelKey: 'Villages', value: 600000, icon: 'Home' },
  { id: '5', labelKey: 'Campaigns', value: 1200, icon: 'Flag' },
];

export const coreValues: CoreValue[] = [
  { id: '1', titleKey: 'Transparency', icon: 'Eye' },
  { id: '2', titleKey: 'Unity', icon: 'Users' },
  { id: '3', titleKey: 'Service', icon: 'Heart' },
  { id: '4', titleKey: 'Integrity', icon: 'ShieldCheck' },
  { id: '5', titleKey: 'Innovation', icon: 'Lightbulb' },
  { id: '6', titleKey: 'Empowerment', icon: 'Zap' },
];

export const policies: Policy[] = [
  { id: '1', titleKey: 'Farmer Policy', descriptionKey: 'Empowering agriculture and rural development.', icon: 'Wheat', href: '/policies/farmer' },
  { id: '2', titleKey: 'Youth Policy', descriptionKey: 'Creating opportunities for the next generation.', icon: 'GraduationCap', href: '/policies/youth' },
  { id: '3', titleKey: 'Women Policy', descriptionKey: 'Ensuring equality and empowerment.', icon: 'UserCircle', href: '/policies/women' },
  { id: '4', titleKey: 'Education Policy', descriptionKey: 'Quality education for every citizen.', icon: 'BookOpen', href: '/policies/education' },
  { id: '5', titleKey: 'Health Policy', descriptionKey: 'Accessible healthcare facilities nationwide.', icon: 'Activity', href: '/policies/health' },
  { id: '6', titleKey: 'Environment Policy', descriptionKey: 'Sustainable growth and green initiatives.', icon: 'Leaf', href: '/policies/environment' },
];

export const faqs = [
  { question: "How can I join the organization?", answer: "You can join by clicking on the 'Become Member' button and filling out the registration form." },
  { question: "Are there any membership fees?", answer: "Basic membership is free for all citizens who share our vision." },
  { question: "How can I volunteer in my district?", answer: "Once registered, you will be assigned to your local district committee based on your pin code." },
  { question: "What is Vision 2047?", answer: "Vision 2047 is our comprehensive roadmap to make India a developed nation by the 100th year of independence." },
];
