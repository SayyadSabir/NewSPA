import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  ApplicantSummary,
  ApplicationSummary,
} from "../slices/applicationMetadataSlice";

export interface UseApplicationMetadataReturn {
  applicantSummary: ApplicantSummary[];
  applicationSummary: ApplicationSummary | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to access application metadata (applicant summary and application summary)
 * This data is automatically fetched when financial commitments are loaded
 */
export const useApplicationMetadata = (): UseApplicationMetadataReturn => {
  return useSelector((state: RootState) => state.applicationMetadata);
};

/**
 * Hook to get a specific applicant by ID
 */
export const useApplicantById = (
  applicantId: string
): ApplicantSummary | undefined => {
  const { applicantSummary } = useApplicationMetadata();
  return applicantSummary.find(
    (applicant) => applicant["applicant-id"] === applicantId
  );
};

/**
 * Hook to get the primary applicant (first in the list)
 */
export const usePrimaryApplicant = (): ApplicantSummary | undefined => {
  const { applicantSummary } = useApplicationMetadata();
  return applicantSummary[0];
};
