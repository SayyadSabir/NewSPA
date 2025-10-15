/**
 * Utility functions for managing application state in local storage
 */

// Storage keys
const APP_ID_KEY = "mortgage_application_id";

// For testing purposes, we'll use a fixed application ID
// In a real application, this would be generated or retrieved from a backend
// Set this to empty string for new case, or a valid ID for resume case
const TEST_APPLICATION_ID = "qwqwqwqwqw";

/**
 * Get the current application ID from local storage
 * @returns The application ID or null if not found
 */
export const getApplicationId = (): string | null => {
  try {
    return localStorage.getItem(APP_ID_KEY) || TEST_APPLICATION_ID;
  } catch (error) {
    console.error("Error accessing local storage:", error);
    return TEST_APPLICATION_ID;
  }
};

/**
 * Save the application ID to local storage
 * @param id The application ID to save
 */
export const saveApplicationId = (id: string): void => {
  try {
    localStorage.setItem(APP_ID_KEY, id);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

/**
 * Check if this is a resume case
 * @returns True if this is a resume case, false otherwise
 */
export const isResumeCase = (): boolean => {
  // Simple approach: if TEST_APPLICATION_ID is not empty, it's a resume case
  return TEST_APPLICATION_ID.length > 0;
};

// No need for setResumeCase function as we're using TEST_APPLICATION_ID

/**
 * Reset the application state (for testing)
 */
export const resetApplicationState = (): void => {
  try {
    localStorage.removeItem(APP_ID_KEY);
  } catch (error) {
    console.error("Error resetting application state:", error);
  }
};
