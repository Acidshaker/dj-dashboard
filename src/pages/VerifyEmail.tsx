// src/pages/LoginPage.tsx
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Grid,
  Paper,
  Switch,
  Divider,
} from "@mui/material";
import curvedImage from "../assets/curved14.jpg";
import { use, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Link from "@mui/material/Link";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { auth } from "@/services/endpoints";
import { set } from "react-hook-form";
import { sessionSlice, setToken } from "@/store/sessionsSlice";

export const VerifyEmail = () => {
  const [message, setMessage] = useState("Verificando cuenta...");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSearchParams()[0].get("token");
  const activateAccount = async () => {
    dispatch(showLoading());
    try {
      const res = await auth.verify({ token: token! });
      setMessage(res.data.message);
      return true;
    } catch (error) {
      const err = error.response?.data?.message;
      if (err === "Token inválido") {
        setMessage("La cuenta ya fue activada o el enlace es incorrecto.");
      } else {
        setMessage("No se pudo activar la cuenta, intente nuevamente.");
      }
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };

  const verifyEmail = async () => {
    const result = await activateAccount();
    if (result) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setTimeout(() => {
        // navigate("/sign-in");
      }, 3000);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <Paper sx={{ height: "100vh", width: "100%" }}>
      <Grid container sx={{ height: "100vh", width: "100%" }}>
        {/* Formulario */}
        <Grid size={{ md: 6, xs: 12 }}>
          <Container
            maxWidth="sm"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {message}
            </Typography>
          </Container>
        </Grid>
        <Grid size={{ md: 6, xs: false }}>
          <Paper
            sx={{
              height: "100%",
              width: "100%",
              backgroundImage: `url(${curvedImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
