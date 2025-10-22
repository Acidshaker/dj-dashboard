import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/SideBar";
import Loader from "@/components/shared/Loader";
import { AlertProvider } from "@/providers/AlertProvider";
import { Box, CssBaseline, Toolbar, useTheme } from "@mui/material";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <>
      <AlertProvider>
        <CssBaseline />
        <Loader />
        <Box sx={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "#fafafa",
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Header />
            <Toolbar /> {/* Espaciador para AppBar */}
            <Box
              sx={{
                flexGrow: 1,
                mx: 3,
                my: 2,
                overflowY: "auto",
              }}
            >
              {children}
            </Box>
            <Footer />
          </Box>
        </Box>
      </AlertProvider>
    </>
  );
};

export default DashboardLayout;
