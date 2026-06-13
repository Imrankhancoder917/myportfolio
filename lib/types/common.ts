export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
