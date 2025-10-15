import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { DebtConsolidationFormData } from "../../slices/debtConsolidationSlice";

interface ReasonForConsolidationFieldProps {
  register: UseFormRegister<DebtConsolidationFormData>;
  errors: FieldErrors<DebtConsolidationFormData>;
}

const ReasonForConsolidationField: React.FC<
  ReasonForConsolidationFieldProps
> = ({ register, errors }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 2 }}>
          Reason for wanting to use the new mortgage to consolidate debt
        </FormLabel>
        <RadioGroup
          {...register("reasonForUsingNewMortgageToConsolidateDebt", {
            required: "Please select a reason",
          })}
        >
          <FormControlLabel
            value="Reduce monthly outgoings"
            control={<Radio />}
            label="Reduce monthly outgoings"
          />
          <FormControlLabel
            value="Reduce interest rate"
            control={<Radio />}
            label="Reduce interest rate"
          />
          <FormControlLabel
            value="Other"
            control={<Radio />}
            label="Another reason"
          />
        </RadioGroup>
        {errors.reasonForUsingNewMortgageToConsolidateDebt && (
          <Typography color="error" variant="caption">
            {errors.reasonForUsingNewMortgageToConsolidateDebt.message}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default ReasonForConsolidationField;
