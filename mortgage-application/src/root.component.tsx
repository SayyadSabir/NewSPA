import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CssBaseline,
} from "@mui/material";
import { Provider } from "react-redux";
import { navigateToUrl } from "single-spa";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store";
import FinancialDetailsContainer from "./features/financial-details/components/FinancialDetailsContainer";
import ErrorDisplay from "./features/financial-details/components/ErrorDisplay";

// Import test navigation components
import TestNavigation from "./components/TestNavigation";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";

// Import navigation control
import {
  clearBrowserHistory,
  disableBrowserBack,
} from "./utils/navigationControl";

// Import the MSW initialization function
import { startMsw } from "./mocks/index";

const MortgageApplication: React.FC = () => {
  const [isMswInitialized, setIsMswInitialized] = useState(false);

  useEffect(() => {
    // Initialize MSW
    startMsw().then(() => {
      setIsMswInitialized(true);
    });
  }, []);

  if (!isMswInitialized) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Initializing application...</Typography>
      </Box>
    );
  }

  // Use React Router for internal routing within the MFE
  return (
    <Provider store={store}>
      <CssBaseline />
      <BrowserRouter>
        {/* Error display component will show errors from anywhere in the app */}
        <ErrorDisplay />
        <TestNavigation />
        <Routes>
          {/* Mount financial details on the specific route */}
          <Route
            path="/secure/launch/financialdetails/*"
            element={<FinancialDetailsContainer />}
          />

          {/* Test navigation routes */}
          <Route path="/test/page1" element={<Page1 />} />
          <Route path="/test/page2" element={<Page2 />} />
          <Route path="/test/page3" element={<Page3 />} />
          <Route path="/test" element={<Navigate to="/test/page1" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default MortgageApplication;
