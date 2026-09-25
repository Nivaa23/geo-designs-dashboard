export type InquiryChannel =
  | 'Online Quotations'
  | 'GEM / Website / Portal'
  | 'Tenders'
  | 'Verbal Inquiries'
  | 'Mail Inquiries';

export type InquiryStatus =
  | 'Pending Action'
  | 'Under Review'
  | 'Quotation Sent'
  | 'Converted';

export type InquiryUrgency = 'High' | 'Medium' | 'Normal';

export interface DetailedInquiryItem {
  id: string;
  code: string;
  title: string;
  clientName: string;
  channel: InquiryChannel;
  status: InquiryStatus;
  urgency: InquiryUrgency;
  dateReceived: string;
  timestamp: number; // for sorting
  estimatedValue: string;
  numericalValue: number; // for sorting
  quotationRef?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  scopeDescription: string;
  remarks?: string;
}
