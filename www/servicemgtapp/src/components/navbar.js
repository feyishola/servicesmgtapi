import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  IconButton,
  Drawer,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export const NavBar = () => {
  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar sx={{ boxShadow: "none", backgroundColor: "rgba(6,21,81,0.5)" }}>
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* Hamburger icon for mobile view */}
        <IconButton
          color="inherit"
          onClick={toggleMobileMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography variant="h6" component={"div"} sx={{ flexGrow: 1 }}>
          SMgtApp
        </Typography>

        {/* Mobile Menu */}
        <Drawer
          anchor="top"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <div
            role="presentation"
            onClick={toggleMobileMenu}
            onKeyDown={toggleMobileMenu}
          >
            <Stack
              direction="column"
              alignItems="center"
              sx={{ p: 4, backgroundColor: "rgba(6,21,81,0.5)" }}
            >
              <Button
                color="inherit"
                onClick={() => handleScrollToSection("Home")}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => handleScrollToSection("Features")}
              >
                Features
              </Button>
              <Button
                color="inherit"
                onClick={() => handleScrollToSection("Service Renders")}
              >
                Service Providers
              </Button>
              <Button
                color="inherit"
                onClick={() => handleScrollToSection("Consumers")}
              >
                Consumers
              </Button>
              <Button
                color="inherit"
                onClick={() => handleScrollToSection("Demo")}
              >
                Demo
              </Button>
              <Link
                to={"/login"}
                state={{ initialPageUrl: window.location.pathname }}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  textTransform: "uppercase",
                  minWidth: "64px",
                }}
              >
                Login
              </Link>
            </Stack>
          </div>
        </Drawer>

        {/* Desktop Menu */}
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button color="inherit" onClick={() => handleScrollToSection("Home")}>
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => handleScrollToSection("Features")}
          >
            Features
          </Button>
          <Button
            color="inherit"
            onClick={() => handleScrollToSection("Service Renders")}
          >
            Service Providers
          </Button>
          <Button
            color="inherit"
            onClick={() => handleScrollToSection("Consumers")}
          >
            Consumers
          </Button>
          <Button color="inherit" onClick={() => handleScrollToSection("Demo")}>
            Demo
          </Button>
          <Link
            to={"/login"}
            state={{ initialPageUrl: window.location.pathname }}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              fontFamily: "Roboto,Helvetica,Arial,sans-serif",
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: 1.75,
              textTransform: "uppercase",
              minWidth: "64px",
            }}
          >
            Login
          </Link>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
