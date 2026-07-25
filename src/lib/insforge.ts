import { createClient } from '@insforge/sdk';

// Create a singleton browser client for client-side components
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://placeholder.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'placeholder'
});

// Database types based on the schema
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string | null;
          cover_image: string | null;
          images: string[] | null;
          demo_url: string | null;
          github_url: string | null;
          tags: string[];
          featured: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
      site_settings: {
        Row: {
          id: string;
          avatar_url: string | null;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
      work_experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          date_range: string;
          achievements: string[];
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['work_experience']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['work_experience']['Insert']>;
      };
      skills: {
        Row: {
          id: string;
          category: string;
          name: string;
          level: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['skills']['Insert']>;
      };
    };
  };
};

// Typed helper
export type Project = Database['public']['Tables']['projects']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type WorkExperience = Database['public']['Tables']['work_experience']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
