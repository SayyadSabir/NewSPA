/**
 * Data transformation utilities for commitment form data
 * Follows SOLID principles with single responsibility for each transformer
 */

export interface CurrencyAmount {
  amount: number;
  currency: string;
}

export interface TermRemaining {
  'no-of-years': number;
  'no-of-months': number;
}

export interface ApiCommitmentData {
  id?: string; // Commitment ID
  'applicant-details': {
    'applicant-id': string;
    'applicant-name': string;
  };
  'type-of-commitment'?: string;
  'outstanding-balance'?: CurrencyAmount;
  'monthly-payment'?: CurrencyAmount;
  'commitment-amount-to-repaid'?: CurrencyAmount;
  'remaining-amount'?: CurrencyAmount;
  'commitment-before-completion'?: string;
  'bullet-payment-amount'?: CurrencyAmount;
  'repayment-amount'?: CurrencyAmount;
  notes?: string;
  'include-in-mortgage'?: boolean;
  'retirement-age'?: number;
  'term-remaining'?: TermRemaining;
  'has-bullet-payment'?: boolean;
  'completion-status'?: string;
}

/**
 * Maps API commitment type values (human readable) to form enum values
 */
const COMMITMENT_TYPE_MAPPING: Record<string, string> = {
  // API value -> Form value
  'Personal Loan': 'personal_loan',
  'Credit Card': 'credit_card',
  'Store Card': 'store_card',
  'Hire Purchase': 'hire_purchase',
  'HP': 'hire_purchase',
  'PCP': 'hire_purchase',
  'Student Loan': 'student_loan',
  'Maintenance': 'maintenance',
  'Child Maintenance': 'maintenance',
  'Overdraft': 'overdraft',
  'Buy Now Pay Later': 'buy_now_pay_later',
  'Catalogue Instalments': 'catalogue_instalments',
  'Childcare Fees': 'childcare_fees',
  'School Fees': 'childcare_fees',
  'Credit Agreement': 'credit_agreement',
  'Guarantor Existing Borrowing': 'guarantor_existing_borrowing',
  'Guarantor Rental Agreement': 'guarantor_rental_agreement',
  'Secured Personal Loan': 'secured_personal_loan',
  'Shared Equity Loan': 'shared_equity_loan',
  'Point of Sale Finance': 'point_of_sale_finance',
  'Other': 'other',
  // Also handle exact matches (for consistency)
  'personal_loan': 'personal_loan',
  'credit_card': 'credit_card',
  'hire_purchase': 'hire_purchase',
  'student_loan': 'student_loan',
  'maintenance': 'maintenance',
  'overdraft': 'overdraft'
};

/**
 * Maps form enum values back to API values (reverse mapping)
 */
const FORM_TO_API_TYPE_MAPPING: Record<string, string> = {
  'personal_loan': 'Personal Loan',
  'credit_card': 'Credit Card',
  'hire_purchase': 'Hire Purchase',
  'student_loan': 'Student Loan',
  'maintenance': 'Maintenance',
  'overdraft': 'Overdraft',
  'buy_now_pay_later': 'Buy Now Pay Later',
  'catalogue_instalments': 'Catalogue Instalments',
  'childcare_fees': 'Childcare Fees',
  'credit_agreement': 'Credit Agreement',
  'guarantor_existing_borrowing': 'Guarantor Existing Borrowing',
  'guarantor_rental_agreement': 'Guarantor Rental Agreement',
  'secured_personal_loan': 'Secured Personal Loan',
  'shared_equity_loan': 'Shared Equity Loan',
  'point_of_sale_finance': 'Point of Sale Finance',
  'other': 'Other'
};

/**
 * Configuration for field transformations
 * Maps form field names to API field names and specifies which fields need currency transformation
 */
const FIELD_MAPPING_CONFIG = {
  // Fields that need currency transformation (amount + currency)
  currencyFields: {
    balance: 'outstanding-balance',
    monthlyPayment: 'monthly-payment',
    repaymentAmount: 'commitment-amount-to-repaid',
    remainingAmount: 'remaining-amount',
    bulletPaymentAmount: 'bullet-payment-amount'
  },
  
  // Simple field mappings (direct value transfer)
  simpleFields: {
    type: 'type-of-commitment',
    completionStatus: 'commitment-before-completion',
    notes: 'notes',
    includeInMortgage: 'include-in-mortgage',
    retirementAge: 'retirement-age',
    hasBulletPayment: 'has-bullet-payment'
  },
  
  // Special composite fields that need custom transformation
  compositeFields: {
    termRemaining: {
      apiField: 'term-remaining',
      formFields: ['termRemainingMonths', 'termRemainingYears']
    }
  }
} as const;

/**
 * Default currency for all monetary fields
 */
const DEFAULT_CURRENCY = 'GBP';

/**
 * Transforms a numeric value into a currency amount object
 * @param amount - The numeric amount from the form
 * @param currency - The currency code (defaults to GBP)
 * @returns CurrencyAmount object or undefined if amount is invalid
 */
export const transformToCurrencyAmount = (
  amount: number | string | undefined,
  currency: string = DEFAULT_CURRENCY
): CurrencyAmount | undefined => {
  if (amount === undefined || amount === null || amount === '') {
    return undefined;
  }
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount) || numericAmount < 0) {
    return undefined;
  }
  
  return {
    amount: numericAmount,
    currency
  };
};

/**
 * Transforms term remaining months and years into a term remaining object
 * @param months - The number of months remaining
 * @param years - The number of years remaining
 * @returns TermRemaining object or undefined if both values are invalid
 */
export const transformToTermRemaining = (
  months: number | string | undefined,
  years: number | string | undefined
): TermRemaining | undefined => {
  const numericMonths = months !== undefined && months !== null && months !== '' 
    ? (typeof months === 'string' ? parseInt(months) : months) 
    : 0;
  
  const numericYears = years !== undefined && years !== null && years !== '' 
    ? (typeof years === 'string' ? parseInt(years) : years) 
    : 0;
  
  // Return undefined if both values are invalid or zero
  if ((isNaN(numericMonths) || numericMonths < 0) && (isNaN(numericYears) || numericYears < 0)) {
    return undefined;
  }
  
  // If only one value is valid, use it; otherwise use both
  return {
    'no-of-years': isNaN(numericYears) || numericYears < 0 ? 0 : numericYears,
    'no-of-months': isNaN(numericMonths) || numericMonths < 0 ? 0 : numericMonths
  };
};

/**
 * Transforms form data to API payload format
 * @param formData - Raw form data from react-hook-form
 * @param applicantDetails - Applicant information for the API
 * @returns Transformed data ready for API submission
 */
export const transformCommitmentFormDataToApi = (
  formData: Record<string, any>,
  applicantDetails: {
    applicantId: string;
    applicantName: string;
  }
): ApiCommitmentData => {
  const apiData: ApiCommitmentData = {
    'applicant-details': {
      'applicant-id': applicantDetails.applicantId,
      'applicant-name': applicantDetails.applicantName
    }
  };

  // Transform currency fields (only if they have meaningful values)
  Object.entries(FIELD_MAPPING_CONFIG.currencyFields).forEach(([formField, apiField]) => {
    const value = formData[formField];
    // Only include if value exists and is not zero/empty
    if (value !== undefined && value !== null && value !== '' && value !== 0) {
      const currencyAmount = transformToCurrencyAmount(value);
      if (currencyAmount) {
        (apiData as any)[apiField] = currencyAmount;
      }
    }
  });

  // Transform simple fields (only if they have meaningful values)
  Object.entries(FIELD_MAPPING_CONFIG.simpleFields).forEach(([formField, apiField]) => {
    const value = formData[formField];
    // Only include if value exists and is not empty/default
    if (value !== undefined && value !== null && value !== '' && 
        !(typeof value === 'boolean' && value === false)) {
      
      // Special handling for commitment type - map form value to API value
      if (formField === 'type' && typeof value === 'string') {
        const apiTypeValue = FORM_TO_API_TYPE_MAPPING[value] || value;
        (apiData as any)[apiField] = apiTypeValue;
      } else {
        (apiData as any)[apiField] = value;
      }
    }
  });

  // Transform composite fields (only if they have meaningful values)
  Object.entries(FIELD_MAPPING_CONFIG.compositeFields).forEach(([compositeKey, config]) => {
    if (compositeKey === 'termRemaining') {
      const months = formData['termRemainingMonths'];
      const years = formData['termRemainingYears'];
      
      // Only include if at least one value is meaningful (not empty, null, undefined, or 0)
      if ((months !== undefined && months !== null && months !== '' && months !== 0) ||
          (years !== undefined && years !== null && years !== '' && years !== 0)) {
        const termRemaining = transformToTermRemaining(months, years);
        if (termRemaining) {
          (apiData as any)[config.apiField] = termRemaining;
        }
      }
    }
  });

  return apiData;
};

/**
 * Transforms API data back to form format (for editing existing commitments)
 * @param apiData - Data from API response
 * @returns Form data compatible with react-hook-form
 */
export const transformApiDataToForm = (apiData: ApiCommitmentData): Record<string, any> => {
  const formData: Record<string, any> = {};

  // Transform currency fields back to simple numbers
  Object.entries(FIELD_MAPPING_CONFIG.currencyFields).forEach(([formField, apiField]) => {
    const currencyAmount = (apiData as any)[apiField] as CurrencyAmount | undefined;
    if (currencyAmount?.amount !== undefined) {
      formData[formField] = currencyAmount.amount;
    }
  });

  // Transform simple fields back
  Object.entries(FIELD_MAPPING_CONFIG.simpleFields).forEach(([formField, apiField]) => {
    const value = (apiData as any)[apiField];
    if (value !== undefined) {
      // Special handling for commitment type - map API value to form value
      if (formField === 'type' && typeof value === 'string') {
        const formTypeValue = COMMITMENT_TYPE_MAPPING[value] || value;
        formData[formField] = formTypeValue;
      } else {
        formData[formField] = value;
      }
    }
  });

  // Transform composite fields back
  Object.entries(FIELD_MAPPING_CONFIG.compositeFields).forEach(([compositeKey, config]) => {
    if (compositeKey === 'termRemaining') {
      const termRemaining = (apiData as any)[config.apiField] as TermRemaining | undefined;
      if (termRemaining) {
        formData['termRemainingMonths'] = termRemaining['no-of-months'];
        formData['termRemainingYears'] = termRemaining['no-of-years'];
      }
    }
  });

  return formData;
};

/**
 * Validates that required currency fields have valid amounts
 * @param formData - Form data to validate
 * @param requiredFields - Array of field names that are required
 * @returns Array of validation errors
 */
export const validateCurrencyFields = (
  formData: Record<string, any>,
  requiredFields: string[] = []
): string[] => {
  const errors: string[] = [];

  requiredFields.forEach(field => {
    const amount = formData[field];
    if (amount === undefined || amount === null || amount === '') {
      errors.push(`${field} is required`);
    } else {
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (isNaN(numericAmount) || numericAmount < 0) {
        errors.push(`${field} must be a valid positive number`);
      }
    }
  });

  return errors;
};
