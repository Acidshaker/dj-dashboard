import {
  eventMusic,
  events,
  plans,
  songs,
  subscriptions,
  user,
} from "@/services/endpoints";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ReactNode,
  SyntheticEvent,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  required,
  strongPassword,
  isEmail,
  minLength,
  samePassword,
  maxLength,
  minValue,
  noTrimSpaces,
  decimalsLength,
  noNegative,
} from "@/utils/validations";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Plan } from "@/types/Plan";
import { PlanCard } from "@/components/subscriptions/PlanCard";
import { toast } from "react-toastify";
import { useAlerts } from "@/utils/alerts";
import { EventForm } from "@/components/events/EventForm";
import BaseTable from "@/components/shared/Table";
import { Controller, useForm } from "react-hook-form";
import { RequestModal } from "@/components/events/RequestModal";
import { useWatch } from "react-hook-form";
import BusinessIcon from "@mui/icons-material/Business";

interface Package {
  id: number;
  name: string;
  tip: number;
  type: string;
  is_optional_tip: boolean;
}

export const EventDetailsClient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    clearErrors,
    unregister,
    reset,
    setValue,
    watch,
  } = useForm<{
    package: Package | null;
    song: object | null;
    description: string | null;
    applicant_name: string | null;
    tip: string;
  }>({
    mode: "onChange",
    defaultValues: {
      package: null,
      song: null,
      description: null,
    },
  });
  const dispatch = useDispatch();
  const [event, setEvent] = useState<any | null>(null);
  const { eventId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSong, setIsSong] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<any | null>(null);
  const [eventMusicId, setEventMusicId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  const { confirmationAlert } = useAlerts();
  const navigate = useNavigate();
  const prevPackageIdRef = useRef<number | null | undefined>(null);

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
  const getEvent = async () => {
    dispatch(showLoading());
    try {
      const res = await events.getEventByIdClient(eventId!);
      setEvent(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setRequest(null);
  };

  const onSubmit = async (data: any) => {
    dispatch(showLoading());
    console.log(data);
    try {
      const res = await events.getStripeValidation(event.userId);
      const isStripe = res.data.data;
      const body = {
        applicant: data.applicant_name || null,
        eventId: eventId,
        type: isSong ? "song" : "mention",
        description: data.description || null,
        tip: data.package?.is_optional_tip ? +data.tip : data.package?.tip,
        name: data.song?.name || null,
        author: data.song?.author || null,
        duration: data.song?.duration || null,
        album_logo: data.song?.album_logo || null,
        spotify_url: data.song?.spotify_url || null,
        isStripe,
      };
      setRequest(body);
      setIsModalOpen(true);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    const fetchTracks = async () => {
      if (!inputValue) return;
      setLoading(true);
      try {
        const res = await songs.getSongs({
          search: inputValue,
        });

        setOptions(res.data.data);
      } catch (error) {
        console.error("Error fetching tracks", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchTracks();
    }, 500); // debounce de 500ms

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {
    if (status === "cancel") {
      toast.info("El proceso fue cancelado");
      navigate(`/client/event/${eventId}`, { replace: true });
    }

    if (status === "success" && sessionId) {
      setEventMusicId(sessionId);
      toast.success(
        "🙌 ¡Gracias por apoyar al DJ! Tu solicitud fue enviada. El DJ decide cuáles tocar según su repertorio y ritmo del evento. Tu propina lo ayuda a mantener la energía al máximo",
        { autoClose: false }
      );
      navigate(`/client/event/${eventId}`, { replace: true });
    }
  }, [status, sessionId, navigate]);

  const packageValue = useWatch({
    control,
    name: "package",
  });

  useEffect(() => {
    // Si no hay paquete, resetea la referencia
    if (!packageValue) {
      prevPackageIdRef.current = null;
      return;
    }

    const { tip, is_optional_tip, type, id } = packageValue;
    if (id !== prevPackageIdRef.current) {
      setIsSong(type === "both" || type === "song");
      if (is_optional_tip) {
        setValue("tip", "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        const fixedTip =
          tip === 0
            ? "Gratuito"
            : typeof tip === "number"
            ? tip.toFixed(2)
            : "";
        setValue("tip", fixedTip, {
          shouldValidate: false,
          shouldDirty: false,
        });
        clearErrors("tip");
      }
    }
    prevPackageIdRef.current = id;
  }, [packageValue, setValue, clearErrors, setIsSong]);

  useEffect(() => {
    const getEventMusic = async () => {
      try {
        const res = await eventMusic.getEventMusicBySessionId({
          session_id: eventMusicId,
        });
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (eventMusicId) {
      getEventMusic();
    }
  }, [eventMusicId]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Fade in={event !== null}>
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
          {/* Nombre del evento */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {event?.name}
          </Typography>

          {/* Datos de la compañía si existen */}
          {event?.companyData && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Logo o Avatar */}
              {event.companyData.logo ? (
                <Avatar
                  src={event.companyData.logo}
                  alt={event.companyData.company_name}
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
              ) : (
                <Avatar sx={{ width: 100, height: 100 }}>
                  <BusinessIcon sx={{ fontSize: 50 }} />
                </Avatar>
              )}

              {/* Información textual */}
              <Box>
                {event.companyData.company_name && (
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.companyData.company_name}
                  </Typography>
                )}
                {event.companyData.company_phone && (
                  <Typography variant="body2" color="text.secondary">
                    📞 {event.companyData.company_phone}
                  </Typography>
                )}
                {event.companyData.company_email && (
                  <Typography variant="body2" color="text.secondary">
                    ✉️ {event.companyData.company_email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Fade>

      {event?.status === "not_started" && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            El evento no ha iniciado
          </Typography>
        </Box>
      )}
      {event?.status === "active" && (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Realizar solicitud
          </Typography>
          <Container sx={{ width: "100%", mt: 2, flexGrow: 1 }}>
            {/* Formulario */}
            <Fade in={true} timeout={1000}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Controller
                      name="package"
                      control={control}
                      rules={{ required: "Opción es requerida" }}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="package-select-label">
                            Elegir opción
                          </InputLabel>
                          <Select
                            labelId="package-select-label"
                            id="package-select"
                            label="Opción"
                            value={field.value?.id || ""}
                            onChange={(e) => {
                              const selectedPkg =
                                event?.group?.eventPackages?.find(
                                  (pkg) => pkg.id === e.target.value
                                );
                              field.onChange(selectedPkg);
                            }}
                          >
                            {event?.group?.eventPackages?.map((pkg: any) => (
                              <MenuItem key={pkg.id} value={pkg.id}>
                                {pkg.name} -{" "}
                                {pkg.tip
                                  ? `$${pkg.tip} MXN`
                                  : pkg.tip == 0
                                  ? "Gratis"
                                  : "propina voluntaria"}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {watch("package") &&
                        watch("package").type !== "mention" && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={watch("package").type !== "both"}
                                checked={isSong}
                                onChange={(e) => setIsSong(e.target.checked)}
                              />
                            }
                            label="Canción"
                          />
                        )}
                      {watch("package") && watch("package").type !== "song" && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={watch("package").type !== "both"}
                              checked={!isSong}
                              onChange={(e) => setIsSong(!e.target.checked)}
                            />
                          }
                          label="Mención"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <TextField
                      label="Nombre del solicitante (opcional)"
                      fullWidth
                      {...register("applicant_name", {
                        validate: {
                          maxLength: maxLength(50),
                          noTrimSpaces: noTrimSpaces,
                        },
                      })}
                      error={!!errors.applicant_name}
                      helperText={errors.applicant_name?.message || " "}
                    />
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Controller
                      name="tip"
                      control={control}
                      rules={
                        watch("package")?.is_optional_tip
                          ? {
                              required: required("Propina"),
                              validate: {
                                noNegative,
                                decimals: decimalsLength(2),
                                minValue: minValue(10),
                              },
                            }
                          : {}
                      }
                      render={({ field }) => {
                        const pkg = packageValue;
                        const isOptional = !!pkg?.is_optional_tip;
                        const fixedTip = pkg?.tip; // puede ser number | null | undefined | string

                        // guard robusto: solo aplicar toFixed si fixedTip es un number válido
                        let displayValue: string | number = field.value ?? "";
                        if (!isOptional) {
                          if (fixedTip === 0) {
                            displayValue = "Gratuito";
                          } else if (
                            fixedTip !== null &&
                            fixedTip !== undefined &&
                            !isNaN(Number(fixedTip))
                          ) {
                            // garantizamos que sea número
                            displayValue = Number(fixedTip).toFixed(2);
                          } else {
                            displayValue = "";
                          }
                        }

                        return (
                          <TextField
                            {...field}
                            value={displayValue}
                            label="Propina"
                            type={isOptional ? "number" : "text"}
                            fullWidth
                            disabled={!isOptional}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.tip}
                            helperText={errors.tip?.message || " "}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  MXN
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => {
                              if (isOptional) {
                                // convertir a string/number según prefieras; aquí lo guardamos tal cual
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </Grid>
                  {isSong && watch("package") ? (
                    <Grid size={{ md: 12, xs: 12 }}>
                      <Controller
                        name="song"
                        control={control}
                        rules={{
                          required: isSong ? "Canción es requerida" : false,
                        }}
                        render={({ field }) => (
                          <Autocomplete
                            freeSolo
                            options={options}
                            value={field.value}
                            onChange={(e, value) => field.onChange(value)}
                            onInputChange={(e, value) => setInputValue(value)}
                            getOptionLabel={(option) =>
                              typeof option === "string"
                                ? option
                                : `${option.name} - ${option.author}`
                            }
                            loading={loading}
                            clearOnEscape
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                {...props}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  paddingY: 1,
                                }}
                                key={option.spotify_url}
                              >
                                <Avatar
                                  src={option.album_logo}
                                  variant="square"
                                />
                                <Box>
                                  <Typography variant="body1" fontWeight="bold">
                                    {option.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {option.author} • {option.duration}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="primary"
                                    component="a"
                                    href={option.spotify_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textDecoration: "none" }}
                                  >
                                    Escuchar en Spotify
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Buscar canción"
                                variant="outlined"
                                fullWidth
                                error={!!errors.song}
                                helperText={errors.song?.message || " "}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loading ? (
                                        <CircularProgress size={20} />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                  ) : null}
                  {!isSong && watch("package") ? (
                    <Grid size={{ md: 12, xs: 12 }}>
                      <TextField
                        label="Mención"
                        fullWidth
                        multiline
                        rows={4}
                        {...register("description", {
                          required: isSong ? false : required("Mención"),
                          validate: {
                            maxLength: maxLength(150),
                            noTrimSpaces: noTrimSpaces,
                          },
                        })}
                        error={!!errors.description}
                        helperText={errors.description?.message || " "}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color={
                            watch("description") &&
                            watch("description").length > 150
                              ? "error"
                              : "text.secondary"
                          }
                        >
                          {watch("description")
                            ? watch("description").length
                            : 0}
                          /150
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Button
                      disabled={!watch("package")}
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                    >
                      Continuar y revisar solicitud
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Fade>
          </Container>
        </Box>
      )}
      {event?.status === "finished" && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            El evento ha finalizado
          </Typography>
        </Box>
      )}
      <RequestModal
        open={isModalOpen}
        handleClose={handleClose}
        data={request}
      />
    </Box>
  );
};
