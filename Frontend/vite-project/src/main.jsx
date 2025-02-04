import ReactDOM from "react-dom";
import { GlobalProvider } from "./Context/GlobalCOntext"
import "./Landing.css";
import LuxeEstate from "./Landing";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GlobalProvider>
<LuxeEstate/>
  </GlobalProvider>
);
