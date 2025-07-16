import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the step enum in a separate file for better reusability
export enum FinancialDetailsStep {
  FINANCIAL_COMMITMENTS = 0,
  DEBT_CONSOLIDATION = 1,
}

interface NavigationContextType {
  currentStep: FinancialDetailsStep;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  navigateToStep: (step: FinancialDetailsStep) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  initialStep?: FinancialDetailsStep;
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  initialStep = FinancialDetailsStep.FINANCIAL_COMMITMENTS,
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<FinancialDetailsStep>(initialStep);

  const navigateToNext = () => {
    setCurrentStep((prevStep) => {
      // Logic to determine the next step
      if (prevStep === FinancialDetailsStep.FINANCIAL_COMMITMENTS) {
        return FinancialDetailsStep.DEBT_CONSOLIDATION;
      }
      return prevStep;
    });
  };

  const navigateToPrevious = () => {
    setCurrentStep((prevStep) => {
      // Logic to determine the previous step
      if (prevStep === FinancialDetailsStep.DEBT_CONSOLIDATION) {
        return FinancialDetailsStep.FINANCIAL_COMMITMENTS;
      }
      return prevStep;
    });
  };

  const navigateToStep = (step: FinancialDetailsStep) => {
    setCurrentStep(step);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentStep,
        navigateToNext,
        navigateToPrevious,
        navigateToStep,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for using the navigation context
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
