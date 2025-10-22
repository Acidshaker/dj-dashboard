import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { required, noTrimSpaces } from "../../utils/validations";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { groups, packages } from "@/services/endpoints";
import AsyncAutocomplete, {
  AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import { PackageForm } from "./PackageForm";
import AsyncMultiAutocomplete from "../shared/AsyncMultiAutocomplete";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

export const GroupForm = ({
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
  const [openAddModal, setOpenAddModal] = useState(false);
  const autocompleteRef = useRef<AsyncAutocompleteRef>(null);

  const getPackages = (params: {
    search: string;
    offset: number;
    limit: number;
  }) => packages.getPackages(params);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    autocompleteRef.current?.reload();
  };

  const methods = useForm<{
    name: string;
    packages: string[] | null;
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
    console.log(body);
    const newBody = {
      name: body.name,
      packageIds: body.packages.map((p: any) => p.id),
    };
    console.log(newBody);
    try {
      if (!isEdit) {
        const res = await groups.createGroup(newBody);
        console.log(res.data.data);
      } else {
        const res = await groups.updateGroup(data.id, newBody);
        console.log(res.data);
      }
      toast.success(`Grupo ${isEdit ? "actualizado" : "registrado"} con éxito`);
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
        packages: data.eventPackages,
      });
    } else if (open && !isEdit) {
      reset({ name: "", packages: null }, { keepDirty: false });
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
            {isEdit ? "Editar grupo" : "Registrar grupo"}
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
                <Grid size={{ md: 12, xs: 12 }}>
                  <Stack spacing={1}>
                    <AsyncMultiAutocomplete
                      ref={autocompleteRef}
                      name="packages"
                      label="Paquetes"
                      {...register("packages", {
                        required: required("Al menos un paquete"),
                      })}
                      control={control}
                      errors={errors}
                      fetchFn={getPackages}
                      onAddClick={() => handleOpenAddModal()}
                      maxSelections={5}
                      disableSelected={true}
                      renderChipLabel={(pkg) =>
                        `${pkg.name} - $${pkg.tip.toFixed(2)}`
                      }
                      valueModel={(pkg) => pkg}
                    />
                  </Stack>
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
          <PackageForm open={openAddModal} handleClose={handleCloseAddModal} />
        </Box>
      </Fade>
    </Modal>
  );
};
