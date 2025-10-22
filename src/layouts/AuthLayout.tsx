import { Box } from '@mui/material';
import Loader from '../components/shared/Loader';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f8f8", // o el color que prefieras
      }}
    >
      <Loader />
      {children}
    </Box>
  );
};

export default AuthLayout;
