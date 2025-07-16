import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Grid, CssBaseline } from "@mui/material";
import { Provider } from 'react-redux';
import { navigateToUrl } from "single-spa";
import { store } from './store';
import FinancialDetailsContainer from './features/financial-details/components/FinancialDetailsContainer';

// Import the MSW initialization function
import { startMsw } from './mocks/index';



const MortgageApplication: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isMswInitialized, setIsMswInitialized] = useState(false);

  useEffect(() => {
    // Initialize MSW
    startMsw().then(() => {
      setIsMswInitialized(true);
    });
  }, []);

  const handleSectionClick = (section: string) => {
    setCurrentSection(section);
    navigateToUrl(section);
  };

  // Show financial details page directly for development
  const showFinancialDetails = true;

  if (!isMswInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Initializing application...</Typography>
      </Box>
    );
  }

  if (currentSection || showFinancialDetails) {
    return (
      <Provider store={store}>
        <CssBaseline />
        <FinancialDetailsContainer />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, width: "80%", textAlign: "center" }}
        >
          <Typography variant="h4" gutterBottom>
            Residential Mortgage Application
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => handleSectionClick("/financial-details")}
              >
                Financial Details
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => handleSectionClick("/your-details")}
              >
                Your Details
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => handleSectionClick("/client-details")}
              >
                Client Details
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Provider>
  );
};

export default MortgageApplication;
