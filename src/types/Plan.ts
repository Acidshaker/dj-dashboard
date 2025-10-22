export interface Plan {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  days: number | null;
  events: number | null;
  price: number;
  is_demo: boolean;
  createdAt: string;
  updatedAt: string;
}
