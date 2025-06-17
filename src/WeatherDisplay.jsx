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
            <Button variant="contained" onClick={handleFetchWeather}>Fetch Weather Data</Button>
            <LocationInput location={location} onChange={setLocation} />
            <LocationSearch onSelect={setLocation} />
            {weather?.hourly ? (
                <div>
                    {weather.current.time.toString()}
                    <h2>{`Latitude: ${weather.location.latitude}, Longitude: ${weather.location.longitude}`}</h2>
                    <WeatherChart weatherData={weather} />
                </div>
            ) : (<p>No data loaded yet.</p>)}
        </div>
    );
}


