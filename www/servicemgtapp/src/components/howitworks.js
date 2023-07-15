import { Box, Grid } from "@mui/material";
import React from "react";
import time from "../images/time.jpg";
import growth from "../images/growth.jpg";
import incrvis4 from "../images/incrvis4.jpg";
import connect from "../images/connect.jpg";
import convenience from "../images/convenience.jpg";
import choices from "../images/choices.jpg";
import communication from "../images/communication.jpg";
import { MuiCard } from "./card";

export const HowItWorks = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2F7FF",
        width: "100%",
      }}
    >
      {/* <h4
        style={{
          fontFamily: "raleway,sans-serif",
          fontSize: "40px",
          textAlign: "center",
        }}
      >
        How It Works
      </h4> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <h4
            style={{
              fontFamily: "raleway,sans-serif",
              fontSize: "40px",
              textAlign: "center",
            }}
          >
            Service Renderers Benefits
          </h4>
          <Grid container>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={incrvis4}
                  body={`By using our service management app,
                service renderers can expand their reach and gain exposure to a
                larger pool of potential customers. This increased visibility
                helps them attract new clients and grow their business.`}
                  title={"Increased Visibility"}
                />
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={connect}
                  body={`A larger customer base means
                service renderers have the opportunity to cater to a wider range
                of service needs. They can showcase their expertise in different
                areas, increasing their chances of securing more service requests.`}
                  title={"Diverse Service Access"}
                />
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={growth}
                  body={`Reaching a larger customer base opens up avenues
                for business growth, as service renderers can tap into new markets
                and extend their services to a broader audience. This growth
                translates into higher revenue potential and increased
                profitability.`}
                  title={"Business Growth"}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <h4
            style={{
              fontFamily: "raleway,sans-serif",
              fontSize: "40px",
              textAlign: "center",
            }}
          >
            Customers Benefits
          </h4>
          <Grid container>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={time}
                  body={`Our service management app allows consumers to
                easily find and book services in a hassle-free manner. They can
                quickly browse through a wide range of service options, compare
                offerings, and make informed decisions, saving them valuable
                time and effort.`}
                  title={"Time Saving"}
                />
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={convenience}
                  body={`With our app, consumers can access services with
                just a few clicks, eliminating the need for extensive research
                or multiple phone calls. They can find service providers based
                on their preferences, proximity, ratings, and other relevant
                filters, ensuring a convenient and tailored service experience.`}
                  title={"Convenience"}
                />
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={choices}
                  body={`Consumers can choose from a diverse range
                of service options available on our app, ensuring that their
                specific needs and preferences are met. They can explore
                different service providers, compare offerings, and select the
                one that best fits their requirements.`}
                  title={"Wide Range of Choices"}
                />
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MuiCard
                  width={"350px"}
                  height={"200px"}
                  img={communication}
                  body={`Our app facilitates secure communication
                channels between consumers and service providers. Consumers can
                easily communicate with service renderers, discuss their service
                requirements, ask questions, and receive prompt responses,
                ensuring a smooth and transparent communication experience.`}
                  title={"Direct Interaction"}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
