import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
  CircularProgress,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import TubeStopStepper from '../../../components/common/TubeStopStepper';
import { FinancialCommitment } from '../types';
import { useFinancialCommitments } from '../hooks/useFinancialCommitments';
import { ArrowBack } from '@mui/icons-material';
import { useNavigation, FinancialDetailsStep } from '../contexts/NavigationContext';

interface DebtConsolidationPageProps {
  onBack?: () => void;
}

const DebtConsolidationPage: React.FC<DebtConsolidationPageProps> = ({ onBack }) => {
  // Use the navigation context instead of local state for activeStep
  const { currentStep } = useNavigation();
  // For DebtConsolidationPage, we should always use 1 as the activeStep
  // This ensures the stepper shows the second step as active
  const activeStep = 1;
  
  // Log the current step and activeStep for debugging
  console.log('DebtConsolidationPage - currentStep:', currentStep);
  console.log('DebtConsolidationPage - activeStep:', activeStep);
  const { 
    commitments, 
    isSaving, 
    saveCommitments, 
    toggleIncludeInMortgage 
  } = useFinancialCommitments();
  
  // Steps for the tube stop stepper
  const steps = ['Financial commitments', 'Debt consolidation'];

  // Format currency for display
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  // Helper function to get readable commitment type
  const getCommitmentTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      credit_card: 'Credit card / store card',
      buy_now_pay_later: 'Buy now, pay later instalments',
      catalogue_instalments: 'Catalogue instalments',
      childcare_fees: 'Childcare or school fees',
      credit_agreement: 'Credit agreement',
      guarantor_existing_borrowing: 'Guarantor on existing borrowing',
      guarantor_rental_agreement: 'Guarantor on rental agreement',
      hire_purchase: 'Hire purchase (HP) or PCP',
      maintenance: 'Maintenance for ex-partner or child',
      overdraft: 'Overdraft',
      overdraft_secured: 'Overdraft secured against investment',
      personal_loan: 'Personal loan',
      point_of_sale_finance: 'Point-of-sale finance',
      secured_personal_loan: 'Secured personal loan',
      shared_equity_loan: 'Shared equity loan',
      student_loan: 'Student loan',
      other: 'Other regular payments',
    };
    
    return typeMap[type] || type;
  };

  // Toggle include in mortgage
  const handleToggleIncludeInMortgage = (id: string, currentValue: boolean) => {
    toggleIncludeInMortgage(id, !currentValue);
  };

  // Handle saving and proceeding to next step
  const handleNext = async () => {
    const success = await saveCommitments();
    if (success) {
      // Navigate to next step
      console.log('Navigate to next step');
    }
  };

  // Handle saving and returning to overview
  const handleSaveAndReturn = async () => {
    const success = await saveCommitments();
    if (success) {
      // Navigate back to overview
      console.log('Navigate back to overview');
    }
  };

  // Handle going back to financial commitments
  const handleBack = () => {
    // Navigate back to financial commitments
    if (onBack) {
      onBack();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            sx={{ mr: 2 }}
            onClick={handleSaveAndReturn}
          >
            Financial details
          </Button>
        </Box>

        <TubeStopStepper steps={steps} activeStep={activeStep} />

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Debt consolidation
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Step 2 of 2: Debt consolidation
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {commitments.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No financial commitments have been added. Please go back and add commitments first.
            </Alert>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Select which debts to consolidate into the mortgage
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Select the commitments that will be repaid using this mortgage.
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Commitment</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="center">Include in mortgage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commitments.map((commitment) => (
                      <TableRow key={commitment.id}>
                        <TableCell>{getCommitmentTypeLabel(commitment.type)}</TableCell>
                        <TableCell align="right">{formatCurrency(commitment.balance)}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={commitment.includeInMortgage}
                            onChange={() => handleToggleIncludeInMortgage(commitment.id, commitment.includeInMortgage)}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {isSaving === false && commitments.length > 0 && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  Debt consolidation preferences saved successfully.
                </Alert>
              )}
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={handleSaveAndReturn}
              disabled={isSaving}
            >
              Save and return to overview
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
                disabled={isSaving}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                disabled={isSaving}
              >
                {isSaving ? <CircularProgress size={24} /> : 'Next'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DebtConsolidationPage;
