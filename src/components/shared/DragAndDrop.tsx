import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface Props {
  name: string;
  label?: string;
  maxSizeMB?: number;
}

export const DragAndDrop = ({
  name,
  label = "Picture",
  maxSizeMB = 10,
}: Props) => {
  const { control, setValue } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`El archivo supera el límite de ${maxSizeMB}MB`);
      return;
    }
    setValue(name, file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setValue(name, "");
    setPreview(null);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Imagen cargada */}
            <Grid size={{ md: 6, xs: 12 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#aaa" }} />
                )}
              </Box>
            </Grid>

            {/* Área de carga / botones */}
            <Grid size={{ md: 6, xs: 12 }}>
              {preview ? (
                <Stack spacing={1}>
                  <label htmlFor={`upload-${name}`}>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      component="span"
                      fullWidth
                    >
                      Cambiar imagen
                    </Button>
                  </label>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemove}
                    fullWidth
                  >
                    Eliminar imagen
                  </Button>
                </Stack>
              ) : (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Drag and drop upload
                    <br />
                    or{" "}
                    <span style={{ color: "#1976d2", fontWeight: 500 }}>
                      browse
                    </span>{" "}
                    to choose a file
                    <br />
                    (up to {maxSizeMB}MB)
                  </Typography>
                  <label htmlFor={`upload-${name}`}>
                    <Button variant="outlined" component="span">
                      Elegir archivo
                    </Button>
                  </label>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                id={`upload-${name}`}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    />
  );
};
