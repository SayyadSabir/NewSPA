import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import { DebtConsolidationFormData } from '../../slices/debtConsolidationSlice';

interface AttestationFieldsProps {
  register: UseFormRegister<DebtConsolidationFormData>;
  showFirstAttestation: boolean;
  showSecondAttestation: boolean;
  firstAttestationValue?: boolean;
  secondAttestationValue?: boolean;
}

const AttestationFields: React.FC<AttestationFieldsProps> = ({
  register,
  showFirstAttestation,
  showSecondAttestation,
  firstAttestationValue,
  secondAttestationValue,
}) => {
  return (
    <>
      {/* First attestation - always show when having difficulty */}
      {showFirstAttestation && (
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                {...register('attestationClientUnderstandImplication')}
              />
            }
            label="The client understands the implications of securing a previously unsecured debt and that there could be an additional cost if they take a lower rate over a longer term."
          />
        </Box>
      )}

      {/* Second attestation - only show when considered renegotiating */}
      {showSecondAttestation && (
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                {...register('attestationClientConsideredRenegotiation')}
              />
            }
            label="The client has considered renegotiating their payments with their creditors and is happy to proceed. They understand the implications of securing a previously unsecured debt and that there could be an additional cost if they take a lower rate over a longer term."
          />
        </Box>
      )}
    </>
  );
};

export default AttestationFields;
