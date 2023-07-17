import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
    console.log(formData);
    // Api call here
    let tokenFromApi = 123456789;
    localStorage.clear();
    localStorage.setItem("tokens", JSON.stringify(tokenFromApi));
    setTimeout(() => {
      navigate("/serviceapp");
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            //   value={email}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            //   value={password}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="success" fullWidth>
            Sign In
          </Button>
        </form>
        <p
          style={{
            textDecoration: "none",
            textAlign: "center",
            color: "green",
            fontSize: "15px",
            marginTop: "35px",
          }}
        >
          Need an account?
          <Link
            style={{
              textDecoration: "none",
              textAlign: "center",
              color: "green",
              fontSize: "17px",
              fontWeight: "bolder",
            }}
            to={"/register"}
          >
            {" "}
            Click Here
          </Link>
        </p>
      </Container>
    </Box>
  );
};

export default LoginPage;
