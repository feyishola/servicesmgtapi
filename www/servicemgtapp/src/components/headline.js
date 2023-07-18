import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import MyButton from "./animatedbutton";
import { useNavigate } from "react-router-dom";

export const Headline = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
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
            <span>Find and Connect with Service Renders</span>
            <br />
            <span> Effortlessly.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "white", textAlign: "center" }}>
            <span>
              Simplify your service needs with our service management app
            </span>
          </p>
        </Grid>
      </Grid>
      {/* <Button
        variant="contained"
        color="success"
        size="large"
        disableElevation
        onClick={() => {
          alert("testing all prpos");
        }}
      >
        Get Started
      </Button> */}
      <MyButton
        text={"Get Started"}
        onClick={() => {
          navigate("/regpage");
        }}
      />
    </Box>
  );
};
