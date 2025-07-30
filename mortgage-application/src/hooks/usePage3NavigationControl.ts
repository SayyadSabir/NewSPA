import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A specialized hook for Page3 that disables browser back button
 * while still allowing navigation via buttons.
 * 
 * This hook:
 * 1. Prevents browser back navigation
 * 2. Doesn't interfere with programmatic navigation (buttons)
 * 3. Handles cleanup when component unmounts
 */
const usePage3NavigationControl = (): void => {
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip the first render to avoid issues with initial navigation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Clear existing history by replacing current state
      window.history.replaceState({ page3Protected: true }, '', window.location.href);
      
      // Add a dummy state to prevent going back to previous pages
      window.history.pushState({ page3Protected: true }, '', window.location.href);
    }
    
    // Handler for back button clicks
    const handlePopState = (event: PopStateEvent) => {
      // If back button is clicked, prevent navigation by pushing state again
      window.history.pushState({ page3Protected: true }, '', window.location.href);
      
      // Optionally, you could show a message to the user
      console.log('Back navigation prevented on Page3');
    };
    
    // Add event listener for popstate (back/forward button)
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
};

export default usePage3NavigationControl;
