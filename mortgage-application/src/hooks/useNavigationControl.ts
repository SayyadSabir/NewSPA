import { useEffect } from "react";
import { setupCompleteNavigationControl } from "../utils/navigationControl";

/**
 * Custom hook to prevent browser back navigation and clear history
 *
 * @param {boolean} enabled - Whether the navigation control should be enabled
 * @returns {void}
 *
 * @example
 * // In a component:
 * function MySecurePage() {
 *   // Enable navigation control
 *   useNavigationControl(true);
 *
 *   return <div>My Secure Content</div>;
 * }
 */
export const useNavigationControl = (enabled = true): void => {
  useEffect(() => {
    // Only set up navigation control if enabled
    if (!enabled) return;

    // Set up navigation control and get cleanup function
    const cleanup = setupCompleteNavigationControl();

    // Clean up when component unmounts
    return cleanup;
  }, [enabled]);
};

export default useNavigationControl;
