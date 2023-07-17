import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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
        <Stack direction={"row"} spacing={2}>
          <Typography variant="h6" component={"div"} sx={{ flexGrow: 1 }}>
            SMgtApp
          </Typography>
          <Button color="inherit" onClick={() => handleScrollToSection("Home")}>
            Home
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={2}>
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
            style={{
              textDecoration: "none",
              textAlign: "center",
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
          {/* </span> */}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
