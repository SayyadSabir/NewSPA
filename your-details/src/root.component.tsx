import React from 'react';
import { Box, Typography, Paper, Button, TextField, Grid } from '@mui/material';
import { navigateToUrl } from 'single-spa';
import { useDispatch, useSelector } from 'react-redux';
// import { setName, setEmail } from '../../single-spa-redux/src/shared/sharedStore';
// import { setName, setEmail } from './mystore';
import { setName, setEmail } from 'store/store';


const YourDetails: React.FC = () => {
  const dispatch = useDispatch();

  const handleBackToOverview = () => {
    navigateToUrl('/');
  };
  const handleSetName = (name: string) => {
    console.log(name, 'name');
    dispatch(setName(name));
  };

  const handleSetEmail = (email: string) => {
    dispatch(setEmail(email));
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '80%', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your Details
        </Typography>

        <Box sx={{ mt: 2 }}>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} onBlur={(e) => { e.preventDefault(), handleSetName(e.target.value) }} />
          <TextField label="Address" fullWidth sx={{ mb: 2 }} onBlur={(e) => { e.preventDefault(), handleSetEmail(e.target.value) }} />
          {/* Add other form fields as needed */}
        </Box>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth color="primary" >
              Save
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth onClick={handleBackToOverview}>
              Back to Overview
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default YourDetails;
