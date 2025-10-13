import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { DevTool } from '@hookform/devtools';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { FinancialCommitment, CommitmentType, CompletionStatus } from '../types';
// Import our new modular components and configuration
import { getFieldConfig, shouldShowField, FieldName } from './form-fields/CommitmentFieldConfig';
import {
  TypeSelector,
  BalanceField,
  MonthlyPaymentField,
  CompletionStatusSelector,
  RepaymentAmountField,
  NotesField,
  IncludeInMortgageField,
  RetirementAgeField
} from './form-fields/CommitmentFormFields';

interface CommitmentFormProps {
  onAddCommitment: (commitment: Omit<FinancialCommitment, 'id'>) => void;
  existingCommitment?: FinancialCommitment;
  onUpdateCommitment?: (commitment: FinancialCommitment) => void;
  onCancel?: () => void;
  currentCommitmentCount?: number;
}
export interface CommitmentFormRef {
  validateForm: () => Promise<boolean>;
  hasUnsavedChanges: () => boolean;
}

const CommitmentForm = forwardRef<CommitmentFormRef, CommitmentFormProps>((props, ref) => {
  const {
    onAddCommitment,
    existingCommitment,
    onUpdateCommitment,
    onCancel,
    currentCommitmentCount = 0,
  } = props;
  const isEditing = !!existingCommitment;
  
  const { register, handleSubmit, watch, formState: { errors, isDirty }, setValue, reset, control, getValues, trigger } = useForm<any>({
    defaultValues: existingCommitment || {},
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Reset form when existingCommitment changes
  useEffect(() => {
    if (existingCommitment) {
      reset(existingCommitment);
    }
  }, [existingCommitment, reset]);

  // Watch for changes in type and completion status to dynamically update the form
  const selectedType = watch('type') as CommitmentType;
  const completionStatus = watch('completionStatus') as CompletionStatus;
  const monthlyPayment = watch('monthlyPayment');
  const balance = watch('balance');
  const hasBulletPayment = watch('hasBulletPayment');
  const formValuesForConditionals = React.useMemo(() => ({
    type: selectedType,
    completionStatus,
    monthlyPayment,
    balance,
    hasBulletPayment,
  }), [selectedType, completionStatus, monthlyPayment, balance, hasBulletPayment]);
  
  // Get the field configuration based on the selected type and completion status
  const fieldConfig = React.useMemo(() => {
    return getFieldConfig(selectedType, completionStatus, formValuesForConditionals);
  }, [selectedType, completionStatus, formValuesForConditionals]);
  
  // Reset fields that are no longer applicable when type or completion status changes
  useEffect(() => {
    // Define all field names to check
    const fieldNames: FieldName[] = [
      'balance',
      'monthlyPayment',
      'repaymentAmount',
      'notes',
      'includeInMortgage',
      'retirementAge',
      'termRemainingMonths',
      'termRemainingYears',
      'willMortgageRepayThis'
    ];
    
    // For each field, check if it should be shown
    fieldNames.forEach(fieldName => {
      // If field should not be shown, reset its value in case shown  before
      if (!shouldShowField(fieldName, fieldConfig, formValuesForConditionals)) {
        if (fieldName === 'balance') {
          setValue('balance', 0);
        } else if (fieldName === 'includeInMortgage') {
          setValue('includeInMortgage', false);
        } else if (fieldName === 'retirementAge') {
          setValue('retirementAge', 65);
        } else if (fieldName === 'notes') {
          setValue('notes', '');
        } else {
          setValue(fieldName, undefined);
        }
      }
    });
  }, [selectedType, completionStatus, fieldConfig, setValue, formValuesForConditionals]);

  // Check if all visible required fields are filled
  const isFormComplete = React.useMemo(() => {
    const currentValues = getValues();
    
    // Must have a type selected
    if (!currentValues.type) {
      return false;
    }
    
    // Must have completion status
    if (!currentValues.completionStatus) {
      return false;
    }
    
    // Define validation rules for different field types
    const fieldValidators: Record<FieldName, (value: any) => boolean> = {
      balance: (val) => val > 0,
      monthlyPayment: (val) => val !== undefined && val !== null && val !== '',
      repaymentAmount: (val) => val > 0,
      bulletPaymentAmount: (val) => val > 0,
      termRemainingMonths: (val) => val !== undefined && val !== null && val !== '',
      termRemainingYears: (val) => val !== undefined && val !== null && val !== '',
      retirementAge: (val) => val > 0,
      // Optional fields - always valid
      notes: () => true,
      includeInMortgage: () => true,
      willMortgageRepayThis: () => true,
      hasBulletPayment: () => true,
    };
    
    // Get all field names from the config and check if they're filled when visible
    const allFieldNames = Object.keys(fieldConfig.fields) as FieldName[];
    
    for (const fieldName of allFieldNames) {
      // Skip if field is not visible
      if (!shouldShowField(fieldName, fieldConfig, formValuesForConditionals)) {
        continue;
      }
      
      // Get the validator for this field
      const validator = fieldValidators[fieldName];
      if (!validator) {
        continue; // Skip fields without validators
      }
      
      // Check if the field value is valid
      const value = currentValues[fieldName];
      if (!validator(value)) {
        return false;
      }
    }
    
    return true;
  }, [getValues, fieldConfig, formValuesForConditionals, selectedType, completionStatus, monthlyPayment, balance, hasBulletPayment]);

  // Expose validation method to parent component
  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const isValid = await trigger();
      return isValid;
    },
    hasUnsavedChanges: () => isDirty
  }));

  const onSubmit = (data: any) => {
    if (isEditing && onUpdateCommitment) {
      onUpdateCommitment(data as FinancialCommitment);
    } else {
      // When adding, we don't need the id as it will be generated by the slice
      const { id, ...commitmentWithoutId } = data;
      onAddCommitment(commitmentWithoutId);
      // Reset the form to allow adding another commitment
      reset({});
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Financial Commitment' : 'Add Financial Commitment'}
        </Typography>

        <Grid container spacing={3}>
          {/* Type selector - always shown */}
          <TypeSelector register={register} watch={watch} errors={errors} setValue={setValue} fieldConfig={fieldConfig} />

          {/* Balance field - conditionally shown */}
          {shouldShowField('balance', fieldConfig, formValuesForConditionals) && (
            <BalanceField register={register} getValues={getValues} errors={errors} fieldConfig={fieldConfig} />
          )}

          {/* Monthly payment field - conditionally shown */}
          {shouldShowField('monthlyPayment', fieldConfig, formValuesForConditionals) && (
            <MonthlyPaymentField register={register} errors={errors} fieldConfig={fieldConfig} />
          )}

          {/* Completion status selector - always shown */}
          <CompletionStatusSelector register={register} watch={watch} errors={errors} fieldConfig={fieldConfig} setValue={setValue} />

          {/* Repayment amount field - conditionally shown */}
          {shouldShowField('repaymentAmount', fieldConfig, formValuesForConditionals) && (
            <RepaymentAmountField register={register} errors={errors} fieldConfig={fieldConfig} />
          )}

          {/* Notes field - conditionally shown */}
          {shouldShowField('notes', fieldConfig, formValuesForConditionals) && (
            <NotesField register={register} errors={errors} fieldConfig={fieldConfig} />
          )}

          {/* Include in mortgage field - conditionally shown */}
          {shouldShowField('includeInMortgage', fieldConfig, formValuesForConditionals) && (
            <IncludeInMortgageField register={register} watch={watch} errors={errors} fieldConfig={fieldConfig} />
          )}
          
          {/* Term remaining fields - conditionally shown */}
          {shouldShowField('termRemainingMonths', fieldConfig, formValuesForConditionals) && (
            <Grid item xs={12} md={6}>
              <TextField
                {...register("termRemainingMonths")}
                label={fieldConfig.labels.termRemainingMonths}
                type="number"
                fullWidth
                error={!!errors.termRemainingMonths}
                helperText={errors.termRemainingMonths?.message?.toString()}
              />
            </Grid>
          )}

          {shouldShowField('termRemainingYears', fieldConfig, formValuesForConditionals) && (
            <Grid item xs={12} md={6}>
              <TextField
                {...register("termRemainingYears")}
                label={fieldConfig.labels.termRemainingYears}
                type="number"
                fullWidth
                error={!!errors.termRemainingYears}
                helperText={errors.termRemainingYears?.message?.toString()}
              />
            </Grid>
          )}

          {/* Has Bullet Payment field - conditionally shown for hire_purchase */}
          {shouldShowField('hasBulletPayment', fieldConfig, formValuesForConditionals) && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("hasBulletPayment")}
                    checked={!!watch("hasBulletPayment")}
                  />
                }
                label={fieldConfig.labels.hasBulletPayment}
              />
            </Grid>
          )}

          {/* Bullet Payment Amount field - conditionally shown based on hasBulletPayment */}
          {shouldShowField('bulletPaymentAmount', fieldConfig, formValuesForConditionals) && (
            <Grid item xs={12} md={6}>
              <TextField
                {...register("bulletPaymentAmount")}
                label={fieldConfig.labels.bulletPaymentAmount}
                type="number"
                fullWidth
                error={!!errors.bulletPaymentAmount}
                helperText={errors.bulletPaymentAmount?.message?.toString()}
              />
            </Grid>
          )}

          {/* Will mortgage repay this - conditionally shown */}
          {shouldShowField('willMortgageRepayThis', fieldConfig, formValuesForConditionals) && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("willMortgageRepayThis")}
                    checked={!!watch("willMortgageRepayThis")}
                    onChange={(e) => {
                      setValue("willMortgageRepayThis", e.target.checked);
                    }}
                  />
                }
                label={fieldConfig.labels.willMortgageRepayThis}
              />
            </Grid>
          )}
          
          {/* Retirement age field - conditionally shown */}
          {shouldShowField('retirementAge', fieldConfig, formValuesForConditionals) && (
            <RetirementAgeField register={register} watch={watch} errors={errors} />
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {/* Show Cancel only when there's at least one commitment (user can close the form) */}
          {onCancel && currentCommitmentCount > 0 && (
            <Button onClick={onCancel} sx={{ mr: 1 }}>
              Cancel
            </Button>
          )}
          
          {/* Show Add/Update button based on editing mode */}
          {isEditing ? (
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          ) : (
            /* Show "Add another commitment" when form is complete OR when there are existing commitments */
            (isFormComplete || currentCommitmentCount > 0) && (
              <>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={!isFormComplete || currentCommitmentCount >= 5}
                >
                  Add another commitment
                </Button>
                {currentCommitmentCount >= 5 && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    Maximum of 5 commitments reached
                  </Typography>
                )}
              </>
            )
          )}
        </Box>
        
        {process.env.NODE_ENV === 'development' && <DevTool control={control} />}
      </form>
    </Paper>
  );
});

CommitmentForm.displayName = 'CommitmentForm';

export default CommitmentForm;
