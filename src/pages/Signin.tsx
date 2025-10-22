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
  samePassword,
  noTrimSpaces,
} from "@/utils/validations";
import { auth } from "@/services/endpoints";

export const Signin = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleClickShowConfirm = () => setShowConfirm((show) => !show);

  const handleMouseDownConfirm = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    const data = {
      email: body.email,
      username: body.email,
      password: body.password,
      first_name: body.firstName,
      last_name: body.lastName,
      roleId: 2,
    };
    try {
      const res = await auth.register(data);
      console.log(res.data);
      toast.success(
        `Cuenta creada exitosamente, revise su correo para activar su cuenta`
      );
      navigate("/login");
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
              Crea tu cuenta
            </Typography>
            <Fade in={true} timeout={500}>
              <Box maxWidth="md">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid size={{ md: 6, xs: 12 }}>
                      <TextField
                        label="Nombre(s)"
                        fullWidth
                        {...register("firstName", {
                          required: required("Nombre"),
                          validate: noTrimSpaces,
                        })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message || " "}
                      />
                    </Grid>

                    <Grid size={{ md: 6, xs: 12 }}>
                      <TextField
                        label="Apellido(s)"
                        fullWidth
                        {...register("lastName", {
                          required: required("Apellido"),
                          validate: noTrimSpaces,
                        })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message || " "}
                      />
                    </Grid>

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

                    <Grid size={{ xs: 12 }}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={!!errors.confirmPassword}
                      >
                        <InputLabel htmlFor="confirm">
                          Confirmar contraseña
                        </InputLabel>
                        <Controller
                          name="confirmPassword"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: required("Contraseña"),
                            validate: samePassword(watch("password")),
                          }}
                          render={({ field }) => (
                            <OutlinedInput
                              id="confirm"
                              type={showConfirm ? "text" : "password"}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirm}
                                    onMouseDown={handleMouseDownConfirm}
                                    onMouseUp={handleMouseUpConfirm}
                                    edge="end"
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                      },
                                    }}
                                  >
                                    {showConfirm ? (
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
                          {errors.confirmPassword?.message || " "}
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
                        Registrar cuenta
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
