/**
 * Navigation item for the main menu.
 */
export interface NavItem {
  label: string;
  path: string;
}

/**
 * Represents a portfolio item in the 'portfolio' table.
 */
export interface PortfolioItem {
  id?: string;
  title: string;
  category: string;
  image: string;
  /** Controls top margin for masonry layout effect */
  marginTop?: boolean;
  /** Controls inverse top margin for masonry layout effect */
  marginTopInverse?: boolean;
  created_at?: string;
}

/**
 * Represents a blog post in the 'blog' table.
 */
export interface BlogPost {
  id?: string;
  title: string;
  category: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  image: string;
  excerpt?: string;
  /** Full HTML content of the post */
  content?: string;
  /** Publication status. Database default is 'Draft'. */
  status?: 'Draft' | 'Published';
  tags?: string[];
  created_at?: string;
}

/**
 * Represents a service package in the 'services' table.
 */
export interface ServiceTier {
  id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
  features?: string[];
  created_at?: string;
}

/**
 * Represents a user comment on a blog post in the 'comments' table.
 */
export interface Comment {
  id?: string;
  author_name: string;
  author_email: string;
  content: string;
  /** Moderation status. Database default is 'pending'. */
  status?: 'pending' | 'approved' | 'rejected';
  /** Foreign key to the blog post */
  post_id: string;
  created_at?: string;
}

/**
 * Represents a client testimonial in the 'testimonials' table.
 */
export interface Testimonial {
  id?: string;
  client_name: string;
  /** Optional subtitle, e.g., role or service type */
  subtitle?: string;
  quote: string;
  /** Rating from 1 to 5 */
  rating: number;
  image_url?: string;
  /** Order for display sorting */
  display_order?: number;
  created_at?: string;
}

/**
 * Represents a contact form submission in the 'contact_submissions' table.
 */
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  date_preference?: string;
  shoot_type: string;
  message?: string;
  /** Submission status. Database default is 'new'. */
  status?: string;
  created_at?: string;
}

/**
 * Global site configuration stored in the 'settings' table.
 * Restricted to a single row with ID 1.
 */
export interface Settings {
  id?: number;
  site_title?: string;
  site_description?: string;
  logo_url?: string;
  hero_image_url?: string;
  avatar_url?: string;
  favicon_url?: string;
  about_photo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address_street?: string;
  contact_address_city?: string;
  contact_address_state?: string;
  contact_address_zip?: string;
  /** JSON object for social media links (e.g., Facebook, Instagram) */
  social_links?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}
