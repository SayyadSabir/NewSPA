import React, { useState } from 'react';
import { Box, CircularProgress, Typography, Container, Button } from '@mui/material';
import FinancialDetailsPage from './FinancialDetailsPage';
import DebtConsolidationPage from './DebtConsolidationPage';
import { navigateToUrl } from 'single-spa';
import { getApplicationId, isResumeCase } from '../utils/applicationStorage';
import { useFinancialCommitments } from '../hooks/useFinancialCommitments';

// Simple enum for step tracking
enum FinancialDetailsStep {
  FINANCIAL_COMMITMENTS = 0,
  DEBT_CONSOLIDATION = 1,
}

// Container component that manages step navigation
const FinancialDetailsContainer: React.FC = () => {
  // Simple state for step tracking
  const [currentStep, setCurrentStep] = useState<FinancialDetailsStep>(FinancialDetailsStep.FINANCIAL_COMMITMENTS);
  
  // Get financial commitments data
  const { isLoading } = useFinancialCommitments();
  
  // Get application status directly
  const isResume = isResumeCase();
  const applicationId = isResume ? getApplicationId() : undefined;
  
  // Navigation handlers
  const handleNext = () => {
    setCurrentStep(FinancialDetailsStep.DEBT_CONSOLIDATION);
  };
  
  const handleBack = () => {
    setCurrentStep(FinancialDetailsStep.FINANCIAL_COMMITMENTS);
  };
  
  const handleSaveAndReturnToOverview = () => {
    // Use single-spa navigation to return to overview MFE
    navigateToUrl('/secure/launch/overview');
  };
  
  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading financial details...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      {/* Application status indicator */}
      {isResume && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body1">
            Resuming application {applicationId}
          </Typography>
        </Box>
      )}
      
      {/* Simple step indicator */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant={currentStep === FinancialDetailsStep.FINANCIAL_COMMITMENTS ? "contained" : "outlined"}
          sx={{ mx: 1 }}
          onClick={() => currentStep === FinancialDetailsStep.DEBT_CONSOLIDATION && handleBack()}
        >
          Financial Commitments
        </Button>
        <Button 
          variant={currentStep === FinancialDetailsStep.DEBT_CONSOLIDATION ? "contained" : "outlined"}
          sx={{ mx: 1 }}
          disabled={currentStep === FinancialDetailsStep.FINANCIAL_COMMITMENTS}
        >
          Debt Consolidation
        </Button>
      </Box>
      
      {/* Step content */}
      {currentStep === FinancialDetailsStep.FINANCIAL_COMMITMENTS && (
        <FinancialDetailsPage 
          onNext={handleNext} 
          onSaveAndReturn={handleSaveAndReturnToOverview} 
        />
      )}
      {currentStep === FinancialDetailsStep.DEBT_CONSOLIDATION && (
        <DebtConsolidationPage 
          onBack={handleBack} 
          onSaveAndReturn={handleSaveAndReturnToOverview} 
        />
      )}
    </Container>
  );
};

export default FinancialDetailsContainer;
