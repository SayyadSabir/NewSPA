import React from 'react';
import { useForm, Controller, UseFormRegister, UseFormWatch, UseFormSetValue, UseFormGetValues, FieldErrors } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { CommitmentType, CompletionStatus } from '../../types';

import { FieldConfig, FieldName } from './CommitmentFieldConfig';
import { RetirementAgeField } from './RetirementAgeField';

// Define options inline since the import is causing issues
const commitmentTypeOptions: { value: CommitmentType; label: string }[] = [
  { value: 'credit_card', label: 'Credit card / store card' },
  { value: 'buy_now_pay_later', label: 'Buy now, pay later instalments' },
  { value: 'catalogue_instalments', label: 'Catalogue instalments' },
  { value: 'childcare_fees', label: 'Childcare or school fees' },
  { value: 'credit_agreement', label: 'Credit agreement' },
  { value: 'guarantor_existing_borrowing', label: 'Guarantor on existing borrowing' },
  { value: 'guarantor_rental_agreement', label: 'Guarantor on rental agreement' },
  { value: 'hire_purchase', label: 'Hire purchase (HP) or personal contract purchase (PCP)' },
  { value: 'maintenance', label: 'Maintenance for ex-partner or child' },
  { value: 'overdraft', label: 'Overdraft' },
  { value: 'overdraft_secured', label: 'Overdraft secured against investment portfolio' },
  { value: 'personal_loan', label: 'Personal loan or point-of-sale finance' },
  { value: 'secured_personal_loan', label: 'Secured personal loan' },
  { value: 'shared_equity_loan', label: 'Shared equity loan for another property' },
  { value: 'student_loan', label: 'Student loan' },
  { value: 'other', label: 'Other regular payments' },
];

const completionStatusOptions: { value: CompletionStatus; label: string }[] = [
  { value: 'commitment_already_repaid', label: 'Commitment already repaid' },
  { value: 'lump_sum_payment', label: 'Lump sum payment' },
  { value: 'paid_in_full', label: 'Paid in full' },
  { value: 'nothing', label: 'Nothing' },
];

// Common props for form field components
interface FormFieldProps {
  register: UseFormRegister<any>;
  watch?: UseFormWatch<any>;
  errors?: FieldErrors;
  fieldConfig?: FieldConfig;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
}

// Type selector component
export const TypeSelector: React.FC<FormFieldProps> = ({ register, watch, errors, setValue }) => {
  const selectedType = watch ? watch('type') : '';
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue && setValue('type', event.target.value);
  };
  
  return (
    <Grid item xs={12}>
      <FormControl fullWidth error={!!errors?.type}>
        <FormLabel>Select the type of commitment</FormLabel>
        <TextField
          select
          value={selectedType || ''}
          onChange={handleChange}
          error={!!errors?.type}
          helperText={errors?.type?.message?.toString()}
        >
          {commitmentTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <input 
          type="hidden" 
          {...register("type", { required: 'Type is required' })}
          value={selectedType || ''}
        />
      </FormControl>
    </Grid>
  );
};

// Balance field component
export const BalanceField: React.FC<FormFieldProps> = ({ register, errors, fieldConfig, getValues }) => {
  const selectedType = getValues ? getValues('type') : '';
  // Determine if we need to show extra text based on commitment type
  const getHelperText = () => {
    if (errors.balance?.message) {
      return errors.balance.message.toString();
    }
    
    if (selectedType === 'hire_purchase') {
      return 'For hire purchase, include the total outstanding balance including any final payment.';
    }
    
    return '';
  };

  return (
    <Grid item xs={12} md={6}>
      <TextField
        {...register("balance", { 
          required: 'Balance is required',
          min: { value: 0, message: 'Balance must be at least 0' }
        })}
        label={fieldConfig.labels.balance || 'Balance (£)'}
        type="number"
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
        }}
        error={!!errors.balance}
        helperText={getHelperText()}
      />
    </Grid>
  );
};

// Monthly payment field component
export const MonthlyPaymentField: React.FC<FormFieldProps> = ({ register, errors, fieldConfig }) => {
  return (
    <Grid item xs={12} md={6}>
      <TextField
        {...register("monthlyPayment", { 
          required: 'Monthly payment is required',
          min: { value: 0, message: 'Monthly payment must be at least 0' }
        })}
        label={fieldConfig.labels.monthlyPayment || 'Monthly payment (£)'}
        type="number"
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
        }}
        error={!!errors.monthlyPayment}
        helperText={errors.monthlyPayment?.message?.toString()}
      />
    </Grid>
  );
};

// Completion status selector component
export const CompletionStatusSelector: React.FC<FormFieldProps> = ({ register, watch, errors, setValue }) => {
  const completionStatus = watch ? watch('completionStatus') : '';
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue && setValue('completionStatus', event.target.value);
  };
  
  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" error={!!errors?.completionStatus}>
        <FormLabel component="legend">
          What will happen to this commitment by the time this mortgage completes?
        </FormLabel>
        <RadioGroup 
          value={completionStatus} 
          onChange={handleChange}
          row
        >
          {completionStatusOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        <input 
          type="hidden" 
          {...register("completionStatus", { 
            required: 'Please select what will happen to this commitment' 
          })} 
          value={completionStatus || ''}
        />
        {errors?.completionStatus && (
          <FormHelperText error>
            {errors.completionStatus.message?.toString()}
          </FormHelperText>
        )}
      </FormControl>
    </Grid>
  );
};

// Repayment amount field component
export const RepaymentAmountField: React.FC<FormFieldProps> = ({ register, errors, fieldConfig }) => {
  return (
    <Grid item xs={12} md={6}>
      <TextField
        {...register("repaymentAmount", { 
          required: 'Repayment amount is required',
          min: { value: 0, message: 'Repayment amount must be at least 0' }
        })}
        label={fieldConfig.labels.repaymentAmount || 'Repayment amount (£)'}
        type="number"
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
        }}
        error={!!errors.repaymentAmount}
        helperText={errors.repaymentAmount?.message?.toString()}
      />
    </Grid>
  );
};

// Notes field component
export const NotesField: React.FC<FormFieldProps> = ({ register, errors, fieldConfig }) => {
  return (
    <Grid item xs={12}>
      <TextField
        {...register("notes")}
        label={fieldConfig.labels.notes || 'Additional notes'}
        multiline
        rows={2}
        fullWidth
        error={!!errors.notes}
        helperText={errors.notes?.message?.toString()}
      />
    </Grid>
  );
};

// Include in mortgage checkbox
export const IncludeInMortgageField: React.FC<FormFieldProps> = ({ register, watch, errors, fieldConfig }) => {
  const includeInMortgage = watch ? watch('includeInMortgage') : false;
  
  return (
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            {...register("includeInMortgage")}
            checked={!!includeInMortgage}
            color="primary"
          />
        }
        label={fieldConfig.labels.includeInMortgage || "Include this commitment in the mortgage"}
      />
    </Grid>
  );
};

// Re-export RetirementAgeField for use in forms
export { RetirementAgeField };
