import { Box } from "@mui/material";
import React from "react";
import img1 from "../images/andrew-stutesman-l68Z6eF2peA-unsplash.jpg";

export const Testimonial = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "50vh",
        backgroundImage: `url(${img1})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "rgba(6,21,81,1)",
        filter: "brightness(50%)",
      }}
    ></Box>
  );
};
