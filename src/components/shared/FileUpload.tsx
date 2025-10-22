import { Box, Button, IconButton, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState, useEffect } from "react";

interface Props {
  onChange: (file: File | null) => void;
  value?: File | null;
  initialUrl?: string; // 👈 nueva prop
  onDelete: () => void;
}

export const FileUpload = ({
  value,
  onChange,
  onDelete,
  initialUrl,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // limpieza
    } else if (initialUrl) {
      setPreview(initialUrl);
    } else {
      setPreview(null);
    }
  }, [value, initialUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    onDelete();
  };

  return (
    <Box
      sx={{
        border: "1px dashed #ccc",
        borderRadius: 2,
        padding: 2,
        textAlign: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        width: "100%",
        height: "100%",
      }}
    >
      {preview ? (
        <Box sx={{ mb: 2 }}>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: 100, borderRadius: 8 }}
          />
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <ImageIcon sx={{ fontSize: 64, color: "#aaa" }} />
          <Typography variant="body2" color="textSecondary">
            No hay imagen seleccionada
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          {preview ? "Cambiar imagen" : "Cargar imagen"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {preview && (
          <Button 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemove}
          >
            Eliminar imagen
          </Button>
        )}
      </Box>
    </Box>
  );
};
