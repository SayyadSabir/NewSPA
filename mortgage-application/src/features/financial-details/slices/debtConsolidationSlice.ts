import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Form data interface (camelCase for React Hook Form)
export interface DebtConsolidationFormData {
  totalCommitmentToBeRepaid?: number;
  reasonForUsingNewMortgageToConsolidateDebt?: string;
  reasonForConsolidateDesc?: string;
  havingDifficultyPayingExistingFinancialCommitment?: boolean;
  consideredRenegotiatingWithCreditors?: boolean;
  attestationClientUnderstandImplication?: boolean;
  attestationClientConsideredRenegotiation?: boolean;
}

export interface DebtConsolidationState {
  formData: DebtConsolidationFormData;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

const initialState: DebtConsolidationState = {
  formData: {
    totalCommitmentToBeRepaid: undefined,
    reasonForUsingNewMortgageToConsolidateDebt: undefined,
    reasonForConsolidateDesc: undefined,
    havingDifficultyPayingExistingFinancialCommitment: undefined,
    consideredRenegotiatingWithCreditors: undefined,
    attestationClientUnderstandImplication: undefined,
    attestationClientConsideredRenegotiation: undefined,
  },
  isLoading: false,
  hasUnsavedChanges: false,
};

const debtConsolidationSlice = createSlice({
  name: "debtConsolidation",
  initialState,
  reducers: {
    updateFormData: (
      state,
      action: PayloadAction<Partial<DebtConsolidationFormData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
      state.hasUnsavedChanges = true;
    },
    setFormData: (state, action: PayloadAction<DebtConsolidationFormData>) => {
      state.formData = action.payload;
      state.hasUnsavedChanges = false;
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.hasUnsavedChanges = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    markAsSaved: (state) => {
      state.hasUnsavedChanges = false;
    },
  },
});

export const {
  updateFormData,
  setFormData,
  resetFormData,
  setLoading,
  markAsSaved,
} = debtConsolidationSlice.actions;

export default debtConsolidationSlice.reducer;
