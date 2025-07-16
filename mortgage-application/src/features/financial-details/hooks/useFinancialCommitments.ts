import { useCallback, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/index';
import { 
  useGetFinancialCommitmentsQuery, 
  useSaveFinancialCommitmentsMutation 
} from '../api/financialDetailsApi';
import { FinancialCommitment } from '../types';
import { setCommitments, updateCommitment, removeCommitment as removeCommitmentAction, addCommitment as addCommitmentAction } from '../slices/financialCommitmentsSlice';

export const useFinancialCommitments = () => {
  const dispatch = useDispatch();
  const { data: apiCommitments, isLoading, error, refetch } = useGetFinancialCommitmentsQuery();
  const [saveCommitments, { isLoading: isSaving }] = useSaveFinancialCommitmentsMutation();
  
  // Track if form has been modified
  const [formModified, setFormModified] = useState(false);
  const initialCommitmentsRef = useRef<string>('');
  
  const commitments = useSelector((state: RootState) => state.financialCommitments.commitments);

  // Store initial commitments when loaded from API
  useEffect(() => {
    if (apiCommitments && !initialCommitmentsRef.current) {
      initialCommitmentsRef.current = JSON.stringify(apiCommitments);
    }
  }, [apiCommitments]);

  // Check if commitments have changed
  useEffect(() => {
    if (initialCommitmentsRef.current) {
      const currentCommitments = JSON.stringify(commitments);
      setFormModified(currentCommitments !== initialCommitmentsRef.current);
    }
  }, [commitments]);

  const handleSaveCommitments = useCallback(async () => {
    try {
      // Only save if form has been modified
      if (formModified) {
        await saveCommitments({ commitments }).unwrap();
        // Update initial state after successful save
        initialCommitmentsRef.current = JSON.stringify(commitments);
        setFormModified(false);
      }
      return true;
    } catch (error) {
      console.error('Failed to save commitments:', error);
      return false;
    }
  }, [commitments, saveCommitments, formModified]);

  const handleUpdateCommitment = useCallback((updatedCommitment: FinancialCommitment) => {
    dispatch(updateCommitment(updatedCommitment));
  }, [dispatch]);

  const handleToggleIncludeInMortgage = useCallback((id: string, include: boolean) => {
    const commitment = commitments.find(c => c.id === id);
    if (commitment) {
      const updatedCommitment = {
        ...commitment,
        includeInMortgage: include
      };
      dispatch(updateCommitment(updatedCommitment));
    }
  }, [commitments, dispatch]);

  const handleRemoveCommitment = useCallback((id: string) => {
    dispatch(removeCommitmentAction(id));
  }, [dispatch]);

  const handleAddCommitment = useCallback((commitment: Omit<FinancialCommitment, 'id'>) => {
    dispatch(addCommitmentAction(commitment));
  }, [dispatch]);

  return {
    commitments,
    isLoading,
    isSaving,
    error,
    refetch,
    formModified,
    saveCommitments: handleSaveCommitments,
    updateCommitment: handleUpdateCommitment,
    removeCommitment: handleRemoveCommitment,
    addCommitment: handleAddCommitment,
    toggleIncludeInMortgage: handleToggleIncludeInMortgage,
    debtConsolidationCommitments: commitments.filter(c => c.includeInMortgage)
  };
};
