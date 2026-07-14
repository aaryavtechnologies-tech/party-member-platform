export interface NavItem {
  labelKey: string;
  href: string;
  children?: NavItem[];
}

export interface StatItem {
  id: string;
  labelKey: string;
  value: number;
  icon: string;
}

export interface Resolution {
  id: string;
  titleKey: string;
  summaryKey: string;
  contentKey: string;
}

export interface CoreValue {
  id: string;
  titleKey: string;
  icon: string;
}

export interface Policy {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  href: string;
}
