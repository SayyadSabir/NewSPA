import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { financialDetailsApi } from '../api/financialDetailsApi';

export interface ApplicantSummary {
  'applicant-id': string;
  'title': string;
  'first-name': string;
  'surname': string;
  'middle-name': string;
}

export interface ApplicationSummary {
  'lending-type': string;
  'main-purpose': string;
}

export interface ApplicationMetadataState {
  applicantSummary: ApplicantSummary[];
  applicationSummary: ApplicationSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ApplicationMetadataState = {
  applicantSummary: [],
  applicationSummary: null,
  isLoading: false,
  error: null,
};

const applicationMetadataSlice = createSlice({
  name: 'applicationMetadata',
  initialState,
  reducers: {
    setApplicantSummary: (state, action: PayloadAction<ApplicantSummary[]>) => {
      state.applicantSummary = action.payload;
    },
    setApplicationSummary: (state, action: PayloadAction<ApplicationSummary>) => {
      state.applicationSummary = action.payload;
    },
    clearMetadata: (state) => {
      state.applicantSummary = [];
      state.applicationSummary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        financialDetailsApi.endpoints.getFinancialCommitments.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        financialDetailsApi.endpoints.getFinancialCommitments.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          // Metadata is now handled by the separate getApplicationMetadata endpoint
        }
      )
      .addMatcher(
        financialDetailsApi.endpoints.getFinancialCommitments.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to fetch application metadata';
        }
      );
  },
});

export const { setApplicantSummary, setApplicationSummary, clearMetadata } =
  applicationMetadataSlice.actions;

export default applicationMetadataSlice.reducer;
