import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
// import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

export const NavBar = () => {
  return (
    <AppBar sx={{ boxShadow: "none", backgroundColor: "rgba(6,21,81,0.5)" }}>
      <Toolbar>
        <Typography variant="h6" component={"div"} sx={{ flexGrow: 1 }}>
          SMgtApp
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Button color="inherit">Features</Button>
          <Button color="inherit">Consumers</Button>
          <Button color="inherit">Service Providers</Button>
          <Button color="inherit">Login</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
