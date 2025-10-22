import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
  Fade,
} from "@mui/material";
import curvedImage from "../assets/curved14.jpg";
import Link from "@mui/material/Link";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { required, isEmail, noTrimSpaces } from "@/utils/validations";
import { auth } from "@/services/endpoints";

export const RecoveryPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    email: string;
  }>({
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    const data = {
      email: body.email,
    };
    try {
      const res = await auth.recoveryPasswordRequest(data);
      console.log(res.data);
      toast.success(
        `Mensaje enviado, revisa tu correo para restablecer tu contraseña`
      );
      reset();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

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
              Recupera tu contraseña
            </Typography>
            <Fade in={true} timeout={500}>
              <Box maxWidth="md">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Correo electrónico"
                        fullWidth
                        {...register("email", {
                          required: required("Correo electrónico"),
                          validate: (value) =>
                            isEmail(value) || noTrimSpaces(value),
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message || " "}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        Enviar correo de recuperación
                      </Button>
                      <Divider></Divider>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          marginTop: 2,
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          ¿Ya tienes una cuenta?{" "}
                          <Link
                            href="/login/"
                            variant="body2"
                            sx={{ alignSelf: "center", cursor: "pointer" }}
                          >
                            Iniciar sesión
                          </Link>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Fade>
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
