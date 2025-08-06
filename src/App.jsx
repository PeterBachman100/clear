import WeatherDisplay from "./WeatherDisplay";
import { Box, AppBar, Button, Toolbar, ThemeProvider, Card } from "@mui/material";
import { useState } from "react";
import { mainTheme } from "./utils/muiTheme";

function App() {
  const [sections, setSections] = useState(0);
  
  const addSection = () => {
    setSections((prev) => prev + 1);
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <AppBar className="sticky" position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Button onClick={addSection} variant="contained" color="secondary">Add Location Section</Button>
        </Toolbar>
      </AppBar>
       <Box sx={{ p: 4 }} className="flex flex-col">
        {Array.from({ length: sections }, (_, i) => (
          <div key={i}>
            <WeatherDisplay />          
          </div>
        ))}
      </Box>
    </ThemeProvider>
  );
}

export default App;
