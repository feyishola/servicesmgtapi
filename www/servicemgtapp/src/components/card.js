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
