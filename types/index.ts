export interface User {
  id: number;
  clerk_id: string;
  email: string;
  first_name?: string;
  is_pro: boolean;
  created_at: string;
}

export interface Batch {
  id: number;
  user_id: number;
  name: string;
  start_date_f1: string;
  end_date_f1?: string;
  tea_type?: string;
  sugar_grams?: number;
  status: 'F1' | 'F2' | 'Completed';
  created_at: string;
}

export interface Bottle {
  id: number;
  batch_id: number;
  bottling_date: string;
  flavor_ingredients?: string;
  status: 'F2' | 'Consumed';
  created_at: string;
}

export interface TastingNote {
  id: number;
  bottle_id: number;
  tasting_date: string;
  fizz_rating: number;
  sweetness_rating: number;
  tartness_rating: number;
  notes?: string;
  overall_rating: number;
  created_at: string;
}
