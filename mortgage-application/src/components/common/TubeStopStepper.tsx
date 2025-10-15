import React from "react";
import { Stepper, Step, StepLabel, Box, StepButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface TubeStopStepperProps {
  steps: string[];
  activeStep: number;
  completed?: { [k: number]: boolean };
  onStepClick?: (step: number) => void;
}

// Custom styled components for the tube stop stepper
const TubeStop = styled("div")(({ theme }) => ({
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.primary.contrastText,
}));

const TubeLine = styled("div")(({ theme }) => ({
  height: "4px",
  backgroundColor: theme.palette.primary.main,
  flex: 1,
}));

const TubeStopStepper: React.FC<TubeStopStepperProps> = ({
  steps,
  activeStep,
  completed = {},
  onStepClick,
}) => {
  // Log the activeStep value to help with debugging
  console.log("TubeStopStepper activeStep:", activeStep);
  console.log("TubeStopStepper completed steps:", completed);

  // Determine if a step is clickable (only if completed or current)
  const isStepClickable = (step: number) => {
    return completed[step] || step === activeStep;
  };

  // Handle step click if onStepClick is provided
  const handleStepClick = (step: number) => {
    if (onStepClick && isStepClickable(step)) {
      onStepClick(step);
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<TubeLine />}
      >
        {steps.map((label, index) => {
          // A step is completed if it's in the completed object or if it's before the active step
          const isCompleted = completed[index] === true;

          return (
            <Step key={label} completed={isCompleted}>
              {onStepClick ? (
                <StepButton
                  onClick={() => handleStepClick(index)}
                  disabled={!isStepClickable(index)}
                  optional={null}
                  icon={<TubeStop>{index + 1}</TubeStop>}
                >
                  {label}
                </StepButton>
              ) : (
                <StepLabel
                  StepIconComponent={() => <TubeStop>{index + 1}</TubeStop>}
                >
                  {label}
                </StepLabel>
              )}
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default TubeStopStepper;
