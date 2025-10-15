import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const TestNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Test Navigation
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="primary"
            variant={location.pathname === "/test/page1" ? "contained" : "text"}
            onClick={() => navigate("/test/page1")}
          >
            Page 1
          </Button>
          <Button
            color="primary"
            variant={location.pathname === "/test/page2" ? "contained" : "text"}
            onClick={() => navigate("/test/page2")}
          >
            Page 2
          </Button>
          <Button
            color="primary"
            variant={location.pathname === "/test/page3" ? "contained" : "text"}
            onClick={() => navigate("/test/page3")}
          >
            Page 3
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TestNavigation;
