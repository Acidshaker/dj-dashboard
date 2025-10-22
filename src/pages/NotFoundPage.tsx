import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 4,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Lo sentimos, la página que estás buscando no existe.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
      >
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFoundPage;
