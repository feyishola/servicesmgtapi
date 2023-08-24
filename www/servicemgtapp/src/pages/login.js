import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { postRequest } from "../utils/apicalls";
import { SocketContext } from "../utils/socketcontext";
// import io from "socket.io-client";

const LoginPage = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState();
  // const [id, setId] = useState();
  // const [user, setUser] = useState();
  const navigate = useNavigate();
  // let socket;
  const { socket, id } = useContext(SocketContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await postRequest("/services/login", formData);

      if (res) {
        const { token, user } = res;
        localStorage.clear();
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("id", JSON.stringify(user._id));
        localStorage.setItem("phoneId", JSON.stringify(user.phoneNumber));
        // localStorage.setItem(user.phoneNumber, id);
        // setUser(user.phoneNumber);
        socket.emit("forRedis", user.phoneNumber, id);
        setTimeout(() => {
          //Dashboard

          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setError(error);
    }
  };

  // useEffect(() => {
  //   // socket.on("socketId", (id) => {
  //   //   setId(id);
  //   // });
  //   socket = io("http://localhost:5000");
  //   socket.on("socketId", (id) => {
  //     setId(id);
  //   });
  //   socket.emit("forRedis", user, id);
  // }, [user]);

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
          {error && (
            <Typography
              variant="body1"
              color={"error"}
              sx={{ textAlign: "center", m: 1 }}
            >
              {error}
            </Typography>
          )}
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
            to={"/regpage"}
            state={{ initialPageUrl: window.location.pathname }}
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
