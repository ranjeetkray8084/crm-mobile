export interface Lead {
  id?: string;
  leadId?: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  budget?: string | number | { min?: number; max?: number; amount?: number; value?: number };
  requirement?: string;
  location?: string;
  source: string;
  createdAt: string;
  assignedTo?: {
    name: string;
  };
  assignedToSummary?: {
    name: string;
  };
  assignToName?: string;
  createdBy?: {
    name: string;
  };
  createdByName?: string;
}
