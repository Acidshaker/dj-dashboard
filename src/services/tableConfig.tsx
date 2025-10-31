import { Avatar, Box, Chip, Typography } from "@mui/material";
import { eventMusic, events, groups, packages } from "./endpoints";
import microphone from "@/assets/microphone.png";
import cashImage from "@/assets/cash-method.png";
import stripeImage from "@/assets/stripe-method.png";
import { useDispatch } from "react-redux";
import { useAlerts } from "@/utils/alerts";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { toast } from "react-toastify";
// import {
//   units,
//   users,
//   clients,
//   suppliers,
//   supplies,
//   sales,
//   purchases,
// } from "./endpoints";

export interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableConfigItem {
  getData: (params: Record<string, any>) => Promise<any>;
  headers: TableHeader[];
  deleteFunction?: (id: string) => Promise<any>;
  reactiveFunction?: (id: string) => Promise<any>;
}

const formattedDate = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const chipColor = (value: string) => {
  switch (value) {
    case "active":
      return "success";
    case "not_started":
      return "info";
    default:
      return "error";
  }
};

const eventLabel = (value: string) => {
  switch (value) {
    case "active":
      return "En curso";
    case "not_started":
      return "No iniciado";
    default:
      return "Finalizado";
  }
};

const typeLabel = (value: string) => {
  switch (value) {
    case "song":
      return "Canción 🎵";
    case "mention":
      return "Mención 🎙️";
    default:
      return "Cualquiera 🔷";
  }
};

export const tableConfig: Record<string, TableConfigItem> = {
  packages: {
    getData: (params) => packages.getPackages(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "type",
        label: "Tipo",
        align: "center",
        sortable: true,
        render: (value) => typeLabel(value),
      },
      {
        key: "tip",
        label: "Precio",
        align: "center",
        sortable: true,
        render: (value) =>
          `${
            value > 0
              ? "$" + value.toFixed(2) + " MXN"
              : value == 0
              ? "Gratuito"
              : "Voluntaria"
          }`,
      },
    ],
    deleteFunction: (id) => packages.desactivePackage(id),
    reactiveFunction: (id) => packages.reactivePackage(id),
  },
  groups: {
    getData: (params) => groups.getGroups(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => groups.desactiveGroup(id),
    reactiveFunction: (id) => groups.reactiveGroup(id),
  },
  events: {
    getData: (params) => events.getEvents(params),
    headers: [
      {
        key: "date",
        label: "Fecha",
        align: "center",
        sortable: true,
        render: (value) => formattedDate(value),
      },
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "status",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip label={eventLabel(value)} color={chipColor(value)} />
        ),
      },
    ],
    reactiveFunction: (id) => events.reactiveEvent(id),
  },
  musicRequests: {
    getData: (params: Record<string, any>) => events.getRequests(params),
    headers: [
      {
        key: "application_number",
        label: "N° de solicitud",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "evento", // puede ser cualquier clave, no tiene que coincidir con "music"
        label: "Solicitud",
        align: "center",
        sortable: false,
        render: (_value, row) => {
          const isSong = row?.type === "song";
          const music = row?.music;
          const mention = row?.mention;

          return (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                alt={isSong ? "album_logo" : "mention_logo"}
                src={isSong ? music?.album_logo : microphone}
                sx={{ width: 50, height: 50, alignSelf: "center" }}
              />
              {isSong && music ? (
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ justifySelf: "flex-start" }}
                  >
                    {music.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {music.author} • {music.duration}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    component="a"
                    href={music.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none" }}
                  >
                    Escuchar en Spotify
                  </Typography>
                </Box>
              ) : mention ? (
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="caption" color="primary">
                    Descripción
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mention.text}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin datos
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        key: "applicant",
        label: "Solicitante",
        align: "center",
        sortable: true,
        render: (value) => (
          <Typography variant="body2" color="text.secondary">
            {value || "Cliente anónimo"}
          </Typography>
        ),
      },
      {
        key: "payment_method",
        label: "Método de pago",
        align: "center",
        sortable: true,
        render: (value) => {
          if (value === "cash") {
            return (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  alt="cash-icon"
                  src={cashImage}
                  sx={{ width: 30, height: 30 }}
                />
              </Box>
            );
          } else {
            return (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  alt="stripe-icon"
                  src={stripeImage}
                  sx={{ width: 50, height: 30 }}
                />
              </Box>
            );
          }
        },
      },
      {
        key: "is_paid",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip
            label={value ? "Pagado" : "No pagado"}
            color={value ? "success" : "warning"}
          />
        ),
      },
      {
        key: "tip",
        label: "Propina",
        align: "center",
        sortable: true,
        render: (value) =>
          `${value == 0 ? "Gratis" : "$" + value.toFixed(2) + " MXN"}`,
      },
    ],
  },
  historyLine: {
    getData: (params: Record<string, any>) => events.getRequests(params),
    headers: [
      {
        key: "application_number",
        label: "N° de solicitud",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "evento", // puede ser cualquier clave, no tiene que coincidir con "music"
        label: "Solicitud",
        align: "center",
        sortable: false,
        render: (_value, row) => {
          const isSong = row?.type === "song";
          const music = row?.music;
          const mention = row?.mention;

          return (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                alt={isSong ? "album_logo" : "mention_logo"}
                src={isSong ? music?.album_logo : microphone}
                sx={{ width: 50, height: 50, alignSelf: "center" }}
              />
              {isSong && music ? (
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ justifySelf: "flex-start" }}
                  >
                    {music.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"start"}
                  >
                    {music.author} • {music.duration}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    component="a"
                    href={music.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none" }}
                  >
                    Escuchar en Spotify
                  </Typography>
                </Box>
              ) : mention ? (
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="caption" color="primary">
                    Descripción
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mention.text}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin datos
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        key: "applicant",
        label: "Solicitante",
        align: "center",
        sortable: true,
        render: (value) => (
          <Typography variant="body2" color="text.secondary">
            {value || "Cliente anónimo"}
          </Typography>
        ),
      },
      {
        key: "payment_method",
        label: "Método de pago",
        align: "center",
        sortable: true,
        render: (value) => {
          if (value === "cash") {
            return (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  alt="cash-icon"
                  src={cashImage}
                  sx={{ width: 30, height: 30 }}
                />
              </Box>
            );
          } else {
            return (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  alt="stripe-icon"
                  src={stripeImage}
                  sx={{ width: 50, height: 30 }}
                />
              </Box>
            );
          }
        },
      },
      {
        key: "is_paid",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip
            label={value ? "Pagado" : "No pagado"}
            color={value ? "success" : "warning"}
          />
        ),
      },
      {
        key: "tip",
        label: "Propina",
        align: "center",
        sortable: true,
        render: (value) =>
          `${value == 0 ? "Gratis" : "$" + value.toFixed(2) + " MXN"}`,
      },
      {
        key: "is_played",
        label: "Reproducción",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip
            label={value ? "exitosa" : "sin reproducir"}
            color={value ? "success" : "error"}
          />
        ),
      },
    ],
  },
};
