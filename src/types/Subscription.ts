export interface Subscription {
  id: string;
  planId: number;
  status: "active" | "inactive" | "cancelled"; // puedes ajustar según tus estados reales
  start_date: string; // ISO string
  end_date: string;
  renewal_date: string;
  events_remaining: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  plan: {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    days: number;
    events: number;
    price: number;
    is_demo: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
