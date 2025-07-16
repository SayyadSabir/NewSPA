import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Grid, CssBaseline } from "@mui/material";
import { Provider } from 'react-redux';
import { navigateToUrl } from "single-spa";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from './store';
import FinancialDetailsContainer from './features/financial-details/components/FinancialDetailsContainer';
import ErrorDisplay from './features/financial-details/components/ErrorDisplay';

// Import the MSW initialization function
import { startMsw } from './mocks/index';



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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
        <Routes>
          {/* Mount financial details on the specific route */}
          <Route path="/secure/launch/financialdetails/*" element={<FinancialDetailsContainer />} />          
   
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};


export default MortgageApplication;
