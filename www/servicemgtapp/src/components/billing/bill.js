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

// Material Dashboard 2 React context
// import { useMaterialUIController } from "context";
import { Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Bill({ name, company, email, vat, noGutter }) {
  //   const [controller] = useMaterialUIController();
  //   const { darkMode } = controller;

  return (
    <Box
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgcolor={"#f8f9fa"}
      borderRadius="lg"
      p={3}
      mb={noGutter ? 0 : 1}
      mt={2}
    >
      <Box width="100%" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <Typography
            variant="button"
            fontWeight="medium"
            textTransform="capitalize"
          >
            {name}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
          >
            <Box mr={1}>
              {/* <Button
                variant="text"
                color="error"
                onClick={() => {
                  console.log("testing error");
                }}
              > */}
              {/* <Icon>delete</Icon>&nbsp;delete */}
              <DeleteIcon
                onClick={() => {
                  console.log("delete");
                }}
                style={{ color: "red" }}
              />
              {/* &nbsp;delete */}
              {/* </Button> */}
            </Box>
            {/* <Button
              variant="text"
              color={"dark"}
              onClick={() => {
                console.log("testing edit");
              }}
            > */}
            {/* <Icon>edit</Icon>&nbsp;edit */}
            <EditIcon
              onClick={() => {
                console.log("edit");
              }}
              style={{ color: "green" }}
            />
            {/* &nbsp;edit */}
            {/* </Button> */}
          </Box>
        </Box>
        <Box mb={1} lineHeight={0}>
          <Typography variant="caption" color="text">
            Company Name:&nbsp;&nbsp;&nbsp;
            <Typography
              variant="caption"
              fontWeight="medium"
              textTransform="capitalize"
            >
              {company}
            </Typography>
          </Typography>
        </Box>
        <Box mb={1} lineHeight={0}>
          <Typography variant="caption" color="text">
            Email Address:&nbsp;&nbsp;&nbsp;
            <Typography variant="caption" fontWeight="medium">
              {email}
            </Typography>
          </Typography>
        </Box>
        <Typography variant="caption" color="text">
          VAT Number:&nbsp;&nbsp;&nbsp;
          <Typography variant="caption" fontWeight="medium">
            {vat}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
