import { useState, useEffect } from "react";
import {
  useGetFinancialCommitmentsQuery,
  FinancialCommitmentsResponse,
} from "../api/financialDetailsApi";
import { getApplicationId, isResumeCase } from "../utils/applicationStorage";

export function usePersonalDetailsValidation() {
  const applicationId = isResumeCase() ? getApplicationId() : undefined;
  // Cast the response to FinancialCommitmentsResponse to access dateOfBirth
  const { data, isLoading } = useGetFinancialCommitmentsQuery({
    applicationId,
  });
  const response = data as unknown as FinancialCommitmentsResponse;
  const [maxRetirementAge, setMaxRetirementAge] = useState<number | null>(null);

  useEffect(() => {
    // dateOfBirth is now included in the response object, not in the data array
    if (response?.dateOfBirth) {
      const dob = new Date(response.dateOfBirth);
      const currentYear = new Date().getFullYear();
      const birthYear = dob.getFullYear();
      const age = currentYear - birthYear;

      // Maximum retirement age is typically set to 100 years from birth
      const calculatedMaxRetirementAge = 100 - age;
      setMaxRetirementAge(calculatedMaxRetirementAge);
    }
  }, [response]);

  // Validation function to be used in form rules
  const validateRetirementAge = (value: number) => {
    if (maxRetirementAge === null) return true; // Skip validation if data not loaded
    return (
      value <= maxRetirementAge ||
      `Retirement age cannot exceed ${maxRetirementAge} based on your date of birth`
    );
  };

  return {
    validateRetirementAge,
    isLoading,
    dateOfBirth: response?.dateOfBirth,
    maxRetirementAge,
  };
}
