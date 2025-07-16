import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import financialCommitmentsReducer from '../features/financial-details/slices/financialCommitmentsSlice';
import { financialDetailsApi } from '../features/financial-details/api/financialDetailsApi';
import { personalDetailsApi } from '../features/financial-details/api/personalDetailsApi';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    financialCommitments: financialCommitmentsReducer,
    [financialDetailsApi.reducerPath]: financialDetailsApi.reducer,
    [personalDetailsApi.reducerPath]: personalDetailsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(financialDetailsApi.middleware)
      .concat(personalDetailsApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
