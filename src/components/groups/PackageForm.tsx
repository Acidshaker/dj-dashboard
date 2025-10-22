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
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { ValidatedTextArea } from "../shared/ValidatedTextarea";
import { packages } from "@/services/endpoints";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

export const PackageForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
}: props) => {
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

  const methods = useForm<{
    name: string;
    type: string;
    tip: string;
  }>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = methods;

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      if (!isEdit) {
        const res = await packages.createPackage(body);
        console.log(res.data.data);
      } else {
        const res = await packages.updatePackage(data.id, body);
        console.log(res.data);
      }
      toast.success(
        `Paquete ${isEdit ? "actualizado" : "registrado"} con éxito`
      );
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    reset();
    handleClose();
  };

  useEffect(() => {
    if (open && isEdit && data) {
      reset({
        name: data.name,
        type: data.type,
        tip: data.tip,
      });
    } else if (open && !isEdit) {
      reset({ name: "", type: "", tip: "" }, { keepDirty: false });
    }
  }, [open, isEdit, data, reset]);

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
        <Box maxWidth="md" sx={style}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            {isEdit ? "Editar paquete" : "Registrar paquete"}
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, xs: 12 }}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    {...register("name", {
                      required: required("Nombre"),
                      validate: noTrimSpaces,
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message || " "}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel id="select-label">Tipo</InputLabel>
                    <Controller
                      name="type"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: required("tipo"),
                        validate: noTrimSpaces,
                      }}
                      render={({ field }) => (
                        <Select labelId="select-label" label="Rol" {...field}>
                          <MenuItem value={"song"}>Canción</MenuItem>
                          <MenuItem value={"mention"}>Mención</MenuItem>
                          <MenuItem value={"both"}>Cualquiera</MenuItem>
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors.type?.message || " "}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                  <TextField
                    label="Propina"
                    type="number"
                    fullWidth
                    {...register("tip", {
                      required: required("Propina"),
                    })}
                    error={!!errors.tip}
                    helperText={errors.tip?.message || " "}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleCancel}
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
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Fade>
    </Modal>
  );
};
