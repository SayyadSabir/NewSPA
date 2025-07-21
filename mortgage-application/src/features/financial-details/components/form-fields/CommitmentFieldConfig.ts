import { CommitmentType, CompletionStatus, FinancialCommitment } from '../../types';

// Define field visibility types
export type FieldVisibility = 'Y' | 'N' | 'C';

// Define all possible form fields
export type FieldName = 
  | 'balance'
  | 'monthlyPayment'
  | 'repaymentAmount'
  | 'notes'
  | 'includeInMortgage'
  | 'retirementAge'
  | 'termRemainingMonths'
  | 'termRemainingYears'
  | 'willMortgageRepayThis'
  | 'bulletPaymentAmount'
  | 'hasBulletPayment';

// Define field configuration interface
export interface FieldConfig {
  // Field visibility map
  fields: Record<FieldName, FieldVisibility>;
  
  // Field labels
  labels: Record<FieldName, string>;
  
  // Conditional logic for fields marked with 'C' visibility
  conditionalLogic: Array<{
    fieldName: FieldName;
    condition: (formValues: Partial<FinancialCommitment>) => boolean;
  }>;
}

// Default field labels
const defaultLabels: Record<FieldName, string> = {
  balance: 'Current balance (£)',
  monthlyPayment: 'Monthly payment (£)',
  repaymentAmount: 'Repayment amount (£)',
  notes: 'Additional notes',
  includeInMortgage: 'Include this commitment in the mortgage',
  retirementAge: 'Retirement Age',
  termRemainingMonths: 'Term remaining (months)',
  termRemainingYears: 'Term remaining (years)',
  willMortgageRepayThis: 'Will the new mortgage be used to repay this amount?',
  bulletPaymentAmount: 'Bullet payment amount (£)',
  hasBulletPayment: 'Does this contain a bullet payment?'
};

// Configuration for personal_loan
const personalLoanConfig: FieldConfig = {
  fields: {
    balance: 'Y',
    monthlyPayment: 'Y',
    repaymentAmount: 'C', // Conditional based on completion status
    notes: 'Y',
    includeInMortgage: 'Y',
    retirementAge: 'N',
    termRemainingMonths: 'C', // Conditional based on monthly payment vs balance
    termRemainingYears: 'C', // Conditional based on monthly payment vs balance
    willMortgageRepayThis: 'C', // Conditional based on completion status
    bulletPaymentAmount: 'N',
    hasBulletPayment: 'N'
  },
  labels: {
    ...defaultLabels,
    balance: 'Outstanding loan balance (£)',
    monthlyPayment: 'Monthly loan payment (£)'
  },
  conditionalLogic: [
    // Show term remaining fields if monthly payment is less than 20% of balance
    {
      fieldName: 'termRemainingMonths',
      condition: (formValues) => {
        const balance = formValues.balance || 0;
        const monthlyPayment = formValues.monthlyPayment || 0;
        return monthlyPayment > 0 && monthlyPayment < (balance * 0.2);
      }
    },
    {
      fieldName: 'termRemainingYears',
      condition: (formValues) => {
        const balance = formValues.balance || 0;
        const monthlyPayment = formValues.monthlyPayment || 0;
        return monthlyPayment > 0 && monthlyPayment < (balance * 0.2);
      }
    },
    // Show repayment amount if completion status is paid_in_full or lump_sum_payment
    {
      fieldName: 'repaymentAmount',
      condition: (formValues) => {
        return ['paid_in_full', 'lump_sum_payment'].includes(formValues.completionStatus as string);
      }
    },
    // Show willMortgageRepayThis if completion status is paid_in_full
    {
      fieldName: 'willMortgageRepayThis',
      condition: (formValues) => {
        return formValues.completionStatus === 'paid_in_full';
      }
    }
  ]
};

// Configuration for hire_purchase
const hirePurchaseConfig: FieldConfig = {
  fields: {
    balance: 'Y',
    monthlyPayment: 'Y',
    repaymentAmount: 'C', // Conditional based on completion status
    notes: 'Y',
    includeInMortgage: 'Y',
    retirementAge: 'N',
    termRemainingMonths: 'Y',
    termRemainingYears: 'Y',
    willMortgageRepayThis: 'C', // Conditional based on completion status
    bulletPaymentAmount: 'C', // Conditional based on hasBulletPayment field
    hasBulletPayment: 'Y'
  },
  labels: {
    ...defaultLabels,
    balance: 'Outstanding hire purchase balance (£)',
    monthlyPayment: 'Monthly payment (£)'
  },
  conditionalLogic: [
    // Show repayment amount if completion status is paid_in_full or lump_sum_payment
    {
      fieldName: 'repaymentAmount',
      condition: (formValues) => {
        return ['paid_in_full', 'lump_sum_payment'].includes(formValues.completionStatus as string);
      }
    },
    // Show willMortgageRepayThis if completion status is paid_in_full
    {
      fieldName: 'willMortgageRepayThis',
      condition: (formValues) => {
        return formValues.completionStatus === 'paid_in_full';
      }
    },
    // Show bulletPaymentAmount if hasBulletPayment is true
    {
      fieldName: 'bulletPaymentAmount',
      condition: (formValues) => {
        return formValues.hasBulletPayment === true;
      }
    },
    // Show term remaining fields if monthly payment is less than 20% of balance
    {
      fieldName: 'termRemainingMonths',
      condition: (formValues) => {
        const balance = formValues.balance || 0;
        const monthlyPayment = formValues.monthlyPayment || 0;
        return monthlyPayment > 0 && monthlyPayment < (balance * 0.2);
      }
    },
    {
      fieldName: 'termRemainingYears',
      condition: (formValues) => {
        const balance = formValues.balance || 0;
        const monthlyPayment = formValues.monthlyPayment || 0;
        return monthlyPayment > 0 && monthlyPayment < (balance * 0.2);
      }
    }
  ]
};

// Configuration for credit_card
const creditCardConfig: FieldConfig = {
  fields: {
    balance: 'Y',
    monthlyPayment: 'Y',
    repaymentAmount: 'C',
    notes: 'Y',
    includeInMortgage: 'Y',
    retirementAge: 'N',
    termRemainingMonths: 'N',
    termRemainingYears: 'N',
    willMortgageRepayThis: 'C',
    bulletPaymentAmount: 'N',
    hasBulletPayment: 'N'
  },
  labels: {
    ...defaultLabels,
    balance: 'Credit card balance (£)',
    monthlyPayment: 'Minimum monthly payment (£)'
  },
  conditionalLogic: [
    // Show repayment amount if completion status is paid_in_full or lump_sum_payment
    {
      fieldName: 'repaymentAmount',
      condition: (formValues) => {
        return ['paid_in_full', 'lump_sum_payment'].includes(formValues.completionStatus as string);
      }
    },
    // Show willMortgageRepayThis if completion status is paid_in_full
    {
      fieldName: 'willMortgageRepayThis',
      condition: (formValues) => {
        return formValues.completionStatus === 'paid_in_full';
      }
    }
  ]
};

// Configuration for student_loan
const studentLoanConfig: FieldConfig = {
  fields: {
    balance: 'Y',
    monthlyPayment: 'Y',
    repaymentAmount: 'C',
    notes: 'Y',
    includeInMortgage: 'Y',
    retirementAge: 'Y',
    termRemainingMonths: 'N',
    termRemainingYears: 'N',
    willMortgageRepayThis: 'C',
    bulletPaymentAmount: 'N',
    hasBulletPayment: 'N'
  },
  labels: {
    ...defaultLabels,
    balance: 'Student loan balance (£)',
    monthlyPayment: 'Monthly repayment (£)',
    retirementAge: 'Expected age of repayment'
  },
  conditionalLogic: [
    // Show repayment amount if completion status is paid_in_full or lump_sum_payment
    {
      fieldName: 'repaymentAmount',
      condition: (formValues) => {
        return ['paid_in_full', 'lump_sum_payment'].includes(formValues.completionStatus as string);
      }
    },
    // Show willMortgageRepayThis if completion status is paid_in_full
    {
      fieldName: 'willMortgageRepayThis',
      condition: (formValues) => {
        return formValues.completionStatus === 'paid_in_full';
      }
    }
  ]
};

// Configuration for overdraft
const overdraftConfig: FieldConfig = {
  fields: {
    balance: 'Y',
    monthlyPayment: 'Y',
    repaymentAmount: 'C',
    notes: 'Y',
    includeInMortgage: 'Y',
    retirementAge: 'N',
    termRemainingMonths: 'N',
    termRemainingYears: 'N',
    willMortgageRepayThis: 'C',
    bulletPaymentAmount: 'N',
    hasBulletPayment: 'N'
  },
  labels: {
    ...defaultLabels,
    balance: 'Overdraft amount (£)',
    monthlyPayment: 'Monthly payment (£)'
  },
  conditionalLogic: [
    // Show repayment amount if completion status is paid_in_full or lump_sum_payment
    {
      fieldName: 'repaymentAmount',
      condition: (formValues) => {
        return ['paid_in_full', 'lump_sum_payment'].includes(formValues.completionStatus as string);
      }
    },
    // Show willMortgageRepayThis if completion status is paid_in_full
    {
      fieldName: 'willMortgageRepayThis',
      condition: (formValues) => {
        return formValues.completionStatus === 'paid_in_full';
      }
    }
  ]
};

// Map of commitment types to their configurations
const commitmentConfigs: Partial<Record<CommitmentType, FieldConfig>> = {
  personal_loan: personalLoanConfig,
  hire_purchase: hirePurchaseConfig,
  credit_card: creditCardConfig,
  student_loan: studentLoanConfig,
  overdraft: overdraftConfig
};  

// Get the field configuration for a specific commitment type
export const getFieldConfig = (
  commitmentType: CommitmentType,
  completionStatus: CompletionStatus,
  formValues?: Partial<FinancialCommitment>
): FieldConfig => {
  // Get the configuration for the commitment type or use personal_loan as default
  const config = commitmentConfigs[commitmentType] || personalLoanConfig;
  
  // Return the configuration
  return config;
};

// Helper to determine if a field should be shown based on configuration and form values
export const shouldShowField = (
  fieldName: FieldName,
  config: FieldConfig,
  formValues?: Partial<FinancialCommitment>
): boolean => {
  // Get the visibility setting for this field
  const visibility = config.fields[fieldName];
  
  // If it's a simple Yes/No, return directly
  if (visibility === 'Y') return true;
  if (visibility === 'N') return false;
  
  // For conditional fields (C), check the conditions if form values are provided
  if (visibility === 'C' && formValues) {
    // Find any conditional logic that applies to this field
    const conditions = config.conditionalLogic.filter(logic => logic.fieldName === fieldName);
    
    // If no conditions are defined, default to not showing the field
    if (conditions.length === 0) return false;
    
    // Check if any condition is met
    return conditions.some(condition => condition.condition(formValues));
  }
  
  // Default to not showing if we can't determine
  return false;
};
