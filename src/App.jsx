import WeatherDisplay from "./WeatherDisplay";
import { Button } from "@mui/material";
import { useState } from "react";

function App() {
  const [sections, setSections] = useState(0);
  
  const addSection = () => {
    setSections((prev) => prev + 1);
  }

  return (
    <div>
      <div className="border">
        <Button onClick={addSection} variant="contained">Add Location Section</Button>
      </div>
       <div className="flex flex-wrap">
      {Array.from({ length: sections }, (_, i) => (
        <div key={i} className="w-1/2">
          <WeatherDisplay />
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;
