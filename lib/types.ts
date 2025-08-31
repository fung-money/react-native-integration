
// Common payment result interface
export interface PaymentResult {
  id: string;
  status: string;
  action?: string;
  details?: {
    url?: string;
  };
}

// Payment method type for the shared handler
export type PaymentMethodType = 'wallet' | 'card';