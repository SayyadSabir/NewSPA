import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ErrorState {
  hasError: boolean;
  errorMessage: string | null;
}

const initialState: ErrorState = {
  hasError: false,
  errorMessage: null,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.hasError = true;
      state.errorMessage = action.payload;
    },
    clearError: (state) => {
      state.hasError = false;
      state.errorMessage = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
