import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FinancialCommitment } from "../types";

interface CommitmentsListProps {
  commitments: FinancialCommitment[];
  onEdit: (commitment: FinancialCommitment) => void;
  onDelete: (id: string) => void;
}

// Helper function to format currency
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};

// Helper function to get readable commitment type
const getCommitmentTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    credit_card: "Credit card / store card",
    buy_now_pay_later: "Buy now, pay later instalments",
    catalogue_instalments: "Catalogue instalments",
    childcare_fees: "Childcare or school fees",
    credit_agreement: "Credit agreement",
    guarantor_existing_borrowing: "Guarantor on existing borrowing",
    guarantor_rental_agreement: "Guarantor on rental agreement",
    hire_purchase: "Hire purchase (HP) or PCP",
    maintenance: "Maintenance for ex-partner or child",
    overdraft: "Overdraft",
    overdraft_secured: "Overdraft secured against investment",
    personal_loan: "Personal loan",
    point_of_sale_finance: "Point-of-sale finance",
    secured_personal_loan: "Secured personal loan",
    shared_equity_loan: "Shared equity loan",
    student_loan: "Student loan",
    other: "Other regular payments",
  };

  return typeMap[type] || type;
};

// Helper function to get readable completion status
const getCompletionStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    commitment_already_repaid: "Commitment already repaid",
    lump_sum_payment: "Lump sum payment",
    paid_in_full: "Paid in full",
    nothing: "Nothing",
  };

  return statusMap[status] || status;
};

const CommitmentsList: React.FC<CommitmentsListProps> = ({
  commitments,
  onEdit,
  onDelete,
}) => {
  if (commitments.length === 0) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No financial commitments added yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Commitment</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Monthly payment</TableCell>
            <TableCell>At completion</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commitments.map((commitment) => (
            <TableRow key={commitment.id}>
              <TableCell>{getCommitmentTypeLabel(commitment.type)}</TableCell>
              <TableCell align="right">
                {formatCurrency(commitment.balance)}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(commitment.monthlyPayment)}
              </TableCell>
              <TableCell>
                {getCompletionStatusLabel(commitment.completionStatus)}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(commitment)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(commitment.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommitmentsList;
