import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { Box, TextField } from "@mui/material";
import { DebtConsolidationFormData } from "../../slices/debtConsolidationSlice";

interface AdditionalInfoFieldProps {
  register: UseFormRegister<DebtConsolidationFormData>;
  watch: UseFormWatch<DebtConsolidationFormData>;
}

const AdditionalInfoField: React.FC<AdditionalInfoFieldProps> = ({
  register,
  watch,
}) => {
  const reasonDesc = watch("reasonForConsolidateDesc");

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        {...register("reasonForConsolidateDesc")}
        fullWidth
        multiline
        rows={3}
        label="Please give more information"
        placeholder="Characters 0/1000"
        inputProps={{ maxLength: 1000 }}
        helperText={`${reasonDesc?.length || 0}/1000 characters`}
      />
    </Box>
  );
};

export default AdditionalInfoField;
