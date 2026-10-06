import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

export function PasswordField(props) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      type={show ? "text" : "password"}
      {...props}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                edge="end"
              >
                {show ? <VisibilityOffRounded /> : <VisibilityRounded />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
