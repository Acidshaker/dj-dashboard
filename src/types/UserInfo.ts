export interface UserInfo {
  createdAt: string;
  email: string;
  events_remaining: number | null;
  first_name: string;
  last_name: string;
  isStripeVerified: boolean;
  is_demo: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  role: string;
  subscription_status: string | null;
  subscription_end: string | null;
  updatedAt: string;
  stripeAccountId: string | null;
}
