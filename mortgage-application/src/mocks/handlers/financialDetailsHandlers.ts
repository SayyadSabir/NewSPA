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

// Sample financial commitments for resume case (in API format)
const sampleApiCommitments = [
  {
    "applicant-details": {
      "applicant-id": "123",
      "applicant-name": "John Doe"
    },
    "type-of-commitment": "Personal Loan",
    "outstanding-balance": {
      "amount": 5000,
      "currency": "GBP"
    },
    "monthly-payment": {
      "amount": 250,
      "currency": "GBP"
    },
    "term-remaining": {
      "no-of-years": 2,
      "no-of-months": 6
    },
    "completion-status": "nothing",
    "notes": "Personal loan for home improvements",
    "include-in-mortgage": false,
    "id": "1"
  },
  {
    "applicant-details": {
      "applicant-id": "123",
      "applicant-name": "John Doe"
    },
    "type-of-commitment": "Hire Purchase",
    "outstanding-balance": {
      "amount": 15000,
      "currency": "GBP"
    },
    "monthly-payment": {
      "amount": 400,
      "currency": "GBP"
    },
    "term-remaining": {
      "no-of-years": 3,
      "no-of-months": 0
    },
    "completion-status": "nothing",
    "notes": "Car hire purchase agreement",
    "include-in-mortgage": false,
    "has-bullet-payment": true,
    "bullet-payment-amount": {
      "amount": 5000,
      "currency": "GBP"
    },
    "id": "2"
  },
  {
    "applicant-details": {
      "applicant-id": "123",
      "applicant-name": "John Doe"
    },
    "type-of-commitment": "Credit Card",
    "outstanding-balance": {
      "amount": 2500,
      "currency": "GBP"
    },
    "monthly-payment": {
      "amount": 150,
      "currency": "GBP"
    },
    "completion-status": "paid_in_full",
    "commitment-amount-to-repaid": {
      "amount": 2500,
      "currency": "GBP"
    },
    "notes": "Credit card debt to be paid off",
    "include-in-mortgage": true,
    "id": "3"
  },
  {
    "applicant-details": {
      "applicant-id": "123",
      "applicant-name": "John Doe"
    },
    "type-of-commitment": "Maintenance",
    "monthly-payment": {
      "amount": 800,
      "currency": "GBP"
    },
    "completion-status": "nothing",
    "notes": "Child maintenance payments",
    "include-in-mortgage": false,
    "id": "4"
  }
];

// Helper function to get commitments based on application ID
const getCommitmentsByApplicationId = (applicationId?: string) => {
  // If it's a resume case and we have an application ID, return sample API commitments (raw format)
  if (applicationId && getIsResumeCase()) {
    return sampleApiCommitments;
  }
  // Otherwise return the in-memory commitments (for new case)
  return financialCommitments;
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

  // Update a financial commitment
  http.put('/api/financial-commitments/:id', async ({ params, request }) => {
    const { id } = params;
    await delay(300);
    
    // Simulate failure for testing error handling
    if (shouldFail()) {
      console.log(`PUT financial-commitments/${id} - simulating failure`);
      return new HttpResponse(JSON.stringify({
        success: false,
        message: 'Server error: Failed to update financial commitment'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Just return success - we're using optimistic updates in the UI
    console.log(`PUT financial-commitments/${id} - returning success`);
    
    return HttpResponse.json({
      success: true,
      message: 'Commitment updated successfully'
    });
  }),

  // Delete a financial commitment
  http.delete('/api/financial-commitments/:id', async ({ params }) => {
    const { id } = params;
    await delay(300);
    
    // Simulate failure for testing error handling
    if (shouldFail()) {
      console.log(`DELETE financial-commitments/${id} - simulating failure`);
      return new HttpResponse(JSON.stringify({
        success: false,
        message: 'Server error: Failed to delete financial commitment'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Just return success - we're using optimistic updates in the UI
    console.log(`DELETE financial-commitments/${id} - returning success`);
    
    return HttpResponse.json({
      success: true,
      message: `Commitment ${id} deleted successfully`
    });
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
