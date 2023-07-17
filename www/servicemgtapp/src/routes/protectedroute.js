import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Protected({ children }) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token === undefined || token === "undefined") {
      setIsLoggedIn(false);
      alert("login failed");
      return navigate("/login");
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  return <>{isLoggedIn ? children : null}</>;
}
