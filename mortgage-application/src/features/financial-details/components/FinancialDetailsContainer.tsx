import React from 'react';
import FinancialDetailsPage from './FinancialDetailsPage';
import DebtConsolidationPage from './DebtConsolidationPage';
import { NavigationProvider, FinancialDetailsStep, useNavigation } from '../contexts/NavigationContext';

// Separate the step renderer from the container for better separation of concerns
const FinancialDetailsStepRenderer: React.FC = () => {
  const { currentStep, navigateToNext, navigateToPrevious } = useNavigation();

  return (
    <>
      {currentStep === FinancialDetailsStep.FINANCIAL_COMMITMENTS && (
        <FinancialDetailsPage onNext={navigateToNext} />
      )}
      {currentStep === FinancialDetailsStep.DEBT_CONSOLIDATION && (
        <DebtConsolidationPage onBack={navigateToPrevious} />
      )}
    </>
  );
};

// Container component that provides the navigation context
const FinancialDetailsContainer: React.FC = () => {
  return (
    <NavigationProvider>
      <FinancialDetailsStepRenderer />
    </NavigationProvider>
  );
};

export default FinancialDetailsContainer;
