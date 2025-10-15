import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setError, clearError } from "../slices/errorSlice";

// Types based on the API payload structure from the image
export interface DebtConsolidationData {
  "total-commitment-to-be-repaid": number;
  "reason-for-using-new-mortgage-to-consolidate-debt":
    | "Reduce monthly outgoings"
    | "Reduce interest rate"
    | "Other";
  "reason-for-consolidate-desc": string;
  "having-difficulty-paying-existing-financial-commitment": boolean;
  "considered-renegotiating-with-creditors"?: boolean;
  "attestation-client-understand-implication"?: boolean;
  "attestation-client-considered-renegotiation"?: boolean;
}

export interface DebtConsolidationRequest {
  applicationId?: string;
  data: DebtConsolidationData;
}

export interface DebtConsolidationResponse {
  success: boolean;
  message?: string;
  data?: DebtConsolidationData;
}

export const debtConsolidationApi = createApi({
  reducerPath: "debtConsolidationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["DebtConsolidation"],
  endpoints: (builder) => ({
    // Save debt consolidation data
    saveDebtConsolidation: builder.mutation<
      DebtConsolidationResponse,
      DebtConsolidationRequest
    >({
      query: (request) => ({
        url: "/debt-consolidation",
        method: "POST",
        body: request,
      }),
      onQueryStarted: async (request, { dispatch, queryFulfilled }) => {
        console.log("Saving debt consolidation data:", request);

        try {
          await queryFulfilled;
          console.log("Debt consolidation save completed successfully");
          dispatch(clearError());
        } catch (error: any) {
          console.error("Error saving debt consolidation:", error);
          dispatch(
            setError(
              error.error?.data?.message ||
                "Failed to save debt consolidation data"
            )
          );
        }
      },
    }),
  }),
});

export const { useSaveDebtConsolidationMutation } = debtConsolidationApi;
