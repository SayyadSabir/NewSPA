import { http, HttpResponse, delay } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { FinancialCommitment } from '../features/financial-details/types';
import { financialDetailsHandlers } from './handlers/financialDetailsHandlers';

// In-memory mock database
let financialCommitments: FinancialCommitment[] = [];

// Mock personal details data - no longer using PersonalDetails type
const mockPersonalDetails = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1980-05-15', // This would make the person around 45 years old
  email: 'john.doe@example.com',
  phone: '555-123-4567'
};

// Legacy handlers - these will be deprecated in favor of the more specific handlers
const legacyHandlers = [
  // Get all financial commitments
  http.get('/api/financial-commitments', async () => {
    await delay(500);
    return HttpResponse.json({
      success: true,
      data: financialCommitments,
    });
  }),

  // Save financial commitments
  http.post('/api/financial-commitments', async ({ request }) => {
    const { commitments } = await request.json() as { commitments: FinancialCommitment[] };
    await delay(500);
    
    // Add IDs to any commitments that don't have them
    const commitmentsWithIds = commitments.map((commitment: FinancialCommitment) => ({
      ...commitment,
      id: commitment.id || uuidv4(),
    }));
    
    financialCommitments = commitmentsWithIds;
    
    return HttpResponse.json({
      success: true,
      data: financialCommitments,
    });
  }),

  // Update a financial commitment
  http.put('/api/financial-commitments/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedCommitment = await request.json() as FinancialCommitment;
    await delay(500);
    
    const index = financialCommitments.findIndex(
      (commitment) => commitment.id === id
    );
    
    if (index !== -1) {
      financialCommitments[index] = {
        ...updatedCommitment,
        id: id as string,
      };
      
      return HttpResponse.json({
        success: true,
        data: financialCommitments,
      });
    }
    
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Commitment not found',
    });
  }),

  // Delete a financial commitment
  http.delete('/api/financial-commitments/:id', async ({ params }) => {
    const { id } = params;
    await delay(500);
    
    const initialLength = financialCommitments.length;
    financialCommitments = financialCommitments.filter(
      (commitment) => commitment.id !== id
    );
    
    if (financialCommitments.length < initialLength) {
      return HttpResponse.json({
        success: true,
        data: financialCommitments,
      });
    }
    
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Commitment not found',
    });
  }),

  // Get personal details
  // Personal details API endpoint removed - dateOfBirth now included in financial commitments response
];

// Combine all handlers
export const handlers = [
  ...financialDetailsHandlers,
  ...legacyHandlers
];
