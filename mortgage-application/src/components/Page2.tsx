import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useNavigationControl from "../hooks/useNavigationControl";

const Page2: React.FC = () => {
  const navigate = useNavigate();
  
  // Enable navigation control to prevent browser back button
    useNavigationControl(true);
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Page 2
        </Typography>
        <Typography paragraph>
          This is the second page of the navigation test.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate("/test/page1")}
          >
            Go to Page 1
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate("/test/page3")}
          >
            Go to Page 3
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Page2;
