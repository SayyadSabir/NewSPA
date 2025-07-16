import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FinancialCommitment } from '../types';

export interface FinancialCommitmentsResponse {
  success: boolean;
  data: FinancialCommitment[];
}

export interface SaveFinancialCommitmentsRequest {
  commitments: FinancialCommitment[];
}

export const financialDetailsApi = createApi({
  reducerPath: 'financialDetailsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['FinancialCommitments'],
  endpoints: (builder) => ({
    getFinancialCommitments: builder.query<FinancialCommitment[], void>({
      query: () => '/financial-commitments',
      transformResponse: (response: FinancialCommitmentsResponse) => response.data,
      providesTags: ['FinancialCommitments'],
    }),
    saveFinancialCommitments: builder.mutation<FinancialCommitmentsResponse, SaveFinancialCommitmentsRequest>({
      query: (data) => ({
        url: '/financial-commitments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FinancialCommitments'],
    }),
    updateFinancialCommitment: builder.mutation<FinancialCommitmentsResponse, FinancialCommitment>({
      query: (commitment) => ({
        url: `/financial-commitments/${commitment.id}`,
        method: 'PUT',
        body: commitment,
      }),
      invalidatesTags: ['FinancialCommitments'],
    }),
    deleteFinancialCommitment: builder.mutation<FinancialCommitmentsResponse, string>({
      query: (id) => ({
        url: `/financial-commitments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FinancialCommitments'],
    }),
  }),
});

export const {
  useGetFinancialCommitmentsQuery,
  useSaveFinancialCommitmentsMutation,
  useUpdateFinancialCommitmentMutation,
  useDeleteFinancialCommitmentMutation,
} = financialDetailsApi;
