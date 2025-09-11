import { ThemeProvider } from "@mui/material";
import { mainTheme } from "../utils/muiTheme";
import Dashboard from "./Dashboard";
import { Provider } from "react-redux";
import { store } from "../store";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={mainTheme}>
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
