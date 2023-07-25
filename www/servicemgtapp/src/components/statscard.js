import React from "react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import Icon from "@mui/material/Icon";
import HomeIcon from "@mui/icons-material/Home";

const StatsCard = ({ icon, title, description, stat, statColor }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h5" style={{ marginLeft: "10px" }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1">{description}</Typography>
        <Typography variant="h4" color={statColor}>
          {stat}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

export function ComplexStatisticsCard({
  color,
  title,
  count,
  percentage,
  icon,
  bgcolor,
}) {
  return (
    <Card>
      <Box display="flex" justifyContent="space-between" pt={1} px={2}>
        <Box
          variant="gradient"
          bgcolor={bgcolor}
          // color={color === "light" ? "dark" : "white"}
          // coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-1}
          p={4}
          boxShadow={8}
        >
          {/* <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon> */}
          {icon}
          {/* {icon === "content_copy" && (
            <ContentCopyIcon fontSize="medium" style={{ color: "white" }} />
          )} */}
        </Box>
        <Box textAlign="right" lineHeight={1.25}>
          <Typography variant="button" fontWeight="light" color="text">
            {title}
          </Typography>
          <Typography variant="h4">{count}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box pb={2} px={2}>
        <Typography component="p" variant="button" color="text" display="flex">
          <Typography
            component="span"
            variant="button"
            fontWeight="bold"
            color={"#4CAF50"}
          >
            {percentage.amount}
          </Typography>
          &nbsp;{percentage.label}
        </Typography>
      </Box>
    </Card>
  );
}
