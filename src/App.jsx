import WeatherDisplay from "./WeatherDisplay";
import { AppBar, Button, Toolbar } from "@mui/material";
import { useState } from "react";

function App() {
  const [sections, setSections] = useState(0);
  
  const addSection = () => {
    setSections((prev) => prev + 1);
  }

  return (
    <div>
      <div>
        <AppBar className="sticky" position="static">
          <Toolbar>
            <Button onClick={addSection} variant="contained" className="bg-white">Add Location Section</Button>
          </Toolbar>
        </AppBar>
      </div>
       <div className="flex flex-wrap">
      {Array.from({ length: sections }, (_, i) => (
        <div key={i}>
          <WeatherDisplay />
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;
