export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
};

export type Review = {
  id: string;
  project_id: string;
  client_name: string;
  quote: string;
  rating: number | null;
  created_at: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  client_id: string | null;
  completed_date: string | null;
  duration: string | null;
  live_link: string | null;
  is_live: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // optional joined data
  client?: Client;
  images?: ProjectImage[];
  reviews?: Review[];
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  sort_order: number;
};

export type Education = {
  id: string;
  institute: string;
  qualification: string | null;
  start_date: string;
  end_date: string | null;
  details: string | null;
  sort_order: number;
};

export type Profile = {
  id: number;
  bio: string | null;
  photo_url: string | null;
  skills: string[];
  cv_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: Record<string, string>;
  updated_at: string;
};
