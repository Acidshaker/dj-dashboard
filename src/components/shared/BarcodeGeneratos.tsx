import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useRef } from "react";
import bwipjs from "bwip-js";
import jsPDF from "jspdf";

export const BarcodeGenerator = () => {
  const [code, setCode] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBarcode = () => {
    try {
      bwipjs.toCanvas(canvasRef.current!, {
        bcid: "ean13",
        text: code,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
    } catch (e) {
      alert("Código inválido o error al generar el código de barras");
    }
  };

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 15, 40, 180, 40);
    pdf.save("barcode.pdf");
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Código EAN
      </Typography>
      <TextField
        fullWidth
        placeholder="Escribe el código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={generateBarcode} sx={{ mr: 1 }}>
        Generar código
      </Button>
      <Button variant="outlined" onClick={downloadPDF}>
        Descargar PDF
      </Button>
      <canvas ref={canvasRef} style={{ marginTop: 16 }} />
    </Box>
  );
};
