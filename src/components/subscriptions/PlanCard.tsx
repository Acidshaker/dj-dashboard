import { Box, Button, Typography, Paper, Stack, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FC } from "react";
import { Plan } from "@/types/Plan";

interface PlanCardProps {
  plan: Plan;
  onSelect?: (plan: Plan) => void;
}

export const PlanCard: FC<PlanCardProps> = ({ plan, onSelect }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 4,
        textAlign: "center",
        maxWidth: 300,
        height: "100%",
        margin: "auto",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      {/* Nombre del plan */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {plan.name}
      </Typography>

      {/* Precio */}
      {!plan.price || plan.price == 0 ? (
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Gratis
        </Typography>
      ) : (
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ${plan.price.toFixed(2)}
        </Typography>
      )}

      <Divider />

      {/* Beneficios */}
      <Stack spacing={1} flexGrow={1} sx={{ mt: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
          {plan.days && plan.events < 1 ? (
            <Typography variant="body1" color="text.secondary">
              {plan.days} día{plan.days > 1 && "s"}
            </Typography>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Sin fecha de caducidad
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
          {plan.events < 1 && plan.days ? (
            <Typography variant="body1" color="text.secondary">
              Eventos ilimitados
            </Typography>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {plan.events} evento{plan.events > 1 && "s"}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Botón */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => onSelect?.(plan)}
      >
        Elegir plan
      </Button>
    </Paper>
  );
};
