export interface Bot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'restarting' | 'error';
  uptime?: string; // e.g., "2 days", "5 hours"
  lastActivity?: string; // e.g., "2 minutes ago"
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string; // e.g., "$10/month"
  userbotSlotsDescription: string; // e.g., "1 Userbot Slot", "Scalable Slots"
  features: string[];
  highlight?: boolean;
  cta: string; // Call to action text e.g. "Get Started" or "Current Plan"
}

export interface Subscription extends PricingPlan {
  subscribedOn: string; // Date string
  renewsOn?: string; // Date string
  isActive: boolean;
}
