import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { DebtConsolidationFormData } from '../../slices/debtConsolidationSlice';

interface RenegotiationFieldProps {
  register: UseFormRegister<DebtConsolidationFormData>;
  setValue: UseFormSetValue<DebtConsolidationFormData>;
  value?: boolean;
  isVisible: boolean;
}

const RenegotiationField: React.FC<RenegotiationFieldProps> = ({
  register,
  setValue,
  value,
  isVisible,
}) => {
  if (!isVisible) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('consideredRenegotiatingWithCreditors', event.target.value === 'Yes');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 2 }}>
          Have they considered renegotiating their payments with their creditors?
        </FormLabel>
        <RadioGroup
          value={value ? 'Yes' : 'No'}
          onChange={handleChange}
        >
          <FormControlLabel
            value="Yes"
            control={<Radio />}
            label="Yes"
          />
          <FormControlLabel
            value="No"
            control={<Radio />}
            label="No"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default RenegotiationField;
