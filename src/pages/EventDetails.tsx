import {
  eventMusic,
  events,
  plans,
  subscriptions,
  user,
} from "@/services/endpoints";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { useNavigate, useParams } from "react-router-dom";
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
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { useAlerts } from "@/utils/alerts";
import BaseTable from "@/components/shared/Table";
import { EventForm } from "@/components/events/EventForm";
import {
  clearEventMusicContext,
  setEventMusicContext,
} from "@/utils/globalSocket";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { MetricCard } from "@/components/shared/MetricCard";

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
      {value === index && <Box sx={{ p: 3, height: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const EventDetails = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { confirmationAlert } = useAlerts();

  const [event, setEvent] = useState<any | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [value, setValue] = useState(0);
  const [visibleTabs, setVisibleTabs] = useState<string[]>([]);

  const theme = useTheme();

  const tableRefRequests = useRef<{
    reloadData: () => void;
    getItems: () => any;
  }>(null);
  const tableRefHistoryLine = useRef<{
    reloadData: () => void;
    getItems: () => any;
  }>(null);

  const open = Boolean(anchorEl);

  const handleChange = (event: SyntheticEvent, newValue: number) =>
    setValue(newValue);

  const getEventStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "finished":
        return "Finalizado";
      case "not_started":
        return "No iniciado";
      default:
        return "Desconocido";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "finished":
        return "error";
      case "not_started":
        return "info";
      default:
        return "default";
    }
  };

  const getEventStatusBorderColor = (status: string) => {
    switch (status) {
      case "active":
        return "#27e696ff";
      case "finished":
        return "#e03263ff";
      case "not_started":
        return "#1976d2";
      default:
        return "#1976d2";
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getStripeValidation = async () => {
    try {
      const res = await user.profile();
      return res.data.data.isStripeVerified;
    } catch (error) {
      console.log(error);
    }
  };

  const getEvent = async () => {
    dispatch(showLoading());
    try {
      const res = await events.getEventById(eventId!);
      setEvent(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const cancelEvent = async () => {
    setAnchorEl(null);
    const action = async () => {
      dispatch(showLoading());
      try {
        await events.cancelEvent(eventId!);
        toast.success("Evento cancelado con éxito");
        navigate("/events");
      } finally {
        dispatch(hideLoading());
      }
    };
    confirmationAlert(action, "¿Seguro que deseas cancelar el evento?");
  };

  const openModal = () => {
    setAnchorEl(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getEvent();
  };

  const startEvent = async () => {
    const action = async () => {
      dispatch(showLoading());
      try {
        await events.startEvent(eventId!);
        toast.success("Evento iniciado con éxito");
        await getEvent();
      } finally {
        dispatch(hideLoading());
      }
    };
    const res = await getStripeValidation();

    confirmationAlert(
      action,
      `¿Seguro que deseas iniciar el evento? ${
        res
          ? ""
          : "No tienes una cuenta de Stripe verificada, solo podrás recibir pagos en efectivo."
      }`
    );
  };

  const finishEvent = async () => {
    const action = async () => {
      dispatch(showLoading());
      try {
        await events.finishEvent(eventId!);
        toast.success("Evento finalizado con éxito");
        await getEvent();
      } finally {
        dispatch(hideLoading());
      }
    };

    let pending = 0;
    if (tableRefRequests.current) {
      pending =
        tableRefRequests.current.getItems()?.filter((i: any) => !i.is_played)
          .length || 0;
    } else if (tableRefHistoryLine.current) {
      pending =
        tableRefHistoryLine.current.getItems()?.filter((i: any) => !i.is_played)
          .length || 0;
    }

    const msg =
      pending > 0
        ? `Existen ${pending} solicitudes sin reproducir, ¿Seguro que deseas finalizar el evento?`
        : "¿Seguro que deseas finalizar el evento?";

    confirmationAlert(action, msg);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🟢 Sincroniza tabs visibles según el status del evento
  useEffect(() => {
    if (!event) return;
    const tabs: string[] = [];
    if (event.status === "active") tabs.push("Solicitudes");
    if (event.status === "active" || event.status === "finished") {
      tabs.push("Historial");
      // tabs.push("Estadísticas");
    }
    setVisibleTabs(tabs);

    // Ajusta el value automáticamente al índice correcto
    if (tabs.length > 0) {
      if (event.status === "finished") setValue(tabs.indexOf("Historial"));
      else setValue(0);
    }
  }, [event]);

  useEffect(() => {
    getEvent();
  }, [eventId]);

  // Manejo del socket global (opcional, según tu código original)
  useEffect(() => {
    if (eventId) {
      setEventMusicContext(eventId, () => {
        if (value === 1) tableRefHistoryLine.current?.reloadData();
        else tableRefRequests.current?.reloadData();
      });
    }
    return () => clearEventMusicContext();
  }, [eventId, value]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
      }}
    >
      <Fade in={!!event}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 2,
            borderLeft: "6px solid",
            borderLeftColor: getEventStatusBorderColor(event?.status),
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <Tooltip title="Volver">
              <IconButton onClick={() => navigate("/events")}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            {event?.status !== "finished" && (
              <Tooltip title="Opciones">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            {event?.status === "not_started" && (
              <MenuItem onClick={cancelEvent}>Cancelar evento</MenuItem>
            )}
            <MenuItem onClick={openModal}>Editar evento</MenuItem>
          </Menu>

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {event?.name}{" "}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ display: "inline" }}
            >
              {event?.folio}
            </Typography>
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2">
              Estado:{" "}
              <Chip
                label={getEventStatus(event?.status)}
                color={getEventStatusColor(event?.status)}
              />
            </Typography>

            {event?.status === "not_started" && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
                onClick={startEvent}
              >
                Iniciar evento
              </Button>
            )}

            {event?.status === "active" && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
                onClick={finishEvent}
              >
                Finalizar evento
              </Button>
            )}
          </Box>
        </Paper>
      </Fade>

      {event?.status !== "not_started" ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <Tabs
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="tabs"
          >
            {visibleTabs.map((label, index) => (
              <Tab key={index} label={label} {...a11yProps(index)} />
            ))}
          </Tabs>

          {visibleTabs.map((label, index) => (
            <TabPanel key={index} value={value} index={index}>
              {label === "Solicitudes" && (
                <BaseTable
                  ref={tableRefRequests}
                  action="musicRequests"
                  extraParams={{ eventId: eventId, is_played: false }}
                  title="Solicitudes"
                  isOnlyTable={true}
                  isPlay={true}
                  onAddClick={(item: any) => console.log(item)}
                />
              )}
              {label === "Historial" && (
                <BaseTable
                  ref={tableRefHistoryLine}
                  action="historyLine"
                  extraParams={{ eventId: eventId }}
                  hasActions={false}
                  title="Historial"
                  isOnlyTable={true}
                  onAddClick={(item: any) => console.log(item)}
                />
              )}
              {label === "Estadísticas" && (
                <Box>
                  <Grid container size={6} spacing={2} alignItems={"center"}>
                    <Grid
                      size={{ md: 4, xs: 12 }}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <MetricCard
                        title="Ganancias"
                        value={140000}
                        prefix="$"
                        unit="MXN"
                      />
                    </Grid>
                    <Grid
                      size={{ md: 4, xs: 12 }}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <MetricCard
                        title="
                        Duración del evento"
                        value={86}
                        unit="min"
                      />
                    </Grid>

                    <Grid
                      size={{ md: 4, xs: 12 }}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Box width={250} height={250} position="relative">
                        <Gauge
                          value={75}
                          startAngle={-90}
                          endAngle={90}
                          sx={{
                            [`& .${gaugeClasses.valueArc}`]: {
                              fill: theme.palette.success.main,
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                              fill: theme.palette.error.main,
                            },
                            [`& .${gaugeClasses.valueText}`]: {
                              fontSize: 20,
                              color: theme.palette.success.main,
                            },
                          }}
                          text={(value) => ``}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 80,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            pointerEvents: "none",
                          }}
                        >
                          {/* Valor principal */}
                          <Box fontSize={24} fontWeight="bold">
                            75 / 100
                          </Box>

                          {/* Leyenda */}
                          <Box fontSize={12} color="text.secondary">
                            Solicitudes
                          </Box>

                          {/* Leyenda con indicadores */}
                          <Box display="flex" gap={2} mt={1}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Box
                                width={10}
                                height={10}
                                borderRadius="50%"
                                bgcolor="success.main"
                              />
                              <Box fontSize={12} color="text.secondary">
                                Completados
                              </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Box
                                width={10}
                                height={10}
                                borderRadius="50%"
                                bgcolor="error.main"
                              />
                              <Box fontSize={12} color="text.secondary">
                                Sin completar
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </TabPanel>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
          >
            Aquí verás las solicitudes en tiempo real cuando inicies el evento
          </Typography>
        </Box>
      )}

      <EventForm
        open={isModalOpen}
        handleClose={closeModal}
        data={event}
        isEdit={true}
      />
    </Box>
  );
};
