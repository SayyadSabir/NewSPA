import React from 'react';
import { Box, Stepper, Step, StepLabel, styled } from '@mui/material';

interface TubeStopStepperProps {
  steps: string[];
  activeStep: number;
}

// Custom styled components for the tube stop stepper
const TubeStop = styled('div')(({ theme }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.primary.contrastText,
}));

const TubeLine = styled('div')(({ theme }) => ({
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  flex: 1,
}));

const TubeStopStepper: React.FC<TubeStopStepperProps> = ({ steps, activeStep }) => {
  // Log the activeStep value to help with debugging
  console.log('TubeStopStepper activeStep:', activeStep);
  
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel connector={
        <TubeLine />
      }>
        {steps.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel StepIconComponent={() => <TubeStop>{index + 1}</TubeStop>}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TubeStopStepper;
