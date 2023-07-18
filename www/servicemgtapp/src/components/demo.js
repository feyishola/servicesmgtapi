import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import img1 from "../images/andrew-stutesman-l68Z6eF2peA-unsplash.jpg";
import { useNavigate } from "react-router-dom";

export const Demo = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh",
        backgroundImage: `url(${img1})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "rgba(6,21,81,1)",
        filter: "brightness(70%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h4
        style={{
          fontFamily: "raleway,sans-serif",
          fontSize: "40px",
          textAlign: "center",
          color: "rgba(6,21,81)",
          maxWidth: "700px",
        }}
        id="Demo"
      >
        <span>
          To schedule a product demo with one of our product consultants, please
          fill in your contact details
        </span>
      </h4>
      <Box
        component={"form"}
        sx={{
          "& > :not(style)": { m: 1, width: "40ch", backgroundColor: "white" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="fullName"
          label="fullName"
          name="fullName"
          variant="outlined"
          // size="small"
          // onChange={(e) =>
          //   setFormVal({ ...formVal, [e.target.name]: e.target.value })
          // }
        />
        <TextField
          id="email"
          label="email"
          variant="outlined"
          name="email"
          // size="small"
          // InputProps={{
          //   endAdornment: <InputAdornment position="end">m</InputAdornment>,
          // }}
          // onChange={(e) =>
          //   setFormVal({ ...formVal, [e.target.name]: e.target.value })
          // }
        />

        <TextField
          id="phoneNumber"
          label="phoneNumber"
          variant="outlined"
          name="phoneNumber"
          // size="small"
          // disabled
          // placeholder="Address should include state and country"
          // onChange={(e) => {
          //   setFormVal({ ...formVal, [e.target.name]: e.target.value });
          //   setChooseAddress(true);
          // }}
        />

        <TextField
          id="message"
          label="message"
          variant="outlined"
          name="message"
          placeholder="Type your message here..."
          multiline
          rows={4}
          // size="small"
          // disabled
          // placeholder="Address should include state and country"
          // onChange={(e) => {
          //   setFormVal({ ...formVal, [e.target.name]: e.target.value });
          //   setChooseAddress(true);
          // }}
        />

        <Box>
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{
              "& > :not(style)": { m: 1, width: "360px" },
            }}
            fullWidth
            onClick={() => {
              navigate("page-not-found");
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
