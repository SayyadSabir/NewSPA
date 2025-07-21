export type CommitmentType = 
  | 'credit_card' 
  | 'store_card' 
  | 'buy_now_pay_later' 
  | 'catalogue_instalments' 
  | 'childcare_fees' 
  | 'credit_agreement'
  | 'guarantor_existing_borrowing'
  | 'guarantor_rental_agreement'
  | 'hire_purchase'
  | 'maintenance'
  | 'overdraft'
  | 'overdraft_secured'
  | 'personal_loan'
  | 'point_of_sale_finance'
  | 'secured_personal_loan'
  | 'shared_equity_loan'
  | 'student_loan'
  | 'other';

export type CompletionStatus = 
  | 'commitment_already_repaid' 
  | 'lump_sum_payment' 
  | 'paid_in_full' 
  | 'nothing';

export interface FinancialCommitment {
  id: string;
  type: CommitmentType;
  balance: number;
  monthlyPayment?: number;
  completionStatus: CompletionStatus;
  repaymentAmount?: number;
  notes?: string;
  includeInMortgage?: boolean;
  retirementAge?: number;
  termRemainingMonths?: number;
  termRemainingYears?: number;
  willMortgageRepayThis?: boolean;
  bulletPaymentAmount?: number;
  hasBulletPayment?: boolean;
}

export interface FinancialCommitmentsState {
  commitments: FinancialCommitment[];
  isLoading: boolean;
  error: string | null;
}
