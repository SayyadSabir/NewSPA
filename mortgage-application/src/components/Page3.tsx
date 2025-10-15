import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePage3NavigationControl from "../hooks/usePage3NavigationControl";
import useNavigationControl from "../hooks/useNavigationControl";

const Page3: React.FC = () => {
  const navigate = useNavigate();

  // Use specialized navigation control for Page3
  //  usePage3NavigationControl();

  useNavigationControl(true);
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Page 3
        </Typography>
        <Typography paragraph>
          This is the third page of the navigation test.
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
            onClick={() => navigate("/test/page2")}
          >
            Go to Page 2
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Page3;
