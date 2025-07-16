import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FinancialCommitment } from '../types';
import { setError, clearError } from '../slices/errorSlice';
import { RootState } from '../../../store';
import { getApplicationId } from '../utils/applicationStorage';

// Application ID type for resume case
export interface ApplicationParams {
  applicationId?: string;
}

export interface FinancialCommitmentsResponse {
  success: boolean;
  data: FinancialCommitment[];
  applicationId?: string;
  dateOfBirth?: string; // ISO format date string
}

export interface SaveFinancialCommitmentsRequest {
  commitments: FinancialCommitment[];
  applicationId?: string;
}

export const financialDetailsApi = createApi({
  reducerPath: 'financialDetailsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['FinancialCommitments'],
  endpoints: (builder) => ({
    // Get financial commitments from overview API
    getFinancialCommitments: builder.query<FinancialCommitment[], ApplicationParams>({
      query: (params) => params.applicationId 
        ? `/overviewxapi/financial-commitments?applicationId=${params.applicationId}` 
        : '/overviewxapi/financial-commitments',
      transformResponse: (response: FinancialCommitmentsResponse) => response.data,
      providesTags: ['FinancialCommitments'],
    }),
    
    // We now use local storage for application status instead of an API endpoint
    saveFinancialCommitments: builder.mutation<FinancialCommitmentsResponse, SaveFinancialCommitmentsRequest>({      
      query: (data) => ({
        url: '/financial-commitments',
        method: 'POST',
        body: data,
      }),
      // No need to invalidate tags since we're using optimistic updates
      onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
        console.log('Saving commitments with applicationId:', data.applicationId);
        
        // Get the actual application ID to use for the cache key
        // Use the provided applicationId or get it from storage if not provided
        const actualAppId = data.applicationId || getApplicationId();
        console.log('Using actual applicationId for cache:', actualAppId);
        
        // Optimistic update - immediately update the local store
        const patchResult = dispatch(
          financialDetailsApi.util.updateQueryData(
            'getFinancialCommitments', 
            { applicationId: actualAppId }, 
            draft => data.commitments
          )
        );
        
        try {
          await queryFulfilled;
          console.log('Save mutation completed successfully');
          // Clear any previous errors on success
          dispatch(clearError());
          // Success - no need to do anything as the optimistic update is already applied
        } catch (error: any) {
          // Don't undo the optimistic update - keep changes in store even if API fails
          // patchResult.undo();
          console.error('Error saving commitments:', error);
          dispatch(setError(error.error?.data?.message || 'Failed to save financial commitments - Data will be kept locally'));
        }
      },
    }),
    updateFinancialCommitment: builder.mutation<FinancialCommitmentsResponse, {commitment: FinancialCommitment, applicationId?: string}>({      
      query: ({commitment}) => ({
        url: `/financial-commitments/${commitment.id}`,
        method: 'PUT',
        body: commitment,
      }),
      // No need to invalidate tags since we're using optimistic updates
      // Update the local store with the updated commitment
      onQueryStarted: async ({commitment, applicationId}, { dispatch, queryFulfilled }) => {
        console.log('Updating commitment with applicationId:', applicationId);
        
        // Get the actual application ID to use for the cache key
        const actualAppId = applicationId || getApplicationId();
        console.log('Using actual applicationId for cache:', actualAppId);
        
        // Optimistic update
        const patchResult = dispatch(
          financialDetailsApi.util.updateQueryData(
            'getFinancialCommitments', 
            { applicationId: actualAppId }, 
            (draft) => {
              const index = draft.findIndex(c => c.id === commitment.id);
              if (index !== -1) {
                draft[index] = commitment;
              }
            }
          )
        );
        
        try {
          await queryFulfilled;
          console.log('Update mutation completed successfully');
          // Clear any previous errors on success
          dispatch(clearError());
        } catch (error: any) {
          // Don't undo the optimistic update - keep changes in store even if API fails
          // patchResult.undo();
          console.error('Error updating commitment:', error);
          dispatch(setError(error.error?.data?.message || 'Failed to update financial commitment - Data will be kept locally'));
        }
      },
    }),
    deleteFinancialCommitment: builder.mutation<FinancialCommitmentsResponse, {id: string, applicationId?: string}>({      
      query: ({id}) => ({
        url: `/financial-commitments/${id}`,
        method: 'DELETE',
      }),
      // No need to invalidate tags since we're using optimistic updates
      // Remove the commitment from the local store
      onQueryStarted: async ({id, applicationId}, { dispatch, queryFulfilled }) => {
        console.log('Deleting commitment with applicationId:', applicationId);
        
        // Get the actual application ID to use for the cache key
        const actualAppId = applicationId || getApplicationId();
        console.log('Using actual applicationId for cache:', actualAppId);
        
        // Optimistic update
        const patchResult = dispatch(
          financialDetailsApi.util.updateQueryData(
            'getFinancialCommitments', 
            { applicationId: actualAppId }, 
            (draft) => {
              const index = draft.findIndex(c => c.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            }
          )
        );
        
        try {
          await queryFulfilled;
          console.log('Delete mutation completed successfully');
          // Clear any previous errors on success
          dispatch(clearError());
        } catch (error: any) {
          // Don't undo the optimistic update - keep changes in store even if API fails
          // patchResult.undo();
          console.error('Error deleting commitment:', error);
          dispatch(setError(error.error?.data?.message || 'Failed to delete financial commitment - Data will be kept locally'));
        }
      },
    }),
  }),
});

export const {
  useGetFinancialCommitmentsQuery,
  useSaveFinancialCommitmentsMutation,
  useUpdateFinancialCommitmentMutation,
  useDeleteFinancialCommitmentMutation,
} = financialDetailsApi;
