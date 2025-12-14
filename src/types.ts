export interface NavItem {
  label: string;
  path: string;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  category: string;
  image: string;
  marginTop?: boolean;
  marginTopInverse?: boolean;
}

export interface BlogPost {
  id?: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt?: string;
  content?: string;
}

export interface ServiceTier {
  id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
  features?: string[]; // Optional array of strings for feature list
}
