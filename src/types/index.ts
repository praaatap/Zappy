export interface AvailableApp {
  id: string;
  name: string;
  image: string;
}

export interface ZapStep {
  id: string;        // e.g., "webhook"
  uniqueId: string;  // e.g., "random-uuid-123"
  name: string;      // e.g., "Webhook"
  image: string;
  type: "Trigger" | "Action";
}