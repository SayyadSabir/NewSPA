import { useCallback, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/index';
import { 
  useGetFinancialCommitmentsQuery,
  useSaveFinancialCommitmentsMutation,
  useUpdateFinancialCommitmentMutation as useUpdateCommitmentMutation,
  useDeleteFinancialCommitmentMutation as useDeleteCommitmentMutation 
} from '../api/financialDetailsApi';
import { getApplicationId, isResumeCase } from '../utils/applicationStorage';
import { FinancialCommitment } from '../types';
import { setCommitments, updateCommitment, removeCommitment as removeCommitmentAction, addCommitment as addCommitmentAction } from '../slices/financialCommitmentsSlice';

export const useFinancialCommitments = () => {
  const dispatch = useDispatch();
  
  // Get application status from local storage - simplified approach
  const isResume = isResumeCase();
  const applicationId = isResume ? getApplicationId() : undefined;
  const isLoadingStatus = false; // No need for loading state with synchronous local storage
  
  // Get financial commitments with the application ID if it's a resume case
  const { data: apiCommitments, isLoading: isLoadingCommitments, error, refetch } = 
    useGetFinancialCommitmentsQuery({ applicationId }, {
      // Skip the query if we're still loading the application status
      skip: isLoadingStatus
    });
  
  // Mutations for CRUD operations
  const [saveCommitments, { isLoading: isSaving }] = useSaveFinancialCommitmentsMutation();
  const [updateCommitmentApi, { isLoading: isUpdating }] = useUpdateCommitmentMutation();
  const [deleteCommitmentApi, { isLoading: isDeleting }] = useDeleteCommitmentMutation();
  
  // Combined loading state
  const isLoading = isLoadingStatus || isLoadingCommitments;
  
  // Track if form has been modified
  const [formModified, setFormModified] = useState(false);
  const initialCommitmentsRef = useRef<string>('');
  
  const commitments = useSelector((state: RootState) => state.financialCommitments.commitments);

  // Store initial commitments when loaded from API and dispatch to Redux
  useEffect(() => {
    if (apiCommitments) {
      // Store the initial commitments for comparison
      if (!initialCommitmentsRef.current) {
        initialCommitmentsRef.current = JSON.stringify(apiCommitments);
      }
      
      // Dispatch to Redux store
      dispatch(setCommitments(apiCommitments));
    }
  }, [apiCommitments, dispatch]);

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
        await saveCommitments({ 
          commitments,
          applicationId // Include application ID for resume case
        }).unwrap();
        // Update initial state after successful save
        initialCommitmentsRef.current = JSON.stringify(commitments);
        setFormModified(false);
      }
      return true;
    } catch (error) {
      console.error('Failed to save commitments:', error);
      return false;
    }
  }, [commitments, saveCommitments, formModified, applicationId]);

  const handleUpdateCommitment = useCallback(async (updatedCommitment: FinancialCommitment) => {
    // Update local state via Redux
    dispatch(updateCommitment(updatedCommitment));
    
    // Also update via API
    try {
      // Use the renamed API mutation
      await updateCommitmentApi({
        commitment: updatedCommitment,
        applicationId
      }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to update commitment:', error);
      return false;
    }
  }, [dispatch, updateCommitment, applicationId]);

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

  const handleRemoveCommitment = useCallback(async (id: string) => {
    // Update local state via Redux
    dispatch(removeCommitmentAction(id));
    
    // Also delete via API
    try {
      await deleteCommitmentApi({
        id,
        applicationId
      }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete commitment:', error);
      return false;
    }
  }, [dispatch, deleteCommitmentApi, applicationId]);

  const handleAddCommitment = useCallback((commitment: Omit<FinancialCommitment, 'id'>) => {
    dispatch(addCommitmentAction(commitment));
  }, [dispatch]);

  return {
    commitments,
    isLoading,
    isSaving,
    isUpdating,
    isDeleting,
    error,
    refetch,
    formModified,
    isResume,
    applicationId,
    saveCommitments: handleSaveCommitments,
    updateCommitment: handleUpdateCommitment,
    removeCommitment: handleRemoveCommitment,
    addCommitment: handleAddCommitment,
    toggleIncludeInMortgage: handleToggleIncludeInMortgage,
    debtConsolidationCommitments: commitments.filter(c => c.includeInMortgage)
  };
};
