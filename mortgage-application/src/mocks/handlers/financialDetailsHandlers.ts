import { http, HttpResponse, delay } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { FinancialCommitment } from '../../features/financial-details/types';
import { getApplicationId, isResumeCase as getIsResumeCase } from '../../features/financial-details/utils/applicationStorage';

// Simulate failures for testing error handling
const SIMULATE_FAILURES = true;
const FAILURE_RATE = 0.3; // 30% chance of failure

// Helper function to determine if a request should fail
function shouldFail() {
  return SIMULATE_FAILURES && Math.random() < FAILURE_RATE;
}

// Mock personal details data
const mockPersonalDetails = {
  dateOfBirth: '1980-05-15' // This would make the person around 45 years old
};

// In-memory mock database
let financialCommitments: FinancialCommitment[] = [];

// We'll use the application ID from applicationStorage.ts

// Sample API response
const sampleApi = 
{
  "application-summary":{
    "lending-type":"residential",
    "main-purpose":"FIRST-TIME-BUYER"
  },
  "financial-commitment":[
    {
    "financial-commitments": {
      "financial-commitments": true,
      "total-repay-by-mortgage": 0,
      "commitment-details": [
        {
          "id": "1",
          "remaining-amount": {
            "amount": 0,
            "currency": "GBP"
          },
          "secured-against-mortgage": false,
          "type-of-commitment": "credit card",
          "applicant-details": {
            "applicant-name": "Advice Seeker",
            "applicant-id": "cc863d1e"
          },
          "monthly-payment": {
            "amount": 1000,
            "currency": "GBP"
          },
          "commitment-amount-to-repaid": {
            "amount": 5000,
            "currency": "GBP"
          },
          "bullet-balloon-payment": false,
          "commitment-before-completion": "Remaining",
          "outstanding-balance": {
            "amount": 5000,
            "currency": "GBP"
          }
        },
        {
          "id": "2",
          "remaining-amount": {
            "amount": 0,
            "currency": "GBP"
          },
          "secured-against-mortgage": false,
          "type-of-commitment": "student loan",
          "applicant-details": {
            "applicant-name": "sabir Seeker",
            "applicant-id": "cc863d1e"
          },
          "monthly-payment": {
            "amount": 1000,
            "currency": "GBP"
          },
          "commitment-amount-to-repaid": {
            "amount": 5000,
            "currency": "GBP"
          },
          "bullet-balloon-payment": false,
          "commitment-before-completion": "Remaining",
          "outstanding-balance": {
            "amount": 5000,
            "currency": "GBP"
          }
        }
      ],
      "main-purpose": "FIRST-TIME-BUYER",
   
    },
    "no-of-applicants": 1,
    "lending-type": "residential",
    "is-joint-flow": false,
  }
  ],

  "applicant-summary":[
    {
      "applicant-id": "cc863d1e-71ef-11f0-b649-1375f2669fc",
      "title": "John Janardhan",
      "first-name": "John",
      "surname": "Janardhan",
      "middle-name": "Janardhan"    
    }
  ]
}

// Helper function to get commitments based on application ID
const getCommitmentsByApplicationId = (applicationId?: string) => {
  // If it's a resume case and we have an application ID, return sample API commitments (raw format)
  if (applicationId && getIsResumeCase()) {
    return {
      ...sampleApi,
      "debt-consolidation": false
    };
  }
  // Otherwise return empty structure for new case
  return {
    "application-summary": {
      "lending-type": "residential",
      "main-purpose": "FIRST-TIME-BUYER"
    },
    "financial-commitment": [
      {
        "financial-commitments": {
          "financial-commitments": true,
          "total-repay-by-mortgage": 0,
          "commitment-details": financialCommitments,
          "main-purpose": "FIRST-TIME-BUYER"
        },
        "no-of-applicants": 1,
        "lending-type": "residential",
        "is-joint-flow": false
      }
    ],
    "applicant-summary": [
      {
        "applicant-id": "cc863d1e-71ef-11f0-b649-1375f2669fc",
        "title": "John Janardhan",
        "first-name": "John",
        "surname": "Janardhan",
        "middle-name": "Janardhan"
      }
    ]
  };
};

// Initialize the mock database
const initializeMockDatabase = () => {
  // Clear in-memory commitments for new cases
  if (!getIsResumeCase()) {
    financialCommitments = [];
    console.log('Mock database initialized for NEW case');
  } else {
    console.log(`Mock database initialized for RESUME case with application ID: ${getApplicationId()}`);
    // For resume case, we don't modify the sample commitments
  }
};

// Initialize on first load
initializeMockDatabase();

export const financialDetailsHandlers = [
  // We no longer need this endpoint as we're using local storage
  // But we'll keep it for backward compatibility
  http.get('/api/overviewxapi/application-status', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      isResume: getIsResumeCase(),
      applicationId: getIsResumeCase() ? getApplicationId() : null
    });
  }),

  // Get all financial commitments from overview API
  http.get('/api/overviewxapi/financial-commitments', async ({ request }) => {
    const url = new URL(request.url);
    const applicationId = url.searchParams.get('applicationId');
    
    await delay(500);
    
    const commitments = getCommitmentsByApplicationId(applicationId || undefined);
    
    return HttpResponse.json({
      success: true,
      data: commitments,
      applicationId: applicationId || (getIsResumeCase() ? getApplicationId() : null),
      dateOfBirth: mockPersonalDetails.dateOfBirth
    });
  }),

  // Save financial commitments
  http.post('/api/financial-commitments', async ({ request }) => {
    const { commitments, applicationId } = await request.json() as { 
      commitments: FinancialCommitment[],
      applicationId?: string 
    };
    
    await delay(300);
    
    // Simulate failure for testing error handling
    if (shouldFail()) {
      console.log('POST financial-commitments - simulating failure');
      return new HttpResponse(JSON.stringify({
        success: false,
        message: 'Server error: Failed to save financial commitments'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Just return success - we're using optimistic updates in the UI
    // No need to modify the data on the server
    console.log('POST financial-commitments - returning success');
    
    return HttpResponse.json({
      success: true,
      message: 'Commitments saved successfully'
    });
  }),

  // Save debt consolidation data
  http.post('/api/debt-consolidation', async ({ request }) => {
    await delay(800);
    
    try {
      const body = await request.json() as any;
      console.log('POST debt-consolidation - received data:', body);
      
      // In a real implementation, this would save to database
      // For now, just return success
      return HttpResponse.json({
        success: true,
        message: 'Debt consolidation data saved successfully',
        data: body.data
      });
    } catch (error) {
      console.error('Error saving debt consolidation:', error);
      return HttpResponse.json({
        success: false,
        message: 'Failed to save debt consolidation data'
      }, {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),

  // Reset the mock application state (for testing)
  http.post('/api/reset-mock-application', async ({ request }) => {
    const { forceResume } = await request.json() as { forceResume?: boolean };
    
    // This endpoint will now update the local storage directly
    // The actual implementation is in applicationStorage.ts
    // We'll just return the current state
    
    return HttpResponse.json({
      success: true,
      isResume: getIsResumeCase(),
      applicationId: getIsResumeCase() ? getApplicationId() : null
    });
  })
];
