export interface IBpmApplicationPurposeState {
  withFood?: boolean;
  annualPayment?: number;
  activityTypeId?: string;
  loanPurposeId?: string;
  projectDescription?: string;
  purposeDescription?: string;
}

export interface IBpmApplicationConditionState {
  amount?: number;
  duration?: number;
  transh?: number;
  method?: number;
  periodOd?: number;
  periodPercent?: number;
  paymentOd?: number;
  paymentPercent?: number;
  paymentDay?: number;
  planId?: string;
}
