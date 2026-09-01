/**
 * Supabase Database Types — auto-generated schema definitions.
 * Replace this file with the output of `supabase gen types typescript` after
 * connecting to your project.
 *
 * Until then this manual definition drives the typed SupabaseClient<Database>.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "admin" | "customer";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: "admin" | "customer";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          brand: string;
          price: number;
          original_price: number | null;
          category: string;
          description: string;
          specs: Json;
          image: string | null;
          stock: number;
          rating: number;
          reviews_count: number;
          badge: string | null;
          is_new_arrival: boolean;
          is_top_selling: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          price: number;
          original_price?: number | null;
          category: string;
          description: string;
          specs?: Json;
          image?: string | null;
          stock?: number;
          rating?: number;
          reviews_count?: number;
          badge?: string | null;
          is_new_arrival?: boolean;
          is_top_selling?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_identification: string;
          customer_address: string;
          municipality_code: string;
          status: "pending" | "processing" | "completed" | "cancelled";
          payment_method: string;
          payment_status: "pending" | "processing" | "approved" | "rejected";
          subtotal: number;
          tax_amount: number;
          total: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_identification: string;
          customer_address: string;
          municipality_code: string;
          status?: "pending" | "processing" | "completed" | "cancelled";
          payment_method: string;
          payment_status?: "pending" | "processing" | "approved" | "rejected";
          subtotal: number;
          tax_amount: number;
          total: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: number;
          quantity: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: number;
          quantity: number;
          subtotal: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          order_id: string;
          factus_number: string;
          reference_code: string;
          cufe: string;
          is_validated: boolean;
          validated_at: string | null;
          qr_url: string | null;
          public_url: string | null;
          total: number;
          customer_name: string;
          customer_email: string;
          customer_identification: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          factus_number: string;
          reference_code: string;
          cufe: string;
          is_validated?: boolean;
          validated_at?: string | null;
          qr_url?: string | null;
          public_url?: string | null;
          total: number;
          customer_name: string;
          customer_email: string;
          customer_identification: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "admin" | "customer";
      order_status: "pending" | "processing" | "completed" | "cancelled";
      payment_status: "pending" | "processing" | "approved" | "rejected";
    };
  };
}
