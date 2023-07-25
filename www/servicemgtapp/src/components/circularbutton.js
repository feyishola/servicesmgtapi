import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  circularButton: {
    borderRadius: "50%", // Makes the button circular
    width: "60px", // Adjust the size of the button as needed
    height: "60px",
    backgroundColor: theme.palette.primary.main, // Replace with your desired background color
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "white", // Set the color of the icon to white
    fontSize: "30px", // Adjust the size of the icon as needed
  },
}));

const CircularButton = ({ icon }) => {
  const classes = useStyles();

  return (
    <IconButton className={classes.circularButton}>
      {/* <AddIcon className={classes.icon} /> */}
      {icon}
    </IconButton>
  );
};

export default CircularButton;
