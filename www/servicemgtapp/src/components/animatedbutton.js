import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const colors = ["success", "primary", "secondary", "error"];

const MyButton = ({ onClick, text }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [counter, setCounter] = useState(0);
  let timeoutId;

  useEffect(() => {
    timeoutId = setTimeout(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [counter]);

  useEffect(() => {
    if (counter >= 8) {
      clearTimeout(timeoutId);
    }
  }, [counter]);

  const currentColor = colors[colorIndex];

  return (
    <Button
      variant="contained"
      color={currentColor}
      //   onAnimationEnd={handleChangeColor}
      size="large"
      disableElevation
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default MyButton;
