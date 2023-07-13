import { Box, Grid } from "@mui/material";
import React from "react";
import { MuiCard } from "./card";
import img1 from "../images/charanjeet-dhiman-mHusyBu4bxM-unsplash.jpg";
import img2 from "../images/charlesdeluvio-AT5vuPoi8vc-unsplash.jpg";
import img3 from "../images/honey-yanibel-minaya-cruz-6gSyEKq4Pvg-unsplash.jpg";
import img4 from "../images/abillion-TefCcU-33MM-unsplash.jpg";

export const Features = () => {
  return (
    <Box
      sx={{
        height: "625px",
        backgroundColor: "white",
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        {/* <Grid container spacing={2}>
          <Grid item xs={4}> */}
        <MuiCard
          width={"325px"}
          height={"200px"}
          title={"Our Story"}
          body={`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Earum maxime nemo tempore eos accusantium soluta expedita 
                        optio, deleniti commodi velit? 
                        Ipsum doloremque error ullam quam nobis unde, iusto illum odit.`}
          img={img1}
        />
        {/* </Grid> */}
        {/* <Grid item xs={4}> */}
        <MuiCard
          width={"325px"}
          height={"200px"}
          title={"Our Vision"}
          body={`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Earum maxime nemo tempore eos accusantium soluta expedita 
                        optio, deleniti commodi velit? 
                        Ipsum doloremque error ullam quam nobis unde, iusto illum odit.`}
          img={img4}
        />
        {/* </Grid>
          <Grid item xs={4}> */}
        <MuiCard
          width={"325px"}
          height={"200px"}
          title={"Technology"}
          body={`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Earum maxime nemo tempore eos accusantium soluta expedita 
                        optio, deleniti commodi velit? 
                        Ipsum doloremque error ullam quam nobis unde, iusto illum odit.`}
          img={img3}
        />
        {/* </Grid>
        </Grid> */}
      </Box>
    </Box>
  );
};
