import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { MuiCard, TransitionCard } from "./card";
import payment from "../images/payment.jpg";
import selection from "../images/selection.jpg";
import comm from "../images/comm.jpg";
import ratings from "../images/ratings.jpg";
import search from "../images/search.jpg";

export const Features = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "white",
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <h4
            style={{
              fontFamily: "raleway,sans-serif",
              fontSize: "40px",
              color: "rgba(6,21,81)",
            }}
            id="Features"
          >
            Features
          </h4>
          <Grid container sx={{ mb: 2 }}>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "20px",
                    lineHeight: "2em",
                    maxWidth: "900px",
                    fontFamily: "raleway,sans-serif",
                    color: "rgba(6,21,81)",
                  }}
                >
                  <span>
                    Finding reliable service providers for various needs can be
                    a daunting and time-consuming task. Service Consumers often
                    struggle to locate service renders in their area, assess
                    their quality and reliability, and communicate effectively
                    to book services. On the other hand, service renders face
                    challenges in reaching a wider customer base and managing
                    their bookings efficiently. This fragmented process can lead
                    to frustration, wasted time, and inconsistent service
                    experiences.
                  </span>
                </p>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
        // sx={{
        //   display: "flex",
        //   flexDirection: "row",
        //   justifyContent: "space-around",
        //   alignItems: "flex-end",
        //   position: "absolute",
        //   bottom: 0,
        //   width: "100%",
        // }}
        >
          <Grid container>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <MuiCard
                  width={"325px"}
                  height={"200px"}
                  title={"Seamless Service Search"}
                  body={`Our service management app simplifies the process of finding and connecting with service providers. With a comprehensive database of service renderers across various industries, consumers can effortlessly discover a wide range of services tailored to their specific needs.`}
                  img={search}
                /> */}
                <TransitionCard
                  img={search}
                  title={"Seamless Service Search"}
                  body={`Our service management app simplifies the process of finding and connecting with service providers. With a comprehensive database of service renderers across various industries, consumers can effortlessly discover a wide range of services tailored to their specific needs.`}
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
                {/* <MuiCard
                  width={"325px"}
                  height={"200px"}
                  title={"Reliable Communication Platform"}
                  body={`Our app provides a seamless communication platform, enabling direct and real-time interaction between consumers and service renderers. This facilitates efficient discussions, clarifications, and updates throughout the service process, ensuring a smooth and transparent experience for all parties involved.`}
                  img={comm}
                /> */}
                <TransitionCard
                  img={comm}
                  title={"Reliable Communication Platform"}
                  body={`Our app provides a seamless communication platform, enabling direct and real-time interaction between service consumers and service renders. This facilitates efficient discussions, clarifications, and updates throughout the service process, ensuring a smooth and transparent experience for all parties involved.`}
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
                {/* <MuiCard
                  width={"325px"}
                  height={"200px"}
                  title={"Proximity and Ratings-Based Selection"}
                  body={`With our app, consumers can easily search for service providers based on their proximity, ensuring quick response times and reduced travel distances. Additionally, our platform incorporates ratings and reviews from previous customers, empowering consumers to make informed decisions based on the experiences of others.`}
                  img={selection}
                /> */}
                <TransitionCard
                  img={selection}
                  title={"Proximity and Ratings-Based Selection"}
                  body={`With our app, service consumers can easily search for service providers based on their proximity, ensuring quick response times and reduced travel distances. Additionally, our platform incorporates ratings and reviews from previous customers, empowering consumers to make informed decisions based on the experiences of others.`}
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
                {/* <MuiCard
                  width={"325px"}
                  height={"200px"}
                  title={"Customer Reviews and Ratings"}
                  body={`Our app offers service renderers the opportunity to showcase their expertise, build a strong reputation, and reach a larger customer base. By receiving ratings, reviews, and recommendations from satisfied customers, service providers can boost their visibility and attract more clients.`}
                  img={ratings}
                /> */}
                <TransitionCard
                  img={ratings}
                  title={"Customer Reviews and Ratings"}
                  body={`Our app offers service renders the opportunity to showcase their expertise, build a strong reputation, and reach a larger customer base. By receiving ratings, reviews, and recommendations from satisfied customers, service providers can boost their visibility and attract more clients.`}
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
                {/* <MuiCard
                  width={"325px"}
                  height={"200px"}
                  title={"Secure Payment Integration"}
                  body={`We have integrated a secure payment platform within our app, allowing consumers to make payments for services with confidence. This eliminates the need for cash transactions and provides a convenient and hassle-free experience for both consumers and service renderers.`}
                  img={payment}
                /> */}
                <TransitionCard
                  img={payment}
                  title={"Secure Payment Integration"}
                  body={`We have integrated a secure payment platform within our app, allowing consumers to make payments for services with confidence. This eliminates the need for cash transactions and provides a convenient and hassle-free experience for both consumers and service renders.`}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
