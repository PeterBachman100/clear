import { useState} from "react";
import LocationInput from "./components/LocationInput";
import { fetchWeather } from "./utils/fetchWeather";
import { Button } from "@mui/material";
import LocationSearch from "./components/LocationSearch";
import WeatherChart from "./components/WeatherChart";

export default function WeatherDisplay() {
    const [weather, setWeather] = useState(null);

    const [location, setLocation] = useState({
        name: "Snoqualmie Pass",
        admin1: "Washington",
        country: "United States",
        latitude: 47.3923,
        longitude: -121.4001
    });

    const [units, setUnits] = useState({
        temperature: "fahrenheit",
        windSpeed: "mph",
        precipitation: "inch"
    });

    const[chartCount, setChartCount] = useState(1);
    const addChart = () => setChartCount((prev) => prev + 1);

    const handleFetchWeather = async () => {
        try {
            const weatherData = await fetchWeather({ location, units });
            setWeather(weatherData);
            console.log(weatherData);
        } catch(error) {
            console.error("Failed to fetch weather data:", error);
        } 
    }

    return (
        <div className="p-4">
            <LocationSearch onSelect={setLocation} />
            <p>or</p>
            <LocationInput location={location} onChange={setLocation} />
            <Button variant="contained" onClick={handleFetchWeather}>Fetch Weather Data</Button>
            {weather?.hourly ? (
                <div>
                    
                    {Array.from({ length: chartCount }).map((_, i) => (
                        <div key={i}>
                            <WeatherChart weatherData={weather} />
                        </div>
                    ))}
                    <button onClick={addChart}>Add chart</button>
                </div>
            ) : (<p>No data loaded yet.</p>)}
        </div>
    );
}


