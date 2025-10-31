import { companies } from "@/services/endpoints";
import { hideLoading, showLoading } from "@/store/uiSlice";
import {
  maxLength,
  noTrimSpaces,
  required,
  isEmail,
} from "@/utils/validations";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export const Company = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<{
    name: string;
    phone: string;
    email: string;
    logo: string;
  }>({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const [company, setCompany] = useState<any | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageRemove = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };

  const getCompany = async () => {
    dispatch(showLoading());
    try {
      const res = await companies.getCompanies();
      setCompany(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const onSubmit = async (data: any) => {
    const body = new FormData();
    body.append("company_name", data.name);
    body.append("company_phone", data.phone);
    body.append("company_email", data.email);

    // Si hay archivo, lo subimos
    if (logoFile) {
      body.append("logo", logoFile);
      body.append("replace_logo", "true");
    }

    // Si no hay preview pero sí había logo antes, lo eliminamos
    if (!logoPreview && company?.logo) {
      body.append("logo", "");
      body.append("replace_logo", "true");
    }

    try {
      dispatch(showLoading());
      const res = company
        ? await companies.updateCompany(company.id, body)
        : await companies.createCompany(body);
      toast.success("Empresa guardada con éxito");
      getCompany(); // refrescar datos
    } catch (error) {
      console.log(error);
      // toast.error("Error al guardar empresa");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  useEffect(() => {
    if (company) {
      reset({
        name: company.company_name,
        phone: company.company_phone,
        email: company.company_email,
        logo: company.logo || null,
      });
      setLogoPreview(company.logo || null);
    }
  }, [company, reset]);

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
        Mi empresa
      </Typography>

      <Container sx={{ width: "100%", mt: 2, flexGrow: 1 }}>
        <Fade in={true} timeout={1000}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <Grid container spacing={2}>
              <Grid
                size={{ md: 12, xs: 12 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Avatar
                  src={logoPreview || undefined}
                  sx={{ width: 100, height: 100, mb: 1 }}
                >
                  {!logoPreview && <BusinessIcon sx={{ fontSize: 50 }} />}
                </Avatar>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip
                    title={logoPreview ? "Editar imagen" : "Agregar imagen"}
                  >
                    <IconButton color="info" onClick={handleImageUploadClick}>
                      {logoPreview ? <EditIcon /> : <AddIcon />}
                    </IconButton>
                  </Tooltip>

                  {logoPreview && (
                    <Tooltip title="Eliminar imagen">
                      <IconButton color="error" onClick={handleImageRemove}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Grid>

              <Grid size={{ md: 12, xs: 12 }}>
                <TextField
                  label="Nombre de la empresa"
                  fullWidth
                  InputLabelProps={{ shrink: watch("name") !== "" }}
                  {...register("name", {
                    required: required("Nombre de la empresa"),
                    validate: {
                      maxLength: maxLength(50),
                      noTrimSpaces: noTrimSpaces,
                    },
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message || " "}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Teléfono"
                  fullWidth
                  InputLabelProps={{ shrink: watch("phone") !== "" }}
                  {...register("phone", {
                    required: required("Teléfono"),
                    validate: {
                      maxLength: maxLength(10),
                      noTrimSpaces: noTrimSpaces,
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message || " "}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Correo electrónico"
                  fullWidth
                  InputLabelProps={{ shrink: watch("email") !== "" }}
                  {...register("email", {
                    required: required("Correo electrónico"),
                    validate: {
                      isEmail: isEmail,
                      noTrimSpaces: noTrimSpaces,
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message || " "}
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
                  {company ? "Guardar cambios" : "Registrar empresa"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Fade>
      </Container>
    </Box>
  );
};
