import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(
  // http.get("/api/users", () =>
  //   HttpResponse.json({ message: "Mock funcionando 🚀" })
  // )
  ...handlers
);
