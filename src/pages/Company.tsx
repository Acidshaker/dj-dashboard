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
  Chip,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { G } from "msw/lib/core/HttpResponse-CKZrrwKE";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { UserInfo } from "@/types/UserInfo";

export const Company = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    getCompany();
  }, []);

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        phone: company.phone,
        email: company.email,
        logo: company.logo ? company.logo : null,
      });
    }
  }, [company]);

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
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            {/* <Container sx={{ flexGrow: 1 }}> */}
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
                  src={logoPreview || company?.logo || undefined}
                  sx={{ width: 100, height: 100, mb: 1 }}
                >
                  {!logoPreview && !company?.logo && (
                    <BusinessIcon sx={{ fontSize: 50 }} />
                  )}
                </Avatar>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip
                    title={
                      logoPreview || company?.logo
                        ? "Editar imagen"
                        : "Agregar imagen"
                    }
                  >
                    <IconButton color="info" onClick={handleImageUploadClick}>
                      {logoPreview || company?.logo ? (
                        <EditIcon />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </Tooltip>

                  {(logoPreview || company?.logo) && (
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
                  key={company?.name}
                  label="Nombre de la empresa"
                  fullWidth
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
                  key={company?.phone}
                  label="Teléfono"
                  fullWidth
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
                  key={company?.email}
                  label="Correo electrónico"
                  fullWidth
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
