import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
  CircularProgress,
  Checkbox,
  TextField,
} from '@mui/material';

import TubeStopStepper from '../../../components/common/TubeStopStepper';
import { useFinancialCommitments } from '../hooks/useFinancialCommitments';
import { useSaveDebtConsolidationMutation } from '../api/debtConsolidationApi';
import { updateFormData, markAsSaved, DebtConsolidationFormData } from '../slices/debtConsolidationSlice';
import { RootState } from '../../../store';
import { getApplicationId } from '../utils/applicationStorage';
import { ArrowBack } from '@mui/icons-material';

interface DebtConsolidationPageProps {
  onBack?: () => void;
  onSaveAndReturn?: () => void;
}

const DebtConsolidationPage: React.FC<DebtConsolidationPageProps> = ({ onBack, onSaveAndReturn }) => {
  const dispatch = useDispatch();
  const activeStep = 1;
  
  // Get data from Redux store
  const { commitments } = useFinancialCommitments();
  const debtConsolidationState = useSelector((state: RootState) => state.debtConsolidation);
  const [saveDebtConsolidation, { isLoading: isSaving }] = useSaveDebtConsolidationMutation();
  
  // Ref to store initial debt consolidation data for change detection
  const initialDebtDataRef = useRef<DebtConsolidationFormData | null>(null);
  
  // Steps for the tube stop stepper
  const steps = ['Financial commitments', 'Debt consolidation'];
  
  // Calculate total commitment amount from selected commitments
  const totalCommitmentAmount = commitments
    .filter(commitment => commitment.includeInMortgage)
    .reduce((total, commitment) => total + (commitment.balance || 0), 0);
  
  // React Hook Form setup with proper default values
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<DebtConsolidationFormData>({
    defaultValues: {
      totalCommitmentToBeRepaid: debtConsolidationState.formData.totalCommitmentToBeRepaid ?? 0,
      reasonForUsingNewMortgageToConsolidateDebt: debtConsolidationState.formData.reasonForUsingNewMortgageToConsolidateDebt ?? '',
      reasonForConsolidateDesc: debtConsolidationState.formData.reasonForConsolidateDesc ?? '',
      havingDifficultyPayingExistingFinancialCommitment: debtConsolidationState.formData.havingDifficultyPayingExistingFinancialCommitment ?? false,
      consideredRenegotiatingWithCreditors: debtConsolidationState.formData.consideredRenegotiatingWithCreditors ?? false,
      attestationClientUnderstandImplication: debtConsolidationState.formData.attestationClientUnderstandImplication ?? false,
      attestationClientConsideredRenegotiation: debtConsolidationState.formData.attestationClientConsideredRenegotiation ?? false,
    },
  });
  
  // Watch specific form values for conditional rendering
  const havingDifficulty = watch('havingDifficultyPayingExistingFinancialCommitment');
  const consideredRenegotiating = watch('consideredRenegotiatingWithCreditors');
  
  // No automatic field resetting - let the API payload logic handle conditional fields
  // This prevents polluting the store with false values for untouched fields
  
  // Update total commitment amount when commitments change
  useEffect(() => {
    setValue('totalCommitmentToBeRepaid', totalCommitmentAmount);
    dispatch(updateFormData({ totalCommitmentToBeRepaid: totalCommitmentAmount }));
  }, [totalCommitmentAmount, setValue, dispatch]);
  
  // Capture initial debt consolidation data from Redux store (from API response)
  useEffect(() => {
    // Only capture if we have actual data (not all undefined values)
    const hasActualData = debtConsolidationState.formData && 
      Object.values(debtConsolidationState.formData).some(value => value !== undefined);
    
    if (hasActualData && !initialDebtDataRef.current) {
      initialDebtDataRef.current = { ...debtConsolidationState.formData };
      console.log('Captured initial debt consolidation data:', initialDebtDataRef.current);
    }
  }, [debtConsolidationState.formData]);

  // Format currency for display
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  // Helper function to check if form data has changed by comparing with initial API data
  const hasFormDataChanged = (currentData: DebtConsolidationFormData): boolean => {
    if (!initialDebtDataRef.current) {
      // If no initial data captured, it's a new case (always save)
      return true;
    }
    
    // Compare current form data with initial API data using JSON comparison
    const currentDataString = JSON.stringify(currentData);
    const initialDataString = JSON.stringify(initialDebtDataRef.current);
    console.log(currentDataString)
    console.log(initialDataString)
    const hasChanged = currentDataString !== initialDataString;
    console.log('Form data comparison:', {
      hasInitialData: !!initialDebtDataRef.current,
      hasChanged,
      currentData,
      initialData: initialDebtDataRef.current
    });
    
    return hasChanged;
  };

  // Handle form submission
  const onSubmit = async (data: DebtConsolidationFormData) => {
    try {
      // Update Redux store with final form data
      dispatch(updateFormData(data));
      
      const applicationId = getApplicationId();
      
      // Check if form data has changed (works for both new and resume cases)
      const hasChanged = hasFormDataChanged(data);
      
      if (!hasChanged) {
        console.log('No changes detected - skipping API call');
        dispatch(markAsSaved());
        return;
      }
      
      console.log('Changes detected - proceeding with API call');
      
      // Transform form data to API format with conditional fields
      const apiData: any = {
        'total-commitment-to-be-repaid': data.totalCommitmentToBeRepaid,
        'reason-for-using-new-mortgage-to-consolidate-debt': data.reasonForUsingNewMortgageToConsolidateDebt,
        'reason-for-consolidate-desc': data.reasonForConsolidateDesc,
        'having-difficulty-paying-existing-financial-commitment': data.havingDifficultyPayingExistingFinancialCommitment,
      };
      
      // Only include conditional fields if their parent conditions are met
      if (data.havingDifficultyPayingExistingFinancialCommitment) {
        apiData['considered-renegotiating-with-creditors'] = data.consideredRenegotiatingWithCreditors;
        apiData['attestation-client-understand-implication'] = data.attestationClientUnderstandImplication;
        
        if (data.consideredRenegotiatingWithCreditors) {
          apiData['attestation-client-considered-renegotiation'] = data.attestationClientConsideredRenegotiation;
        }
      }
      
      await saveDebtConsolidation({ applicationId, data: apiData }).unwrap();
      dispatch(markAsSaved());
      console.log('Debt consolidation saved successfully');
    } catch (error) {
      console.error('Error saving debt consolidation:', error);
    }
  };

  // Handle saving and returning to overview
  const handleSaveAndReturn = async () => {
    await handleSubmit(onSubmit)();
    if (onSaveAndReturn) {
      onSaveAndReturn();
    }
  };

  // Handle going back to financial commitments
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            sx={{ mr: 2 }}
            onClick={handleSaveAndReturn}
          >
            Financial details
          </Button>
        </Box>

        <TubeStopStepper steps={steps} activeStep={activeStep} />

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Debt consolidation
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Step 2 of 2: Debt consolidation
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Total commitment amount */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Total commitments to be repaid using new mortgage
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(totalCommitmentAmount)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Reason for consolidation */}
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  Reason for wanting to use the new mortgage to consolidate debt
                </FormLabel>
                <Controller
                  name="reasonForUsingNewMortgageToConsolidateDebt"
                  control={control}
                  rules={{ required: 'Please select a reason' }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value="Reduce monthly outgoings"
                        control={<Radio />}
                        label="Reduce monthly outgoings"
                      />
                      <FormControlLabel
                        value="Reduce interest rate"
                        control={<Radio />}
                        label="Reduce interest rate"
                      />
                      <FormControlLabel
                        value="Other"
                        control={<Radio />}
                        label="Another reason"
                      />
                    </RadioGroup>
                  )}
                />
                {errors.reasonForUsingNewMortgageToConsolidateDebt && (
                  <Typography color="error" variant="caption">
                    {errors.reasonForUsingNewMortgageToConsolidateDebt.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Additional information */}
            <Box sx={{ mb: 3 }}>
              <Controller
                name="reasonForConsolidateDesc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Please give more information"
                    placeholder="Characters 0/1000"
                    inputProps={{ maxLength: 1000 }}
                    helperText={`${field.value?.length || 0}/1000 characters`}
                  />
                )}
              />
            </Box>

            {/* Difficulty paying question */}
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  Is the client having difficulty paying their existing financial commitments?
                </FormLabel>
                <Controller
                  name="havingDifficultyPayingExistingFinancialCommitment"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      value={field.value ? 'Yes' : 'No'}
                      onChange={(e) => field.onChange(e.target.value === 'Yes')}
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Box>

            {/* Conditional renegotiation question */}
            {havingDifficulty && (
              <Box sx={{ mb: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 2 }}>
                    Have they considered renegotiating their payments with their creditors?
                  </FormLabel>
                  <Controller
                    name="consideredRenegotiatingWithCreditors"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        value={field.value ? 'Yes' : 'No'}
                        onChange={(e) => field.onChange(e.target.value === 'Yes')}
                      >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Box>
            )}

            {/* Attestation checkboxes */}
            <Box sx={{ mb: 3 }}>
              <Controller
                name="attestationClientUnderstandImplication"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="The client understands the implications of securing a previously unsecured debt and that there could be an additional cost if they take a lower rate over a longer term."
                  />
                )}
              />
            </Box>

            {consideredRenegotiating && (
              <Box sx={{ mb: 3 }}>
                <Controller
                  name="attestationClientConsideredRenegotiation"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="The client has considered renegotiating their payments with their creditors and is happy to proceed. They understand the implications of securing a previously unsecured debt and that there could be an additional cost if they take a lower rate over a longer term."
                    />
                  )}
                />
              </Box>
            )}

          </form>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={handleSaveAndReturn}
              disabled={isSaving}
            >
              Save and return to overview
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
                disabled={isSaving}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
              >
                {isSaving ? <CircularProgress size={24} /> : 'Save and proceed'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DebtConsolidationPage;
