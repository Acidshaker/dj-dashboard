import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        textAlign: "center",
        p: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Divider sx={{ mb: 1 }} />
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} SPIN DJ
      </Typography>
    </Paper>
  );
};

export default Footer;
