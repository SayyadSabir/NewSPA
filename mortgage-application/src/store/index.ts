import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import financialCommitmentsReducer from "../features/financial-details/slices/financialCommitmentsSlice";
import errorReducer from "../features/financial-details/slices/errorSlice";
import applicationMetadataReducer from "../features/financial-details/slices/applicationMetadataSlice";
import debtConsolidationReducer from "../features/financial-details/slices/debtConsolidationSlice";
import { financialDetailsApi } from "../features/financial-details/api/financialDetailsApi";
import { debtConsolidationApi } from "../features/financial-details/api/debtConsolidationApi";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    financialCommitments: financialCommitmentsReducer,
    error: errorReducer,
    applicationMetadata: applicationMetadataReducer,
    debtConsolidation: debtConsolidationReducer,
    [financialDetailsApi.reducerPath]: financialDetailsApi.reducer,
    [debtConsolidationApi.reducerPath]: debtConsolidationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(financialDetailsApi.middleware)
      .concat(debtConsolidationApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
