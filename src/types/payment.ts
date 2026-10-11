export interface PaymentConfig {
  // Nepal Bank Details (Domestic transfers, ConnectIPS, Mobile Banking)
  nepalBankName: string;
  nepalAccountNumber: string;
  nepalAccountHolder: string;
  nepalBranch: string;
  nepalSwiftCode?: string;

  // Stripe Details (Credit/Debit Cards, Apple Pay, Google Pay, International)
  stripePaymentLink: string;
  stripeAccountEmail?: string;

  // PayPal Details (Direct PayPal & PayPal.me)
  paypalEmail: string;
  paypalUsername: string;
  paypalMeUrl: string;

  // Australia Local Banking (For supporters & clients in Australia / NZ)
  australiaBankName?: string;
  australiaBsb?: string;
  australiaAccountNumber?: string;
  australiaAccountHolder?: string;
  australiaPayId?: string;

  // Contact & Notification
  supportPhone: string;
  supportEmail: string;
  notificationEmail: string;
  
  // Security
  adminPin: string;
  acceptingPayments: boolean;
  currencyAccepted: string[];
  updatedAt?: string;

  // Legacy/Optional personal wallet notes (if user ever wants personal eSewa)
  personalEsewaNumber?: string;
  personalKhaltiNumber?: string;
}

export type PaymentStatus = 'pending' | 'verified' | 'completed' | 'rejected';

export interface ReceivedPayment {
  id: string;
  receiptNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  servicePurpose: 'vedic_kundali' | 'temple_pooja' | 'gun_milan' | 'platform_support' | 'other' | string;
  serviceName: string;
  amount: number;
  currency: 'NPR' | 'USD' | 'AUD' | 'EUR' | 'GBP' | string;
  paymentMethod: 'stripe' | 'paypal' | 'nepal_bank' | 'aus_bank' | 'esewa' | 'other';
  transactionRef: string;
  notes?: string;
  status: PaymentStatus;
  createdAt: string;
  verifiedAt?: string;
}

export interface PaymentReceipt {
  receiptNumber: string;
  paymentId: string;
  date: string;
  payerName: string;
  payerPhone: string;
  payerEmail: string;
  amountFormatted: string;
  paymentMethod: string;
  transactionRef: string;
  purpose: string;
  notes?: string;
  verified: boolean;
}
