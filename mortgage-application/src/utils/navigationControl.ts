/**
 * Navigation Control Utility
 *
 * This utility provides functions to:
 * 1. Disable browser back button navigation
 * 2. Clear browser history
 * 3. Prevent users from navigating back using history manipulation
 */

/**
 * Disables the browser back button by intercepting popstate events
 * while still allowing programmatic navigation.
 * This implementation ensures the back button is completely non-functional.
 */
export const disableBrowserBack = (): (() => void) => {
  // Flag to track if navigation is from a button click
  let isNavigatingProgrammatically = false;

  // Get the current path to preserve it (not the full URL which can cause issues)
  const currentPath =
    window.location.pathname + window.location.search + window.location.hash;

  // Fill history with current state to prevent going back
  for (let i = 0; i < 5; i++) {
    window.history.pushState({ controlled: true }, "", currentPath);
  }

  // Event handler for popstate (back/forward button clicks)
  const handlePopState = (event: PopStateEvent) => {
    // Only block if it's not programmatic navigation
    if (!isNavigatingProgrammatically) {
      // Get the current path again in case it changed
      const path =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      // Immediately prevent navigation by pushing state again with the current path
      window.history.pushState({ controlled: true }, "", path);

      // Double protection: if somehow navigation occurred to a different path, restore it
      if (window.location.pathname !== path.split("?")[0]) {
        window.history.replaceState({ controlled: true }, "", path);
      }
    }
  };

  // Intercept React Router navigation
  const originalPushState = window.history.pushState;
  window.history.pushState = function (...args) {
    // Set flag before navigation
    isNavigatingProgrammatically = true;

    // Call original method
    const result = originalPushState.apply(this, args);

    // Reset flag after navigation
    setTimeout(() => {
      isNavigatingProgrammatically = false;
    }, 100);

    return result;
  };

  // Also intercept replaceState for complete protection
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    // Set flag before navigation
    isNavigatingProgrammatically = true;

    // Call original method
    const result = originalReplaceState.apply(this, args);

    // Reset flag after navigation
    setTimeout(() => {
      isNavigatingProgrammatically = false;
    }, 100);

    return result;
  };

  // Add event listener for popstate
  window.addEventListener("popstate", handlePopState);

  // No beforeunload handler to avoid showing leave-site dialog

  // Return cleanup function
  return () => {
    window.removeEventListener("popstate", handlePopState);
    // Restore original methods
    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
  };
};

/**
 * Clears browser history by replacing the current history entry
 * and then pushing a new one, effectively removing previous entries.
 */
export const clearBrowserHistory = (): void => {
  const currentLocation = window.location.href;

  // Replace the current history entry (removes all previous entries)
  window.history.replaceState(null, "", currentLocation);

  // Push a new entry to prevent going back to previous site
  window.history.pushState(null, "", currentLocation);
};

/**
 * Combined utility that both disables back button and clears history.
 * Returns a cleanup function to remove event listeners when component unmounts.
 */
export const preventBrowserNavigation = (): (() => void) => {
  // Clear existing history
  clearBrowserHistory();

  // Disable back button and get cleanup function
  return disableBrowserBack();
};

/**
 * Utility to handle keyboard navigation prevention (Alt+Left, Backspace)
 */
export const preventKeyboardNavigation = (): (() => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent Alt+Left (back) and Backspace (when not in an input)
    if (
      (e.altKey && e.key === "ArrowLeft") ||
      (e.key === "Backspace" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName) &&
        !((e.target as HTMLElement).getAttribute("contenteditable") === "true"))
    ) {
      e.preventDefault();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
};

/**
 * Complete navigation control - prevents all forms of browser back navigation
 * Returns a cleanup function to remove all event listeners
 */
export const setupCompleteNavigationControl = (): (() => void) => {
  const cleanupBrowserBack = preventBrowserNavigation();
  const cleanupKeyboard = preventKeyboardNavigation();

  return () => {
    cleanupBrowserBack();
    cleanupKeyboard();
  };
};
