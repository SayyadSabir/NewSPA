import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { CommitmentType, CompletionStatus } from '../../types';

import { FieldConfig } from './CommitmentFieldConfig';
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

interface FormFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  fieldConfig: FieldConfig;
}

// Type selector component
export const TypeSelector: React.FC<FormFieldProps> = ({ control, errors }) => {
  return (
    <Grid item xs={12}>
      <Controller
        name="type"
        control={control}
        rules={{ required: 'Type is required' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.type}>
            <FormLabel>Select the type of commitment</FormLabel>
            <TextField
              {...field}
              select
              error={!!errors.type}
              helperText={errors.type?.message?.toString()}
            >
              {commitmentTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        )}
      />
    </Grid>
  );
};

// Balance field component
export const BalanceField: React.FC<FormFieldProps> = ({ control, errors, fieldConfig }) => {
  return (
    <Grid item xs={12} md={6}>
      <Controller
        name="balance"
        control={control}
        rules={{ 
          required: 'Balance is required',
          min: { value: 0, message: 'Balance must be at least 0' }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={fieldConfig.balanceLabel || 'Balance (£)'}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            error={!!errors.balance}
            helperText={errors.balance?.message?.toString()}
          />
        )}
      />
    </Grid>
  );
};

// Monthly payment field component
export const MonthlyPaymentField: React.FC<FormFieldProps> = ({ control, errors, fieldConfig }) => {
  return (
    <Grid item xs={12} md={6}>
      <Controller
        name="monthlyPayment"
        control={control}
        rules={{ 
          min: { value: 0, message: 'Monthly payment must be at least 0' }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={fieldConfig.monthlyPaymentLabel || 'Monthly payment (£)'}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            error={!!errors.monthlyPayment}
            helperText={errors.monthlyPayment?.message?.toString()}
          />
        )}
      />
    </Grid>
  );
};

// Completion status selector component
export const CompletionStatusSelector: React.FC<FormFieldProps> = ({ control, errors }) => {
  return (
    <Grid item xs={12}>
      <Controller
        name="completionStatus"
        control={control}
        rules={{ required: 'Please select what will happen to this commitment' }}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.completionStatus}>
            <FormLabel component="legend">
              What will happen to this commitment by the time this mortgage completes?
            </FormLabel>
            <RadioGroup {...field} row>
              {completionStatusOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {errors.completionStatus && (
              <FormHelperText error>
                {errors.completionStatus.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Grid>
  );
};

// Repayment amount field component
export const RepaymentAmountField: React.FC<FormFieldProps> = ({ control, errors, fieldConfig }) => {
  return (
    <Grid item xs={12} md={6}>
      <Controller
        name="repaymentAmount"
        control={control}
        rules={{ 
          required: 'Repayment amount is required',
          min: { value: 0, message: 'Repayment amount must be at least 0' }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={fieldConfig.repaymentAmountLabel || 'Repayment amount (£)'}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            error={!!errors.repaymentAmount}
            helperText={errors.repaymentAmount?.message?.toString()}
          />
        )}
      />
    </Grid>
  );
};

// Notes field component
export const NotesField: React.FC<FormFieldProps> = ({ control, errors, fieldConfig }) => {
  return (
    <Grid item xs={12}>
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={fieldConfig.notesLabel || 'Additional notes'}
            multiline
            rows={2}
            fullWidth
            error={!!errors.notes}
            helperText={errors.notes?.message?.toString()}
          />
        )}
      />
    </Grid>
  );
};

// Include in mortgage checkbox
export const IncludeInMortgageField: React.FC<FormFieldProps> = ({ control }) => {
  return (
    <Grid item xs={12}>
      <Controller
        name="includeInMortgage"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Radio
                checked={field.value === true}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Include this commitment in the mortgage"
          />
        )}
      />
    </Grid>
  );
};

// Re-export RetirementAgeField for use in forms
export { RetirementAgeField };
