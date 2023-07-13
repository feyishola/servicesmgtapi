import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export const Headline = () => {
  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h1
            style={{
              color: "white",
              fontSize: "55px",
              lineHeight: "1.2em",
              textAlign: "center",
            }}
          >
            <span>The smartest way to enjoy and</span>
            <br />
            <span> manage services.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "white", textAlign: "center" }}>
            <span>Just a click away to the farthest reach...</span>
          </p>
        </Grid>
      </Grid>
    </Box>
  );
};
