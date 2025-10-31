import { toast } from "react-toastify";
import microphone from "@/assets/microphone.png";

let socket: WebSocket | null = null;
let currentEventId: string | null = null;
let onEventMusicUpdate: (() => void) | null = null;

export const initGlobalSocket = () => {
  if (socket) return socket;

  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.log("🌐 WebSocket global conectado");
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === "eventMusicUpdate") {
        const { applicant, type, tip, url } = payload.data;

        const getTypeLabel = (type: string) => {
          switch (type) {
            case "song":
              return "canción";
            case "mention":
              return "mención";
            default:
              return type;
          }
        };

        const getTipLabel = (tip: number) => {
          if (tip) return ` - $${tip}`;
          return "Gratuito";
        };

        const message = `🎵 Nueva solicitud de ${getTypeLabel(
          type
        )} de ${applicant}-${getTipLabel(tip)}`;

        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification("🎵 Nueva solicitud musical", {
            body: message,
            icon: microphone,
          });

          if (url) {
            notification.onclick = () => {
              window.open(url, "_blank");
            };
          }
        } else {
          toast.info(message, {
            onClick: () => {
              if (url) window.open(url, "_blank");
            },
          });
        }

        if (payload.data.eventId === currentEventId && onEventMusicUpdate) {
          onEventMusicUpdate();
        }
      }
    } catch (err) {
      console.error("❌ Error en WebSocket global:", err);
    }
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket global desconectado");
    socket = null;
  };

  return socket;
};

export const setEventMusicContext = (
  eventId: string,
  reloadCallback: () => void
) => {
  currentEventId = eventId;
  onEventMusicUpdate = reloadCallback;
};

export const clearEventMusicContext = () => {
  currentEventId = null;
  onEventMusicUpdate = null;
};
