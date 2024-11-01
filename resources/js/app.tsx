import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./Layouts/ThemeProvider";
import { Toaster } from "./Components/ui/toaster";
import axios from "axios";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// Get the user's time zone
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Set the default headers for Axios
axios.defaults.headers.common["User-Timezone"] = timezone;

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ThemeProvider storageKey="vite-ui-theme">
        <App {...props} />
        <Toaster />
      </ThemeProvider>,
    );
  },
  progress: {
    color: "#7c3aed",
  },
});
