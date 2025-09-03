
// Common payment result interface
export interface PaymentResult {
  id: string;
  status: string;
  action?: string;
  details?: {
    url?: string;
  };
}