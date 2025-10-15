import React from "react";
import { Box, Typography, Divider } from "@mui/material";

interface TotalCommitmentDisplayProps {
  totalAmount: number;
}

const TotalCommitmentDisplay: React.FC<TotalCommitmentDisplayProps> = ({
  totalAmount,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: "medium" }}>
          Total commitments to be repaid using new mortgage
        </Typography>
        <Typography variant="h6" color="primary">
          {formatCurrency(totalAmount)}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
    </>
  );
};

export default TotalCommitmentDisplay;
