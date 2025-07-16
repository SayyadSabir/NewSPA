import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { FinancialCommitment } from '../types';
import { financialDetailsApi } from '../api/financialDetailsApi';

// Re-export the state type for use in the store
export interface FinancialCommitmentsState {
  commitments: FinancialCommitment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FinancialCommitmentsState = {
  commitments: [],
  isLoading: false,
  error: null,
};

const financialCommitmentsSlice = createSlice({
  name: 'financialCommitments',
  initialState,
  reducers: {
    addCommitment: (state, action: PayloadAction<Omit<FinancialCommitment, 'id'>>) => {
      const newCommitment = {
        ...action.payload,
        id: uuidv4(),
      };
      state.commitments.push(newCommitment);
    },
    updateCommitment: (state, action: PayloadAction<FinancialCommitment>) => {
      const index = state.commitments.findIndex(
        (commitment) => commitment.id === action.payload.id
      );
      if (index !== -1) {
        state.commitments[index] = action.payload;
      }
    },
    removeCommitment: (state, action: PayloadAction<string>) => {
      state.commitments = state.commitments.filter(
        (commitment) => commitment.id !== action.payload
      );
    },
    setCommitments: (state, action: PayloadAction<FinancialCommitment[]>) => {
      state.commitments = action.payload;
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
          state.commitments = action.payload;
        }
      )
      .addMatcher(
        financialDetailsApi.endpoints.getFinancialCommitments.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to fetch commitments';
        }
      );
  },
});

export const { addCommitment, updateCommitment, removeCommitment, setCommitments } =
  financialCommitmentsSlice.actions;

export default financialCommitmentsSlice.reducer;
