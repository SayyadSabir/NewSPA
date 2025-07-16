import { CommitmentType, CompletionStatus } from '../../types';

// Define field requirements based on commitment type
export interface FieldConfig {
  showBalance: boolean;
  showMonthlyPayment: boolean;
  showRepaymentAmount: boolean;
  showAdditionalNotes: boolean;
  balanceLabel?: string;
  monthlyPaymentLabel?: string;
  repaymentAmountLabel?: string;
  notesLabel?: string;
}

// Base configuration that applies to most commitment types
const baseFieldConfig: FieldConfig = {
  showBalance: true,
  showMonthlyPayment: true,
  showRepaymentAmount: false,
  showAdditionalNotes: true,
  balanceLabel: 'Current balance (£)',
  monthlyPaymentLabel: 'Monthly payment (£)',
  notesLabel: 'Additional notes',
};

// Special configurations for specific commitment types
const commitmentTypeConfigs: Record<CommitmentType, FieldConfig> = {
  credit_card: {
    ...baseFieldConfig,
    balanceLabel: 'Current balance (£)',
  },
  store_card: {
    ...baseFieldConfig,
    balanceLabel: 'Current balance (£)',
  },
  buy_now_pay_later: {
    ...baseFieldConfig,
    balanceLabel: 'Remaining balance (£)',
  },
  catalogue_instalments: {
    ...baseFieldConfig,
    balanceLabel: 'Remaining balance (£)',
  },
  childcare_fees: {
    ...baseFieldConfig,
    balanceLabel: 'Total annual cost (£)',
    monthlyPaymentLabel: 'Monthly cost (£)',
  },
  credit_agreement: baseFieldConfig,
  guarantor_existing_borrowing: {
    ...baseFieldConfig,
    balanceLabel: 'Guaranteed amount (£)',
    monthlyPaymentLabel: 'Monthly payment if required (£)',
  },
  guarantor_rental_agreement: {
    ...baseFieldConfig,
    balanceLabel: 'Guaranteed amount (£)',
    monthlyPaymentLabel: 'Monthly payment if required (£)',
  },
  hire_purchase: baseFieldConfig,
  maintenance: {
    ...baseFieldConfig,
    balanceLabel: 'Total remaining obligation (£)',
  },
  overdraft: {
    ...baseFieldConfig,
    showMonthlyPayment: false,
    balanceLabel: 'Current overdraft amount (£)',
  },
  overdraft_secured: {
    ...baseFieldConfig,
    showMonthlyPayment: false,
    balanceLabel: 'Current overdraft amount (£)',
  },
  personal_loan: baseFieldConfig,
  point_of_sale_finance: baseFieldConfig,
  secured_personal_loan: baseFieldConfig,
  shared_equity_loan: {
    ...baseFieldConfig,
    balanceLabel: 'Loan amount (£)',
  },
  student_loan: {
    ...baseFieldConfig,
    balanceLabel: 'Outstanding balance (£)',
  },
  other: {
    ...baseFieldConfig,
    showAdditionalNotes: true,
    notesLabel: 'Please specify the type of commitment',
  },
};

// Define field requirements based on completion status
const completionStatusConfigs: Record<CompletionStatus, Partial<FieldConfig>> = {
  commitment_already_repaid: {
    showBalance: false,
    showMonthlyPayment: false,
    showRepaymentAmount: false,
  },
  lump_sum_payment: {
    showRepaymentAmount: true,
    repaymentAmountLabel: 'Amount to be repaid (£)',
  },
  paid_in_full: {
    showRepaymentAmount: true,
    repaymentAmountLabel: 'Amount to be repaid in full (£)',
  },
  nothing: {},
};

// Function to get the combined field configuration
export const getFieldConfig = (
  commitmentType: CommitmentType,
  completionStatus: CompletionStatus
): FieldConfig => {
  const typeConfig = commitmentTypeConfigs[commitmentType] || baseFieldConfig;
  const statusConfig = completionStatusConfigs[completionStatus] || {};
  
  return {
    ...typeConfig,
    ...statusConfig,
  };
};

// Helper to determine if a field should be shown based on configuration
export const shouldShowField = (
  fieldName: keyof FieldConfig,
  config: FieldConfig
): boolean => {
  return config[fieldName] === true;
};
