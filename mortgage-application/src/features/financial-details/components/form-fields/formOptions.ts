import { CommitmentType, CompletionStatus } from '../../types';

export const commitmentTypeOptions: { value: CommitmentType; label: string }[] = [
  { value: 'credit_card', label: 'Credit card / store card' },
  { value: 'buy_now_pay_later', label: 'Buy now, pay later instalments' },
  { value: 'catalogue_instalments', label: 'Catalogue instalments' },
  { value: 'childcare_fees', label: 'Childcare or school fees' },
  { value: 'credit_agreement', label: 'Credit agreement' },
  { value: 'guarantor_existing_borrowing', label: 'Guarantor on existing borrowing' },
  { value: 'guarantor_rental_agreement', label: 'Guarantor on rental agreement' },
  { value: 'hire_purchase', label: 'Hire purchase (HP) or personal contract purchase (PCP)' },
  { value: 'maintenance', label: 'Maintenance for ex-partner or child' },
  { value: 'overdraft', label: 'Overdraft' },
  { value: 'overdraft_secured', label: 'Overdraft secured against investment portfolio' },
  { value: 'personal_loan', label: 'Personal loan or point-of-sale finance' },
  { value: 'secured_personal_loan', label: 'Secured personal loan' },
  { value: 'shared_equity_loan', label: 'Shared equity loan for another property' },
  { value: 'student_loan', label: 'Student loan' },
  { value: 'other', label: 'Other regular payments' },
];

export const completionStatusOptions: { value: CompletionStatus; label: string }[] = [
  { value: 'commitment_already_repaid', label: 'Commitment already repaid' },
  { value: 'lump_sum_payment', label: 'Lump sum payment' },
  { value: 'paid_in_full', label: 'Paid in full' },
  { value: 'nothing', label: 'Nothing' },
];
