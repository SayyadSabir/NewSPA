import { useState, useEffect } from 'react';
import { useGetPersonalDetailsQuery } from '../api/personalDetailsApi';

export function usePersonalDetailsValidation() {
  const { data: personalDetails, isLoading } = useGetPersonalDetailsQuery();
  const [maxRetirementAge, setMaxRetirementAge] = useState<number | null>(null);
  
  useEffect(() => {
    if (personalDetails?.dateOfBirth) {
      const dob = new Date(personalDetails.dateOfBirth);
      const currentYear = new Date().getFullYear();
      const birthYear = dob.getFullYear();
      const age = currentYear - birthYear;
      
      // Maximum retirement age is typically set to 100 years from birth
      const calculatedMaxRetirementAge = 100 - age;
      setMaxRetirementAge(calculatedMaxRetirementAge);
    }
  }, [personalDetails]);
  
  // Validation function to be used in form rules
  const validateRetirementAge = (value: number) => {
    if (maxRetirementAge === null) return true; // Skip validation if data not loaded
    return value <= maxRetirementAge || `Retirement age cannot exceed ${maxRetirementAge} based on your date of birth`;
  };
  
  return {
    validateRetirementAge,
    isLoading,
    personalDetails,
    maxRetirementAge
  };
}
