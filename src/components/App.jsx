import { ThemeProvider } from "@mui/material";
import { mainTheme } from "../utils/muiTheme";
import Dashboard from "./Dashboard";

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
