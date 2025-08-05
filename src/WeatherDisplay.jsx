import { useState} from "react";
import LocationInput from "./components/LocationInput";
import { fetchWeather } from "./utils/fetchWeather";
import { Button, Box, Typography } from "@mui/material";
import LocationSearch from "./components/LocationSearch";
import WeatherChart from "./components/WeatherChart";

export default function WeatherDisplay() {
    const [weather, setWeather] = useState(null);
    const handleFetchWeather = async () => {
        try {
            const weatherData = await fetchWeather({ location });
            setWeather(weatherData);
        } catch(error) {
            console.error("Failed to fetch weather data:", error);
        } 
    }

    const [location, setLocation] = useState({
        name: "Snoqualmie Pass",
        admin1: "Washington",
        country: "United States",
        latitude: 47.3923,
        longitude: -121.4001
    });

    const[charts, setCharts] = useState([
        {
            id: 1,
            selectedParameter: "temperature",
        },
        {
            id: 2,
            selectedParameter: "precipitation",
        }
    ]);

    const addChart = () => {
        setCharts((prev) => [...prev, {id: Date.now(), selectedParameter: "temperature"}]);
    };

    const handleParameterChange = (chartIdToUpdate, newParameter) => {
        setCharts(prevCharts =>
            prevCharts.map(chart =>
                chart.id === chartIdToUpdate
                    ? { ...chart, selectedParameter: newParameter }
                    : chart
            )
        );
    };

    return (
        <div className="p-4 border">
            <LocationSearch onSelect={setLocation} />
            <p>or</p>
            <LocationInput location={location} onChange={setLocation} />
            <Button variant="contained" onClick={handleFetchWeather}>Fetch Weather Data</Button>
            {weather?.hourly ? (
                <Box>
                    <Typography>{Number(weather.location.latitude).toFixed(4)}, {Number(weather.location.longitude).toFixed(4)}</Typography>
                    {charts.map((chart) => (
                        <WeatherChart key={chart.id} chartId={chart.id} weatherData={weather} selectedParameter={chart.selectedParameter} onParameterChange={handleParameterChange} />
                    ))}
                </Box>
            ) : (<p>No data loaded yet.</p>)}
            <Button variant="contained" onClick={addChart}>Add Chart</Button>
        </div>
    );
}


