import "../App.css";
import React from "react";
import BackgroundPlayer from "../components/backgroundplayer/backgroundvideo";
import { NavBar } from "../components/navbar";
import { Headline } from "../components/headline";
import { Box } from "@mui/material";

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
                  mt: 15,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Headline />
              </Box>
            </div>
          }
        />
      </div>
    </>
  );
};
