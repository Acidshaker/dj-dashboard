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
import { companies, events, groups, user } from "@/services/endpoints";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import AsyncAutocomplete, {
  AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import { GroupForm } from "../groups/GroupForm";
import { styled } from "@mui/material/styles";
import { useAlerts } from "@/utils/alerts";

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

export const EventForm = ({
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
    folio: string;
    date: Dayjs;
    name: string;
    group: object;
    isCompany: boolean;
  }>({
    mode: "onTouched",
    defaultValues: {
      date: dayjs(),
      isCompany: false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = methods;

  const dispatch = useDispatch();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [companyData, setCompanyData] = useState<any | null>(null);
  const [folio, setFolio] = useState("");
  const autocompleteRef = useRef<AsyncAutocompleteRef>(null);

  const { confirmationAlert } = useAlerts();
  const getGroups = (params: {
    search: string;
    offset: number;
    limit: number;
  }) => groups.getGroups(params);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = (item: any | null) => {
    setOpenAddModal(false);
    console.log("🔍 Ref actual:", autocompleteRef.current);
    console.log(item);
    autocompleteRef.current?.reload();
    if (item) {
      setValue("group", item.id);
    }
  };

  const createEvent = async (body: any) => {
    try {
      if (!isEdit) {
        const res = await events.createEvent(body);
        console.log(res.data.data);
      } else {
        const res = await events.updateEvent(data.id, body);
        console.log(res.data);
      }
      toast.success(
        `Evento ${isEdit ? "actualizado" : "registrado"} con éxito`
      );
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    const newBody = {
      name: body.name,
      groupId: body.group.id,
      date: body.date,
      folio: body.folio,
      companyDataId: body.isCompany ? companyData.id : null,
    };
    try {
      const res = await user.profile();
      const userInfo = res.data.data;
      if (userInfo.events_remaining === 1) {
        confirmationAlert(
          () => createEvent(newBody),
          "Al crear un nuevo evento se agotara tu cupo de eventos, ¿deseas continuar?"
        );
      } else {
        createEvent(newBody);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    reset();
    handleClose();
  };

  const getCompanyData = async () => {
    try {
      const res = await companies.getCompanies();
      setCompanyData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getFolio = async () => {
    try {
      const res = await events.getFolio();
      setFolio(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open && isEdit && data) {
      getCompanyData();
      reset({
        folio: data.folio,
        date: dayjs(data.date),
        isCompany: data.companyDataId ? true : false,
        name: data.name,
        group: data.group,
      });
    } else if (open && !isEdit) {
      getCompanyData();
      getFolio();
      reset(
        {
          folio: "",
          date: dayjs(),
          isCompany: false,
          name: "",
          group: {},
        },
        { keepDirty: false }
      );
    } else {
      reset(
        {
          date: dayjs(),
          isCompany: false,
          name: "",
          group: {},
        },
        { keepDirty: false }
      );
      setFolio("");
      setCompanyData(null);
    }
  }, [open, isEdit, data, reset]);

  useEffect(() => {
    if (folio) {
      reset({
        folio: folio,
      });
    }
  }, [folio]);

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
            {isEdit ? "Editar evento" : "Registrar evento"}
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, xs: 12 }} sx={{ mt: 2 }}>
                  <TextField
                    key={folio}
                    label="Folio"
                    InputLabelProps={{ shrink: watch("folio") !== "" }}
                    disabled
                    {...register("folio", {
                      required: required("Folio"),
                      validate: noTrimSpaces,
                      maxLength: {
                        value: 20,
                        message: "Máximo 20 caracteres",
                      },
                    })}
                    error={!!errors.folio}
                    helperText={errors.folio?.message || " "}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12 }} sx={{ mt: 2 }}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="es"
                  >
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: required("Fecha") }}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          label="Fecha"
                          value={field.value ?? dayjs()}
                          onChange={field.onChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!fieldState.error,
                              helperText: fieldState.error?.message || " ",
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ md: 12, xs: 12 }}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    InputLabelProps={{ shrink: watch("name") !== "" }}
                    {...register("name", {
                      required: required("Nombre"),
                      validate: noTrimSpaces,
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message || " "}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12 }}>
                  <AsyncAutocomplete
                    ref={autocompleteRef}
                    name="group"
                    label="Grupo"
                    control={control}
                    rules={{
                      required: required("Grupo"),
                    }}
                    errors={errors}
                    fetchFn={getGroups}
                    onAddClick={handleOpenAddModal}
                  />
                </Grid>
                {companyData && (
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Controller
                      name="isCompany"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <BpCheckbox
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label="¿Deseas mostrar los datos de tu empresa en el QR del evento?"
                        />
                      )}
                    />
                  </Grid>
                )}
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
          <GroupForm open={openAddModal} handleClose={handleCloseAddModal} />
        </Box>
      </Fade>
    </Modal>
  );
};
