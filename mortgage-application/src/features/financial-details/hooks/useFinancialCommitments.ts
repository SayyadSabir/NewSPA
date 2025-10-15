import { useCallback, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/index";
import {
  useGetFinancialCommitmentsQuery,
  useSaveFinancialCommitmentsMutation,
} from "../api/financialDetailsApi";
import { getApplicationId, isResumeCase } from "../utils/applicationStorage";
import { FinancialCommitment } from "../types";
import {
  setCommitments,
  updateCommitment,
  removeCommitment as removeCommitmentAction,
  addCommitment as addCommitmentAction,
} from "../slices/financialCommitmentsSlice";

export const useFinancialCommitments = () => {
  const dispatch = useDispatch();

  // Get application status from local storage - simplified approach
  const isResume = isResumeCase();
  const applicationId = isResume ? getApplicationId() : undefined;
  const isLoadingStatus = false; // No need for loading state with synchronous local storage

  // Get financial commitments with the application ID if it's a resume case
  const {
    data: apiCommitments,
    isLoading: isLoadingCommitments,
    error,
    refetch,
  } = useGetFinancialCommitmentsQuery(
    { applicationId },
    {
      // Skip the query if we're still loading the application status
      skip: isLoadingStatus,
    }
  );

  // Mutations for CRUD operations - only save mutation needed
  const [saveCommitments, { isLoading: isSaving }] =
    useSaveFinancialCommitmentsMutation();

  // Combined loading state
  const isLoading = isLoadingStatus || isLoadingCommitments || isSaving;

  // Track if form has been modified
  const [formModified, setFormModified] = useState(false);
  const initialCommitmentsRef = useRef<string>("");

  const commitments = useSelector(
    (state: RootState) => state.financialCommitments.commitments
  );

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
  console.log(initialCommitmentsRef.current, "initialCommitmentsRef.current");
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
          applicationId, // Include application ID for resume case
        }).unwrap();
        // Update initial state after successful save
        initialCommitmentsRef.current = JSON.stringify(commitments);
        setFormModified(false);
      }
      return true;
    } catch (error) {
      console.error("Failed to save commitments:", error);
      return false;
    }
  }, [commitments, saveCommitments, formModified, applicationId]);

  const handleUpdateCommitment = useCallback(
    async (updatedCommitment: FinancialCommitment) => {
      // Update local state via Redux
      dispatch(updateCommitment(updatedCommitment));

      // Save all commitments via API (including the updated one)
      try {
        const updatedCommitments = commitments.map((c) =>
          c.id === updatedCommitment.id ? updatedCommitment : c
        );
        await saveCommitments({
          commitments: updatedCommitments,
          applicationId,
        }).unwrap();
        return true;
      } catch (error) {
        console.error("Failed to save commitments after update:", error);
        return false;
      }
    },
    [dispatch, updateCommitment, commitments, saveCommitments, applicationId]
  );

  const handleToggleIncludeInMortgage = useCallback(
    async (id: string, include: boolean) => {
      const commitment = commitments.find((c) => c.id === id);
      if (commitment) {
        const updatedCommitment = {
          ...commitment,
          includeInMortgage: include,
        };
        // Update local state via Redux
        dispatch(updateCommitment(updatedCommitment));

        // Save all commitments via API
        try {
          const updatedCommitments = commitments.map((c) =>
            c.id === id ? updatedCommitment : c
          );
          await saveCommitments({
            commitments: updatedCommitments,
            applicationId,
          }).unwrap();
          return true;
        } catch (error) {
          console.error("Failed to save commitments after toggle:", error);
          return false;
        }
      }
      return false;
    },
    [commitments, dispatch, updateCommitment, saveCommitments, applicationId]
  );

  const handleRemoveCommitment = useCallback(
    async (id: string) => {
      // Update local state via Redux
      dispatch(removeCommitmentAction(id));

      // Save remaining commitments via API
      try {
        const remainingCommitments = commitments.filter((c) => c.id !== id);
        await saveCommitments({
          commitments: remainingCommitments,
          applicationId,
        }).unwrap();
        return true;
      } catch (error) {
        console.error("Failed to save commitments after delete:", error);
        return false;
      }
    },
    [
      dispatch,
      removeCommitmentAction,
      commitments,
      saveCommitments,
      applicationId,
    ]
  );

  const handleAddCommitment = useCallback(
    (commitment: Omit<FinancialCommitment, "id">) => {
      dispatch(addCommitmentAction(commitment));
    },
    [dispatch]
  );

  return {
    commitments,
    isLoading,
    isSaving,
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
    debtConsolidationCommitments: commitments.filter(
      (c) => c.includeInMortgage
    ),
  };
};
