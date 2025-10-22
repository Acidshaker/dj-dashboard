import AppRouter from "./routes/AppRouter";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { toast, ToastContainer } from "react-toastify";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import AppTheme from "./theme/AppTheme";

async function initApp() {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const { worker } = await import("../src/mocks/worker");
    await worker.start();
    toast.info("Estás en un entorno con datos simulados.");
  }

  createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <AppTheme>
        <AppRouter />
      </AppTheme>
      <ToastContainer />
    </Provider>
  );
}

initApp();

