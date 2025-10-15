import { combineReducers } from "@reduxjs/toolkit";
import financialCommitmentsReducer from "./financialCommitmentsSlice";
import { financialDetailsApi } from "../api/financialDetailsApi";

export const financialDetailsReducers = {
  financialCommitments: financialCommitmentsReducer,
  [financialDetailsApi.reducerPath]: financialDetailsApi.reducer,
};
