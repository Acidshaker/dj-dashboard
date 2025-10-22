import { user } from "@/services/endpoints";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { maxLength, noTrimSpaces, required } from "@/utils/validations";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { G } from "msw/lib/core/HttpResponse-CKZrrwKE";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { UserInfo } from "@/types/UserInfo";

export const User = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<{
    firstName: string;
    lastName: string;
  }>({
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const getProfile = async () => {
    dispatch(showLoading());
    try {
      const res = await user.profile();
      setUserInfo(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (userInfo) {
      reset({
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
      });
    }
  }, [userInfo]);

  return (
    // <Paper sx={{ height: "100vh", width: "100%" }}>

    // </Paper>
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mi información
      </Typography>
      <Container sx={{ width: "100%", mt: 2, flexGrow: 1 }}>
        {/* Formulario */}
        <Fade in={userInfo ? true : false} timeout={1000}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* <Container sx={{ flexGrow: 1 }}> */}
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  key={userInfo?.first_name}
                  label="Nombre(s)"
                  fullWidth
                  {...register("firstName", {
                    required: required("Nombre(s)"),
                    validate: {
                      maxLength: maxLength(50),
                      noTrimSpaces: noTrimSpaces,
                    },
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || " "}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  key={userInfo?.last_name}
                  label="Apellido(s)"
                  fullWidth
                  {...register("lastName", {
                    required: required("Apellido(s)"),
                    validate: {
                      maxLength: maxLength(50),
                      noTrimSpaces: noTrimSpaces,
                    },
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || " "}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  key={userInfo?.email}
                  disabled
                  label="Correo electrónico"
                  fullWidth
                  defaultValue={userInfo?.email}
                  helperText={" "}
                />
              </Grid>
              {/* <Grid size={{ xs: 12 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Estado de suscripción
                </Typography>
                <Box>
                  <Chip label="Activa" color="success" icon={<DoneIcon />} />
                  <Tooltip title="Fecha de vencimiento: 12/12/2026">
                    <IconButton color="default" size="small">
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid> */}
            </Grid>
            {/* </Container> */}

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => reset()}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Actualizar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Fade>
      </Container>
    </Box>
  );
};
