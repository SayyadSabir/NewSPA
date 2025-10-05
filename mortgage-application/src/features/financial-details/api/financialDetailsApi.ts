import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FinancialCommitment } from '../types';
import { setError, clearError } from '../slices/errorSlice';
import { setApplicantSummary, setApplicationSummary } from '../slices/applicationMetadataSlice';
import { RootState } from '../../../store';
import { getApplicationId } from '../utils/applicationStorage';
import { transformCommitmentFormDataToApi, transformApiDataToForm, ApiCommitmentData } from '../utils/commitmentDataTransformer';
import { v4 as generateId } from 'uuid';

// Default applicant details - in a real app, this would come from user context/state
const DEFAULT_APPLICANT_DETAILS = {
  applicantId: "21348669-71ef-11f0-b649-1375f2669fc",
  applicantName: "John Janardhan"
};

// Application ID type for resume case
export interface ApplicationParams {
  applicationId?: string;
}

export interface FinancialCommitmentsResponse {
  success: boolean;
  data: OverviewApiResponse; // Raw API data from overview API
  applicationId?: string;
  dateOfBirth?: string; // ISO format date string
}

export interface OverviewApiResponse {
  'application-summary': {
    'lending-type': string;
    'main-purpose': string;
  };
  'financial-commitment': Array<{
    'financial-commitments': {
      'financial-commitments': boolean;
      'total-repay-by-mortgage': number;
      'commitment-details': ApiCommitmentData[];
      'main-purpose': string;
    };
    'no-of-applicants': number;
    'lending-type': string;
    'is-joint-flow': boolean;
  }>;
  'applicant-summary': Array<{
    'applicant-id': string;
    'title': string;
    'first-name': string;
    'surname': string;
    'middle-name': string;
  }>;
}

export interface SaveFinancialCommitmentsRequest {
  commitments: FinancialCommitment[];
  applicationId?: string;
}

// Custom base query that passes dispatch to transformResponse
const baseQueryWithMetadata = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({ baseUrl: '/api' })(args, api, extraOptions);
  
  // Pass dispatch function to transformResponse via meta for overview API calls
  if (typeof args === 'string' && args.includes('overviewxapi/financial-commitments')) {
    (result as any).meta = {
      ...result.meta,
      dispatch: api.dispatch
    };
  }
  
  return result;
};

export const financialDetailsApi = createApi({
  reducerPath: 'financialDetailsApi',
  baseQuery: baseQueryWithMetadata,
  tagTypes: ['FinancialCommitments'],
  endpoints: (builder) => ({
    // Get financial commitments from overview API (also extracts and stores metadata)
    getFinancialCommitments: builder.query<FinancialCommitment[], ApplicationParams>({
      query: (params) => params.applicationId 
        ? `/overviewxapi/financial-commitments?applicationId=${params.applicationId}` 
        : '/overviewxapi/financial-commitments',
      transformResponse: (response: FinancialCommitmentsResponse, meta, arg) => {
        // Dispatch metadata to Redux store immediately
        const dispatch = (meta as any)?.dispatch;
        if (dispatch) {
          // Store application summary
          if (response.data['application-summary']) {
            dispatch(setApplicationSummary(response.data['application-summary']));
          }
          
          // Store applicant summary
          if (response.data['applicant-summary'] && response.data['applicant-summary'].length > 0) {
            dispatch(setApplicantSummary(response.data['applicant-summary']));
          }
        }
        
        // Extract commitment details from the nested overview API response
        const commitmentDetails: ApiCommitmentData[] = [];
        
        if (response.data['financial-commitment']) {
          response.data['financial-commitment'].forEach(commitment => {
            if (commitment['financial-commitments']['commitment-details']) {
              commitmentDetails.push(...commitment['financial-commitments']['commitment-details']);
            }
          });
        }
        
        // Transform API data (kebab-case) to form format (camelCase) for each commitment
        return commitmentDetails.map(apiCommitment => ({
          ...transformApiDataToForm(apiCommitment),
          id: apiCommitment.id || generateId() // Ensure we have an ID
        })) as FinancialCommitment[];
      },
      providesTags: ['FinancialCommitments'],
    }),
    
    // We now use local storage for application status instead of an API endpoint
    saveFinancialCommitments: builder.mutation<FinancialCommitmentsResponse, SaveFinancialCommitmentsRequest>({      
      query: (data) => {
        // Transform commitments to API format before sending
        const transformedCommitments = data.commitments.map(commitment => 
          transformCommitmentFormDataToApi(commitment, DEFAULT_APPLICANT_DETAILS)
        );
        
        // Log the API payload for debugging/development
        if (process.env.NODE_ENV === 'development') {
          console.log('Saving commitments - API Payload:', JSON.stringify(transformedCommitments, null, 2));
        }
        
        return {
          url: '/financial-commitments',
          method: 'POST',
          body: {
            ...data,
            commitments: transformedCommitments
          },
        };
      },
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
  }),
});

export const {
  useGetFinancialCommitmentsQuery,
  useSaveFinancialCommitmentsMutation,
} = financialDetailsApi;
