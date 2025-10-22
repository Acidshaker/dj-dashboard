import { RootState } from "@/store";
import { BorderColor } from "@mui/icons-material";
import { GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { JSX, useMemo } from "react";
import { useSelector } from "react-redux";

interface AppThemeProps {
  children: JSX.Element;
  disableCustomTheme?: boolean;
  themeComponents?: any;
}
export default function AppTheme(props: any) {
  const { children, disableCustomTheme, themeComponents } = props;
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);

  const theme = useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
              main: "#ff007f",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#7f00ff",
            },
            // accent: {
            //   main: "#ff007f",
            //   contrastText: "#ffffff",
            // },
            background: {
              default: darkMode ? "#1a1c1e" : "#f8f9fa",
              paper: darkMode ? "#212529" : "#ffffff",
            },
            text: {
              primary: darkMode ? "#f8f9fa" : "#344767",
              secondary: darkMode ? "#ced4da" : "#8392ab",
            },
            action: {
              selected: darkMode ? "#666a6eff" : "#e9ecef",
              hover: darkMode ? "#5c5f63ff" : "#f1f3f5",
            },
            success: {
              main: "#27e696ff",
              contrastText: "#ffffff",
            },
            warning: {
              main: "#f7c44fff",
              contrastText: "#ffffff",
            },
            info: {
              main: "#1fa7f0ff",
              contrastText: "#ffffff",
            },
            error: {
              main: "#e03263ff",
              contrastText: "#ffffff",
            },

            divider: darkMode ? "#343a40" : "#e9ecef",
          },
          typography: {
            fontFamily: "'Open Sans', 'Roboto', 'Helvetica', sans-serif",
            fontSize: 14,
            fontWeightRegular: 400,
            fontWeightMedium: 600,
            fontWeightBold: 700,
          },
          shape: {
            borderRadius: 5,
          },
          components: {
            MuiOutlinedInput: {
              styleOverrides: {
                root: ({ theme }) => ({
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#1f1f1f" : "#fff",
                  borderRadius: 8,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark" ? "#444" : "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark" ? "#666" : "#999",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }),
              },
            },
            MuiIconButton: {
              styleOverrides: {
                root: ({ theme, ownerState }) => {
                  const colorKey = ownerState.color || "primary";
                  const paletteColor = theme.palette[colorKey];

                  const hasDarkVariant = paletteColor && paletteColor.dark;

                  return {
                    transition: "all 0.3s ease",
                    borderRadius: 8,
                    padding: 8,
                    "&:hover": {
                      backgroundColor: hasDarkVariant
                        ? paletteColor.dark
                        : theme.palette.action.hover,
                      color: hasDarkVariant
                        ? theme.palette.getContrastText(paletteColor.dark)
                        : theme.palette.text.primary,
                    },
                    "&:focus": {
                      outline: "none",
                      boxShadow: "none",
                    },
                  };
                },
              },
            },
            MuiTab: {
              styleOverrides: {
                root: ({ theme }) => ({
                  transition: "all 0.3s ease",
                  borderRadius: 8,
                  padding: 8,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }),
              },
            },
            MuiDrawer: {
              styleOverrides: {
                paper: ({ theme }) => ({
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #1f1f1f, #2c2c2c)"
                      : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                  borderRight: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }),
              },
            },
            MuiListItemButton: {
              styleOverrides: {
                root: ({ theme }) => ({
                  borderRadius: 8,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2c2f33" : "#e0e7ff",
                    transform: "scale(1.02)",
                  },
                }),
              },
            },
            MuiButton: {
              styleOverrides: {
                root: ({ theme, ownerState }) => {
                  const colorKey = ownerState.color || "primary";
                  const paletteColor = theme.palette[colorKey];

                  return {
                    borderColor: paletteColor.main,
                    transition: "all 0.3s ease",
                    "&:focus": {
                      outline: "none",
                      boxShadow: "none",
                    },
                    "&:hover": {
                      borderColor: paletteColor.main,
                      backgroundColor: paletteColor.dark,
                      color: theme.palette.getContrastText(paletteColor.dark),
                    },
                  };
                },
              },
            },
            MuiListItemText: {
              styleOverrides: {
                primary: {
                  fontWeight: 500,
                  fontSize: "0.95rem",
                },
              },
            },
            // Aquí se integran tus overrides externos
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents, darkMode]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        }}
      />

      {children}
    </ThemeProvider>
  );
}
