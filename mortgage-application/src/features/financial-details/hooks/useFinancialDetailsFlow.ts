import { useCallback, useState, useEffect } from 'react';
import { useFinancialCommitments } from './useFinancialCommitments';
import { navigateToUrl } from 'single-spa';
import { getApplicationId, isResumeCase } from '../utils/applicationStorage';

/**
 * Custom hook to manage the financial details flow, handling both new and resume cases
 */
export const useFinancialDetailsFlow = () => {
  // Get application status directly from local storage
  const isResume = isResumeCase();
  
  // Get financial commitments data and operations
  const {
    commitments,
    isLoading: isLoadingCommitments,
    isSaving,
    isUpdating,
    isDeleting,
    saveCommitments,
    updateCommitment,
    removeCommitment,
    addCommitment,
    toggleIncludeInMortgage,
    debtConsolidationCommitments,
    applicationId
  } = useFinancialCommitments();

  // Track the current step in the flow
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  // Combined loading state
  const isLoading = isLoadingCommitments;
  const isProcessing = isSaving || isUpdating || isDeleting;
  
  // Update completed steps when commitments change
  useEffect(() => {
    if (!isLoading) {
      const newCompleted = {};
      
      if (commitments && commitments.length > 0) {
        newCompleted[0] = true;
      }
      
      if (debtConsolidationCommitments && debtConsolidationCommitments.length > 0) {
        newCompleted[1] = true;
      }
      
      // Only update if there's a change to avoid infinite loops
      if (Object.keys(newCompleted).length > 0) {
        setCompleted(prev => ({ ...prev, ...newCompleted }));
      }
    }
  }, [isLoading, commitments?.length, debtConsolidationCommitments?.length]);

  // Handle navigation to the next step
  const handleNext = useCallback(async () => {
    // Save current step data
    const success = await saveCommitments();
    
    if (success) {
      // Mark current step as completed
      setCompleted((prev) => ({ ...prev, [activeStep]: true }));
      
      // Move to next step
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    
    return success;
  }, [activeStep, saveCommitments]);

  // Handle navigation to the previous step
  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  // Handle navigation to a specific step (only if completed or current)
  const handleStepClick = useCallback((step: number) => {
    const isStepCompleted = completed[step];
    const isCurrentStep = step === activeStep;
    
    if (isStepCompleted || isCurrentStep) {
      setActiveStep(step);
    }
  }, [activeStep, completed]);

  // Handle saving and returning to overview
  const handleSaveAndReturnToOverview = useCallback(async () => {
    const success = await saveCommitments();
    
    if (success) {
      // Mark current step as completed
      setCompleted((prev) => ({ ...prev, [activeStep]: true }));
      
      // Navigate to overview using single-spa
      navigateToUrl('/secure/launch/overview');
    }
    
    return success;
  }, [activeStep, saveCommitments]);

  return {
    // Application status
    isResume,
    applicationId,
    
    // Step navigation
    activeStep,
    completed,
    handleNext,
    handleBack,
    handleStepClick,
    handleSaveAndReturnToOverview,
    
    // Financial commitments data and operations
    commitments,
    debtConsolidationCommitments,
    updateCommitment,
    removeCommitment,
    addCommitment,
    toggleIncludeInMortgage,
    
    // Loading states
    isLoading,
    isProcessing
  };
};
