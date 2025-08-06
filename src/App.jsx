import LocationSection from "./components/LocationSection";
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
       <Box sx={{ p: 4 }} className="flex flex-col gap-16">
        {Array.from({ length: sections }, (_, i) => (
          <div key={i}>
            <LocationSection />          
          </div>
        ))}
      </Box>
    </ThemeProvider>
  );
}

export default App;
