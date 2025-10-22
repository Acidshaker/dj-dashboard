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
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import curvedImage from "../assets/curved14.jpg";
import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  required,
  strongPassword,
  isEmail,
  minLength,
  noTrimSpaces,
} from "@/utils/validations";
import { auth } from "@/services/endpoints";
import { setToken, setUser } from "@/store/sessionsSlice";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  subscription_status: string;
  first_name: string;
  last_name: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<{
    email: string;
    password: string;
  }>({
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    const data = {
      email: body.email,
      password: body.password,
    };
    try {
      const res = await auth.login(data);
      const token = res.data.data.token;
      const decoded: TokenPayload = jwtDecode(token);
      dispatch(setToken(token));
      dispatch(setUser(decoded));
      toast.success(`Bienvenido ${decoded?.first_name} ${decoded?.last_name}`);
      navigate("/");
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
              Bienvenido
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Inicia sesión con tu cuenta
            </Typography>

            <Fade in={true} timeout={500}>
              <Box maxWidth="md" sx={{ mt: 2 }}>
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

                    <Grid size={{ xs: 12 }}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={!!errors.password}
                      >
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: required("Contraseña"),
                            validate: noTrimSpaces,
                          }}
                          render={({ field }) => (
                            <OutlinedInput
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                      },
                                    }}
                                  >
                                    {showPassword ? (
                                      <VisibilityIcon />
                                    ) : (
                                      <VisibilityOffIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Password"
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors.password?.message || " "}
                        </FormHelperText>
                      </FormControl>
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
                        Iniciar sesión
                      </Button>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          my: 1,
                        }}
                      >
                        <Link
                          href="/recovery-password-request"
                          variant="body2"
                          sx={{ cursor: "pointer" }}
                        >
                          Olvidaste tu contraseña?
                        </Link>
                      </Box>
                      <Divider></Divider>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          marginTop: 2,
                        }}
                      >
                        {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Facebook")}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button> */}
                        <Typography sx={{ textAlign: "center" }}>
                          ¿No tienes una cuenta?{" "}
                          <Link
                            href="/sign-in/"
                            variant="body2"
                            sx={{ alignSelf: "center", cursor: "pointer" }}
                          >
                            Registrarse
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

        {/* Imagen decorativa */}
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
