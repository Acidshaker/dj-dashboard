import { stripe, user } from "@/services/endpoints";
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
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { G } from "msw/lib/core/HttpResponse-CKZrrwKE";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { UserInfo } from "@/types/UserInfo";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ flexGrow: 1 }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: "100%" }}>
          <Typography sx={{ height: "100%" }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const User = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<{
    firstName: string;
    lastName: string;
  }>({
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [value, setValue] = useState(0);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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

  const getStripeStatus = async () => {
    dispatch(showLoading());
    try {
      const res = await stripe.getStatus();
      console.log(res.data.data);
      toast.success(res.data.message);
      await getProfile();
      navigate("/me", { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const onSubmit = async (data: any) => {
    dispatch(showLoading());
    try {
      const res = await user.updateProfile(data);
      toast.success(res.data.message);
      await getProfile();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleStripe = async () => {
    dispatch(showLoading());
    try {
      const res = await stripe.account();
      console.log(res.data.data);
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.href = res.data.data.url;
      }, 2000);
      // window.location.href = res.data.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
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

  useEffect(() => {
    if (status) {
      getStripeStatus();
    }
  }, [status, navigate]);

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
      <Tabs
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="tabs"
      >
        <Tab label="Mi información" {...a11yProps(0)} />
        <Tab label="Recibir pagos con Stripe" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
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
                    InputLabelProps={{ shrink: watch("firstName") !== "" }}
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
                    InputLabelProps={{ shrink: watch("lastName") !== "" }}
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Fade in={true} timeout={500}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 2,
              borderLeft: "6px solid #1976d2",
              width: "100%",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">
                Cuenta de Stripe:{" "}
                <Chip
                  label={
                    userInfo?.isStripeVerified ? "Verificado" : "No verificado"
                  }
                  color={userInfo?.isStripeVerified ? "success" : "error"}
                />
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleStripe}
              >
                Configurar Stripe
              </Button>
            </Box>
          </Paper>
        </Fade>
      </TabPanel>
    </Box>
  );
};
