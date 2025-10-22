import { Modal, Box, Typography, Button, Fade, Backdrop } from "@mui/material";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { useRef } from "react";
import { useTheme } from "@mui/material/styles";

interface Props {
  open: boolean;
  handleClose: () => void;
  url: string;
  name: string;
  companyDatId?: string;
}

export const QrModal = ({
  open,
  handleClose,
  url,
  name,
  companyDatId,
}: Props) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
    width: 320,
  };

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current);
      const link = document.createElement("a");
      link.download = "qr-event.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al generar imagen:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div
            ref={qrRef}
            style={{
              backgroundColor: isDark ? "#212529" : "#ffffff",
              color: isDark ? "#f8f9fa" : "#344767",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {name}
            </Typography>
            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2 }}>
              <QRCode value={url} size={160} />
            </Box>
          </div>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleDownload}
          >
            Descargar QR
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};
