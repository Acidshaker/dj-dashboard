import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  prefix?: string;
  duration?: number; // en ms
}

export const MetricCard = ({
  title,
  value,
  unit = "",
  prefix = "",
  duration = 1000,
}: MetricCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    const increment = end / (duration / 16); // ~60fps
    let current = start;

    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      setDisplayValue(Math.floor(current));
    }, 16);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <Box
      p={2}
      borderRadius={2}
      boxShadow={3}
      bgcolor="background.paper"
      width={250}
      height={150}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        justifyContent: "space-evenly",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {prefix ? prefix + " " : ""}
        {displayValue.toLocaleString()} {unit}
      </Typography>
    </Box>
  );
};
