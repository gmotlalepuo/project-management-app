import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Get the user's time zone
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Set the default headers for Axios
window.axios.defaults.headers.common["User-Timezone"] = timezone;
