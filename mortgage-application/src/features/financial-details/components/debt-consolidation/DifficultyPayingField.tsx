import React from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { DebtConsolidationFormData } from "../../slices/debtConsolidationSlice";

interface DifficultyPayingFieldProps {
  register: UseFormRegister<DebtConsolidationFormData>;
  setValue: UseFormSetValue<DebtConsolidationFormData>;
  value?: boolean;
}

const DifficultyPayingField: React.FC<DifficultyPayingFieldProps> = ({
  register,
  setValue,
  value,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      "havingDifficultyPayingExistingFinancialCommitment",
      event.target.value === "Yes"
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 2 }}>
          Is the client having difficulty paying their existing financial
          commitments?
        </FormLabel>
        <RadioGroup value={value ? "Yes" : "No"} onChange={handleChange}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default DifficultyPayingField;
