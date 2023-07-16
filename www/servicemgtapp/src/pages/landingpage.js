import "../App.css";
import React from "react";
import BackgroundPlayer from "../components/backgroundplayer/backgroundvideo";
import { NavBar } from "../components/navbar";
import { Headline } from "../components/headline";
import { Box } from "@mui/material";
import { Features } from "../components/features";
import { HowItWorks } from "../components/howitworks";
import { Footer } from "../components/footer";
import { Demo } from "../components/demo";

export const LandingPage = () => {
  return (
    <>
      <div>
        <BackgroundPlayer
          children={
            <div style={{ position: "relative", zIndex: 1 }}>
              <NavBar />
              <Box
                sx={{
                  // mt: 15,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                id="Home"
              >
                <Headline />

                <Features />

                <HowItWorks />

                <Demo />

                <Footer />
              </Box>
            </div>
          }
        />
      </div>
    </>
  );
};
