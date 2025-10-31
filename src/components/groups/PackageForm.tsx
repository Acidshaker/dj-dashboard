import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  FilledInput,
  FormControl,
  FormControlLabel,
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
  decimalsLength,
  noNegative,
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
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { useWatch } from "react-hook-form";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
    ...theme.applyStyles("dark", {
      backgroundColor: "#30404d",
    }),
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
    ...theme.applyStyles("dark", {
      background: "rgba(57,75,89,.5)",
    }),
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
    backgroundColor: "#394b59",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))",
  }),
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

// Inspired by blueprintjs
function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{ "&:hover": { bgcolor: "transparent" } }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      {...props}
    />
  );
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
    isOptionalTip: boolean;
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
        isOptionalTip: data.is_optional_tip,
        tip: data.is_optional_tip ? "Propina voluntaria" : data.tip,
      });
    } else if (open && !isEdit) {
      reset({ name: "", type: "", tip: "" }, { keepDirty: false });
    }
  }, [open, isEdit, data, reset]);

  const isOptionalTip = useWatch({
    control,
    name: "isOptionalTip",
  });

  useEffect(() => {
    reset((prev) => ({
      ...prev,
      tip: isOptionalTip ? "Propina voluntaria" : "0",
    }));
  }, [isOptionalTip]);

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
            {isEdit ? "Editar paquete" : "Registrar paquete"}
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, xs: 12 }}>
                  <TextField
                    label="Nombre"
                    InputLabelProps={{ shrink: watch("name") !== "" }}
                    fullWidth
                    {...register("name", {
                      required: required("Nombre"),
                      validate: noTrimSpaces,
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message || " "}
                  />
                </Grid>

                <Grid size={{ md: 12, xs: 12 }}>
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

                <Grid size={{ md: 12, xs: 12 }}>
                  <Controller
                    name="isOptionalTip"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <BpCheckbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="¿Deseas que la propina sea voluntaria?"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12 }}>
                  <TextField
                    label="Propina"
                    InputLabelProps={{ shrink: watch("tip") !== "" }}
                    disabled={watch("isOptionalTip")}
                    type={`${!watch("isOptionalTip") ? "number" : "text"}`}
                    fullWidth
                    {...register(
                      "tip",
                      watch("isOptionalTip")
                        ? {}
                        : {
                            required: required("Propina"),
                            validate: {
                              noNegative,
                              decimals: decimalsLength(2),
                            },
                          }
                    )}
                    error={!!errors.tip}
                    helperText={errors.tip?.message || " "}
                    InputProps={{
                      endAdornment: watch("isOptionalTip") ? null : (
                        <InputAdornment position="end">MXN</InputAdornment>
                      ),
                    }}
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
