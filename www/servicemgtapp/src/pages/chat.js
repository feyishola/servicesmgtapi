import { Box, Button, TextField } from "@mui/material";
import React, { useState, useContext, useRef, useEffect } from "react";
import { SocketContext } from "../utils/socketcontext";
import io from "socket.io-client";

export const ChatPage = () => {
  const socket = useContext(SocketContext);

  const socketRef = useRef();
  //   socketRef.current = socket;

  const [msg, setMsg] = useState("");
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketRef.current = io.connect("http://127.0.0.1:5000");

    socketRef.current.on("socketId", (id) => {
      setYourID(id);
    });

    socketRef.current.on("serverResponse", (res) => {
      receivedMessage(res);
    });
  }, []);

  function receivedMessage(message) {
    setMessages((oldMsgs) => [...oldMsgs, message]);
  }

  function sendMsg() {
    setMsg("");
    socket.emit("msgFromClient", { id: yourID, body: msg });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "95vh",
        bgcolor: "#46516e",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "500px",
          maxHeight: "500px",
          overflow: "auto",
          width: "400px",
          border: "1px solid lightgray",
          borderRadius: "10px",
          paddingBottom: "10px",
          marginTop: "25px",
        }}
      >
        {messages?.map((message, index) => {
          if (message.id == yourID) {
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
                key={index}
              >
                <Box
                  sx={{
                    width: "45%",
                    backgroundColor: "pink",
                    color: "#46516e",
                    padding: "10px",
                    marginRight: "5px",
                    textAlign: "center",
                    borderBottomRightRadius: "10%",
                    borderTopRightRadius: "10%",
                  }}
                >
                  {message.body}
                </Box>
              </Box>
            );
          } else {
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "10px",
                }}
                key={index}
              >
                <Box
                  sx={{
                    width: "45%",
                    backgroundColor: "transparent",
                    color: "lightgray",
                    border: "1px solid lightgray",
                    padding: "10px",
                    marginLeft: "5px",
                    textAlign: "center",
                    borderBottomRightRadius: "10%",
                    borderTopRightRadius: "10%",
                  }}
                >
                  {message.body}
                </Box>
              </Box>
            );
          }
        })}
      </Box>
      <Box
        sx={{
          width: "400px",
          borderRadius: "10px",
          marginTop: "10px",
          paddingLeft: "10px",
          paddingTop: "10px",
          color: "lightgray",
          letterSpacing: "1px",
          lineHeight: "20px",
          border: "1px solid lightgray",
        }}
      >
        <TextField
          multiline
          rows={4}
          fullWidth
          value={msg}
          placeholder="Say something..."
          sx={{
            outlineStyle: "none",
            fontSize: "17px",
            outline: "none",
            color: "lightgray",
            letterSpacing: "1px",
            lineHeight: "20px",
            border: "none",
            "& fieldset": { border: "none" },
          }}
          onChange={(e) => setMsg(e.target.value)}
        />
      </Box>
      <Button
        sx={{
          borderRadius: "10px",
          bgcolor: "pink",
          height: "50px",
          color: "#46516e",
          border: "none",
          fontSize: "17px",
          width: "400px",
          marginTop: 1,
          "&:hover": {
            bgcolor: "pink", // Set the hover background color to the same as the initial background color
            color: "#46516e", // Set the hover font color to the same as the initial font color
            textDecoration: "none", // Optional: Remove any text-decoration on hover
            // You can add more properties here if needed to reset the hover styles
          },
        }}
        onClick={() => sendMsg()}
      >
        send
      </Button>
    </Box>
  );
};
