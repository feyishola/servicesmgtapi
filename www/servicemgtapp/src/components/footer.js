import { Box } from "@mui/material";
import React from "react";

export const Footer = () => {
  return (
    <Box
      sx={{
        height: "108px",
        width: "100%",
        backgroundColor: "rgba(6,21,81)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h3 style={{ textAlign: "center", color: "white" }}>Footer</h3>
      <p style={{ color: "white" }}>@Copyright 2023 by Feyishola.</p>
    </Box>
  );
};
