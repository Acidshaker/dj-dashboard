import { plans, subscriptions, user } from "@/services/endpoints";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Plan } from "@/types/Plan";
import { PlanCard } from "@/components/subscriptions/PlanCard";
import { toast } from "react-toastify";
import { Subscription } from "@/types/Subscription";
import { useAlerts } from "@/utils/alerts";

export const Subscriptions = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState<Plan[]>([]);
  const [mySubscription, setMySubscription] = useState<Subscription | null>(
    null
  );
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { confirmationAlert } = useAlerts();
  const navigate = useNavigate();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const statusMap: Record<string, string> = {
    active: "Activa",
    inactive: "Inactiva",
    cancelled: "Cancelada",
  };

  const isForDays = mySubscription?.plan.days > 0;
  const eventText = isForDays
    ? "Eventos ilimitados"
    : `${mySubscription?.events_remaining} eventos restantes`;

  const endDate = isForDays
    ? new Date(mySubscription.end_date).toLocaleDateString()
    : "Sin fecha de expiración";

  const renewalDate = mySubscription?.renewal_date
    ? new Date(mySubscription?.renewal_date).toLocaleDateString()
    : "Sin renovación";

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";

      case "inactive":
        return "Inactiva";
      case "cancelled":
        return "Cancelada";
      default:
        return "Expirada";
    }
  };

  const getPlans = async () => {
    dispatch(showLoading());
    try {
      const res = await plans.getAll();
      setItems(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const cancelSubscription = async () => {
    const foo = async () => {
      dispatch(showLoading());
      try {
        const res = await subscriptions.cancelSubscription();
        console.log(res.data);
        toast.success("Suscripción cancelada con éxito");
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    confirmationAlert(
      foo,
      "¿Seguro que deseas cancelar tu suscripción? podrás seguir utilizando los servicios hasta que tu plan finalice"
    );
  };

  const getMySubscription = async () => {
    dispatch(showLoading());
    try {
      const res = await subscriptions.getMySubscription();
      setMySubscription(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const createSession = async (planId: number) => {
    const foo = async () => {
      dispatch(showLoading());
      try {
        const res = await subscriptions.createSession(planId);
        if (res.data.data?.url) {
          window.location.href = res.data.data.url;
        } else {
          toast.success("Su plan ha sido adquirido con éxito");
          await getMySubscription();
          await getPlans();
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    confirmationAlert(foo, `¿Seguro que deseas adquirir este plan?`);
  };

  useEffect(() => {
    getMySubscription();
    getPlans();
  }, []);

  useEffect(() => {
    if (status === "cancel") {
      toast.info("El proceso de pago fue cancelado");
      navigate("/subscriptions", { replace: true }); // 👈 limpia los params
    }

    if (status === "success" && sessionId) {
      const verifySession = async () => {
        try {
          const res = await subscriptions.verifySession(sessionId);
          if (res.data.data.isPaid) {
            toast.success("Suscripción activada con éxito");
          } else {
            toast.error("Error al activar la suscripción");
          }
        } catch (error) {
          console.error(error);
          toast.error("Error al verificar el pago");
        } finally {
          navigate("/subscriptions", { replace: true }); // 👈 limpia los params
        }
      };

      verifySession();
    }
  }, [status, sessionId, navigate]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mi suscripción
      </Typography>
      {mySubscription ? (
        <Fade in={mySubscription !== null}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 2,
              borderLeft: `6px solid ${
                mySubscription.status === "active"
                  ? "#4CAF50"
                  : mySubscription.status === "cancelled"
                  ? "#FF9800"
                  : mySubscription.status
                  ? "#e03263ff"
                  : "#2196F3"
              }`,
              width: "100%",
              position: "relative",
            }}
          >
            {/* Menú de opciones */}
            {mySubscription?.renewal_date && (
              <>
                <Tooltip title="Opciones">
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={cancelSubscription}>
                    Cancelar suscripción
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Contenido de la tarjeta */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Suscripción actual: {mySubscription.plan.name}
            </Typography>
            <Typography variant="body2">
              Estado:{" "}
              <Chip
                label={getStatusLabel(mySubscription.status)}
                color={mySubscription.status === "active" ? "success" : "error"}
              />
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Fecha de inicio:{" "}
              {new Date(mySubscription.start_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Fin: {endDate}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Renovación: {renewalDate}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {eventText}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Precio: ${mySubscription.plan.price.toFixed(2)}
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Fade in={!mySubscription}>
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
            <Typography variant="body2">
              No tienes ninguna suscripción
            </Typography>
          </Paper>
        </Fade>
      )}

      <Container
        sx={{
          width: "100%",
          mt: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {items.length ? (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              justifySelf={"start"}
              sx={{ mb: 2 }}
            >
              Planes disponibles para ti
              {mySubscription && (
                <Tooltip title="Solo verás los planes superiores a tu suscripción actual">
                  <IconButton color="default" size="small">
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
            <Fade in={true} timeout={1000}>
              <Grid container spacing={2} justifyContent="center">
                {items.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                    <PlanCard
                      plan={item}
                      onSelect={() => {
                        createSession(item.id);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Fade>
          </>
        ) : (
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            textAlign={"center"}
          >
            No tienes planes disponibles
          </Typography>
        )}
      </Container>
    </Box>
  );
};
