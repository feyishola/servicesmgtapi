import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import React from "react";
import { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./hiw.css";

export const MuiCard = ({ width, height, img, title, body }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box width={width} mb={2}>
      <Card>
        <CardMedia
          component={"img"}
          height={height}
          image={img}
          alt={"unsplash-image"}
        />
        <CardContent>
          <Typography variant="h5" component={"div"} gutterBottom>
            <h4 style={{ textAlign: "center", marginBottom: 1 }}>{title}</h4>
          </Typography>
        </CardContent>
        <CardActions sx={{ alignItems: "center", justifyContent: "center" }}>
          <Button onClick={handleExpandClick}>Learn more</Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography
              variant="body2"
              color={"text.secondary"}
              textAlign={"center"}
            >
              {body}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export const TransitionCard = ({ img, title, body }) => {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("out-in");
  const [bounce, setBounce] = useState(false);

  return (
    <Box
      sx={{
        width: "350px",
        // backgroundColor: "white",
        minHeight: "370px",
      }}
      className={bounce ? "card expanded" : "card"}
      onMouseEnter={() => setBounce(true)}
      onMouseLeave={() => setBounce(false)}
    >
      <SwitchTransition mode={mode}>
        <CSSTransition
          key={expanded ? "expanded" : "collapsed"}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          <div>
            <div>
              <img
                src={img}
                alt="unsplash-image"
                width={"350px"}
                height={"200px"}
              />
              <h4
                style={{
                  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                  fontSize: "24px",
                  textAlign: "center",
                  color: "rgba(6,21,81)",
                }}
              >
                {title}
              </h4>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Button onClick={() => setExpanded(!expanded)}>
                  {expanded ? "Collapse" : "Learn more"}
                </Button>
              </Box>
            </div>
            {expanded && (
              <p
                style={{
                  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                  fontSize: "14px",
                  textAlign: "center",
                  lineHeight: 1.43,
                  letterSpacing: "0.01071em",
                  color: "rgba(6,21,81)",
                  width: "100%",
                }}
              >
                {body}
              </p>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Box>
  );
};
