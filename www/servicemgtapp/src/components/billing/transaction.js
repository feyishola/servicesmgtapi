/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
// import Box from "components/Box";
// import Typography from "components/Typography";
// import Button from "components/Button";
import { Box, Button, Typography } from "@mui/material";
// import CircularButton from "../circularbutton";

function Transaction({ color, icon, name, description, value }) {
  return (
    <Box key={name} component="li" py={1} pr={2} mb={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            {/* <Button variant="outlined" color={color} iconOnly circular> */}
            {/* <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon> */}
            {/* <CircularButton icon={icon} /> */}
            {icon}
            {/* </Button> */}
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="button" fontWeight="medium" gutterBottom>
              {name}
            </Typography>
            <Typography variant="caption" color="text" fontWeight="regular">
              {description}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="button"
          color={color}
          fontWeight="medium"
          textGradient
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// Typechecking props of the Transaction
Transaction.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Transaction;
