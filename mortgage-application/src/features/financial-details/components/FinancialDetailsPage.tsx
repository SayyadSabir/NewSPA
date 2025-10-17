import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TubeStopStepper from "../../../components/common/TubeStopStepper";
import CommitmentForm, { CommitmentFormRef } from "./CommitmentForm";
import CommitmentsList from "./CommitmentsList";
import { FinancialCommitment } from "../types";
import { useFinancialCommitments } from "../hooks/useFinancialCommitments";
// No longer using NavigationContext

interface FinancialDetailsPageProps {
  onNext?: () => void;
  onSaveAndReturn?: () => void;
}

const FinancialDetailsPage: React.FC<FinancialDetailsPageProps> = ({
  onNext,
  onSaveAndReturn,
}) => {
  // We're on the first step of the stepper
  const activeStep = 0;

  // Log the activeStep for debugging
  console.log("FinancialDetailsPage - activeStep:", activeStep);
  const [hasCommitments, setHasCommitments] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCommitment, setEditingCommitment] =
    useState<FinancialCommitment | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Refs for form validation
  const addFormRef = useRef<CommitmentFormRef>(null);
  const editFormRef = useRef<CommitmentFormRef>(null);

  // Use our custom hook for financial commitments
  const {
    commitments,
    isLoading: isLoadingCommitments,
    isSaving,
    error: fetchError,
    saveCommitments,
    updateCommitment,
    addCommitment,
    removeCommitment,
    refetch,
    formModified,
  } = useFinancialCommitments();

  // Steps for the tube stop stepper
  const steps = ["Financial commitments", "Debt consolidation"];

  // Handle adding a new commitment
  const handleAddCommitment = (commitment: Omit<FinancialCommitment, "id">) => {
    addCommitment(commitment);
    // Don't close the form - let user add another commitment
    // Form will reset itself after submission
  };

  // Handle updating an existing commitment
  const handleUpdateCommitment = (commitment: FinancialCommitment) => {
    updateCommitment(commitment);
    setEditingCommitment(null);
    setShowForm(false);
  };

  // Handle removing a commitment
  const handleRemoveCommitment = (id: string) => {
    removeCommitment(id);
  };

  // Handle editing a commitment
  const handleEditCommitment = (commitment: FinancialCommitment) => {
    setEditingCommitment(commitment);
    setShowForm(false); // Close the add form if it's open
  };

  // Handle saving and proceeding to next step
  const handleNext = async () => {
    // Check if there's an open form that needs validation
    if (showForm || editingCommitment) {
      const formRef = showForm ? addFormRef : editFormRef;
      const isValid = await formRef.current?.validateForm();

      if (!isValid) {
        setValidationError(
          "Please fill in all required fields before proceeding."
        );
        return;
      }

      // Check if form has unsaved changes
      const hasUnsavedChanges = formRef.current?.hasUnsavedChanges();
      if (hasUnsavedChanges) {
        setValidationError(
          "Please save or cancel the current commitment before proceeding."
        );
        return;
      }
    }

    // Clear any validation errors
    setValidationError(null);

    // If no changes, proceed without API call
    if (!formModified) {
      if (onNext) {
        onNext(); // This will call navigateToNext from the context
      }
      return;
    }

    const success = await saveCommitments();
    if (success) {
      if (onNext) {
        onNext(); // This will call navigateToNext from the context
      }
    }
  };

  // Handle saving and returning to overview
  const handleSaveAndReturn = async () => {
    let shouldSave = formModified;
    
    // Check if there's an open form that needs validation
    if (showForm || editingCommitment) {
      const formRef = showForm ? addFormRef : editFormRef;
      const isValid = await formRef.current?.validateForm();

      if (!isValid) {
        setValidationError("Please fill in all required fields before saving.");
        return;
      }

      // Check if form has unsaved changes
      const hasUnsavedChanges = formRef.current?.hasUnsavedChanges();
      if (hasUnsavedChanges) {
        console.log('Auto-saving form with unsaved changes...')
        // Auto-save the form data instead of showing error
        const formValues = formRef.current?.getFormValues();
        console.log('Form values to save:', formValues)
        
        if (formValues) {
          let updatedCommitments = [...commitments];
          
          // If editing, update the commitment in the array
          if (editingCommitment) {
            updatedCommitments = commitments.map((c) =>
              c.id === editingCommitment.id ? (formValues as FinancialCommitment) : c
            );
            handleUpdateCommitment(formValues as FinancialCommitment);
          } else {
            // If adding new, add the commitment to the array
            const { id, ...commitmentWithoutId } = formValues;
            const newCommitment = {
              ...commitmentWithoutId,
              id: `temp-${Date.now()}`, // Temporary ID
            } as FinancialCommitment;
            updatedCommitments = [...commitments, newCommitment];
            handleAddCommitment(commitmentWithoutId);
          }
          
          // Mark that we need to save and pass the updated commitments
          shouldSave = true;
          console.log('Updated commitments to save:', updatedCommitments);
          
          // Save with the updated commitments array directly
          const success = await saveCommitments(true, updatedCommitments);
          if (success) {
            onSaveAndReturn();
          }
          return; // Exit early since we already saved
        }
      }
    }

    // Clear any validation errors
    setValidationError(null);

    console.log('Saving commitments to API...', 'Total commitments:', commitments.length);
    // Force save even if formModified hasn't updated yet (after auto-saving form)
    const success = await saveCommitments(shouldSave);
    if (success) {
      onSaveAndReturn();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
            onClick={handleSaveAndReturn}
          >
            Financial details
          </Button>
        </Box>

        <TubeStopStepper steps={steps} activeStep={activeStep} />

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Financial commitments
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Step 1 of 2: Financial commitments
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              What financial commitments to include
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li">
                Buy now, pay later instalments
              </Typography>
              <Typography component="li">Catalogue instalments</Typography>
              <Typography component="li">Childcare or school fees</Typography>
              <Typography component="li">Credit agreement</Typography>
              <Typography component="li">
                Credit card, store card or revolving finance (including any
                repaid in the last 60 days)
              </Typography>
              <Typography component="li">
                Guarantor on existing borrowing
              </Typography>
              <Typography component="li">
                Guarantor on rental agreement
              </Typography>
              <Typography component="li">
                Hire purchase (HP) or personal contract purchase (PCP)
              </Typography>
              <Typography component="li">
                Maintenance for ex-partner or child
              </Typography>
              <Typography component="li">Overdraft</Typography>
              <Typography component="li">
                Overdraft secured against investment portfolio
              </Typography>
              <Typography component="li">
                Personal loan or point-of-sale finance (including any repaid in
                the last 60 days)
              </Typography>
              <Typography component="li">Secured personal loan</Typography>
              <Typography component="li">
                Shared equity loan for another property
              </Typography>
              <Typography component="li">Student loan</Typography>
              <Typography component="li">Other regular payments</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: "italic", mt: 2 }}>
              Don't include salary sacrifice commitments – these are only needed
              when completing a full application.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Does your client have any financial commitments?
              </FormLabel>
              <RadioGroup
                row
                value={
                  hasCommitments === null ? "" : hasCommitments ? "yes" : "no"
                }
                onChange={(e) => {
                  const hasCommitmentsValue = e.target.value === "yes";
                  setHasCommitments(hasCommitmentsValue);
                  // Automatically show form when user selects 'Yes' and no commitments exist
                  if (hasCommitmentsValue && commitments.length === 0) {
                    setShowForm(true);
                  }
                }}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Box>

          {hasCommitments && (
            <>
              {isLoadingCommitments ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : fetchError ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Error with commitments: {fetchError.toString()}
                </Alert>
              ) : (
                <>
                  {commitments.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <CommitmentsList
                        commitments={commitments}
                        onEdit={handleEditCommitment}
                        onDelete={handleRemoveCommitment}
                      />
                    </Box>
                  )}

                  {validationError && (
                    <Alert
                      severity="error"
                      sx={{ mb: 3 }}
                      onClose={() => setValidationError(null)}
                    >
                      {validationError}
                    </Alert>
                  )}

                  {editingCommitment ? (
                    <CommitmentForm
                      ref={editFormRef}
                      existingCommitment={editingCommitment}
                      onUpdateCommitment={handleUpdateCommitment}
                      onAddCommitment={handleAddCommitment}
                      onCancel={() => setEditingCommitment(null)}
                    />
                  ) : showForm ? (
                    <CommitmentForm
                      ref={addFormRef}
                      onAddCommitment={handleAddCommitment}
                      onCancel={() => setShowForm(false)}
                      currentCommitmentCount={commitments.length}
                    />
                  ) : commitments.length > 0 ? (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowForm(true)}
                        disabled={commitments.length >= 5}
                      >
                        Add another commitment
                      </Button>
                      {commitments.length >= 5 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          Maximum of 5 commitments reached
                        </Typography>
                      )}
                    </Box>
                  ) : null}
                </>
              )}
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleSaveAndReturn}
              disabled={isSaving}
            >
              Save and return to overview
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {isSaving ? <CircularProgress size={24} /> : "Next"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default FinancialDetailsPage;
