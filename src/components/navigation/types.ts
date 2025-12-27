export interface NavItem {
  id: string;
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
    description: string;
  }[];
}