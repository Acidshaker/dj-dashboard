import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  FilledInput,
  FormControl,
  FormHelperText,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  required,
  strongPassword,
  isEmail,
  minLength,
  samePassword,
  noTrimSpaces,
} from "../../utils/validations";
import Textarea from "@mui/joy/Textarea";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { companies, eventMusic, events, groups } from "@/services/endpoints";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import AsyncAutocomplete, {
  AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import { GroupForm } from "../groups/GroupForm";
import { styled } from "@mui/material/styles";
import microphone from "@/assets/microphone.png";
import { useAlerts } from "@/utils/alerts";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
}

export const RequestModal = ({ open, handleClose, data }: props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
  } = useForm<{
    paymentMethod: string | null;
  }>({
    mode: "onChange",
    defaultValues: {
      paymentMethod: null,
    },
  });
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 16px)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { confirmationAlert } = useAlerts();
  const handleCancel = () => {
    handleClose();
  };

  const handleCheckout = (body: any) => {
    const newBody = { ...body, ...data };
    const foo = async () => {
      setLoading(true);
      dispatch(showLoading());
      try {
        const res = await eventMusic.createSession(newBody);
        console.log(res.data.data);
        if (res.data.data?.url) {
          window.location.href = res.data.data.url;
        } else {
          toast.success(
            "🙌 ¡Gracias por apoyar al DJ! Tu solicitud fue enviada. El DJ decide cuáles tocar según su repertorio y ritmo del evento. Tu propina lo ayuda a mantener la energía al máximo",
            { autoClose: false }
          );
        }
        handleClose();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        dispatch(hideLoading());
      }
    };
    confirmationAlert(foo, `¿Seguro que deseas continuar?`);
  };

  useEffect(() => {
    if (!open) return;
    console.log(data);
  }, [open]);

  useEffect(() => {
    if (!open) {
      reset(
        {
          paymentMethod: null,
        },
        {
          keepDirty: false,
        }
      );
    } else {
      if (!data?.is_optional_tip && data?.tip == 0) {
        setValue("paymentMethod", "cash");
      }
    }
  }, [open]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box maxWidth="sm" sx={style}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Detalles de tu solicitud
          </Typography>
          <form onSubmit={handleSubmit(handleCheckout)}>
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography variant="body1" gutterBottom>
                  Tipo: {data?.type === "song" ? "Cancion" : "Mención"}
                </Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography variant="body1" gutterBottom>
                  Propina: ${data?.tip.toFixed(2)} MXN
                </Typography>
              </Grid>
              <Grid size={{ md: 12, xs: 12 }}>
                <Typography variant="body1" gutterBottom>
                  Nombre del solicitante:{" "}
                  {data?.applicant_name
                    ? data?.applicant_name
                    : "Cliente anónimo"}
                </Typography>
              </Grid>
              {!data?.is_optional_tip && data?.tip > 0 && (
                <Grid size={{ md: 12, xs: 12 }}>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    rules={{ required: "método es requerido" }}
                    render={({ field }) => (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="select-label">Elegir método</InputLabel>
                        <Select
                          labelId="select-label"
                          id="select"
                          label="Elegir método"
                          {...field}
                        >
                          <MenuItem value="cash">Efectivo</MenuItem>
                          {data?.isStripe && (
                            <MenuItem value="stripe">Tarjeta</MenuItem>
                          )}
                        </Select>
                        <FormHelperText error>
                          {errors.paymentMethod?.message || " "}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            {data?.type === "song" ? (
              <Grid container spacing={2}>
                {/* <Grid size={{ md: 6, xs: 12 }}>
            </Grid> */}

                <Grid size={{ md: 12, xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      alt="album_logo"
                      src={data?.album_logo}
                      sx={{ width: 56, height: 56, alignSelf: "flex-start" }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {data.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.author} • {data.duration}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="primary"
                        component="a"
                        href={data.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: "none" }}
                      >
                        Escuchar en Spotify
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid size={{ md: 12, xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      alt="mention_logo"
                      src={microphone}
                      sx={{ width: 56, height: 56, alignSelf: "center" }}
                    />
                    <Box>
                      <Typography variant="caption" color="primary">
                        Descripción
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {data?.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null
                  }
                >
                  {loading ? "Procesando..." : "Confirmar"}{" "}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
