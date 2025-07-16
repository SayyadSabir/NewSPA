import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  TextField,
  Grid,
  FormHelperText,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { usePersonalDetailsValidation } from '../../hooks/usePersonalDetailsValidation';
import { FieldConfig } from './CommitmentFieldConfig';

interface RetirementAgeFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  fieldConfig?: FieldConfig;
}

export const RetirementAgeField: React.FC<RetirementAgeFieldProps> = ({ control, errors }) => {
  const { validateRetirementAge, isLoading, maxRetirementAge } = usePersonalDetailsValidation();

  return (
    <Grid item xs={12} md={6}>
      <Controller
        name="retirementAge"
        control={control}
        rules={{
          required: 'Retirement age is required',
          min: { value: 55, message: 'Retirement age must be at least 55' },
          validate: validateRetirementAge
        }}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              label="Retirement Age"
              type="number"
              fullWidth
              error={!!errors.retirementAge}
              helperText={errors.retirementAge?.message?.toString()}
              disabled={isLoading}
              InputProps={{
                endAdornment: isLoading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />
            {maxRetirementAge !== null && !errors.retirementAge && (
              <FormHelperText>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Maximum retirement age based on your date of birth: {maxRetirementAge}
                  </Typography>
                </Box>
              </FormHelperText>
            )}
          </>
        )}
      />
    </Grid>
  );
};
