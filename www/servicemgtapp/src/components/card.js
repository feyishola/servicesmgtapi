import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export const MuiCard = ({ width, height, img, title, body }) => {
  return (
    <Box width={width} mb={4}>
      <Card>
        <CardMedia
          component={"img"}
          height={height}
          image={img}
          alt={"unsplash-image"}
        />
        <CardContent>
          <Typography variant="h5" component={"div"} gutterBottom>
            <h4>{title}</h4>
          </Typography>
          <Typography variant="body2" color={"text.secondary"}>
            {body}
          </Typography>
        </CardContent>
        {/* <CardActions>
                    <Button>Share</Button>
                    <Button>Learn more</Button>
                </CardActions> */}
      </Card>
    </Box>
  );
};
