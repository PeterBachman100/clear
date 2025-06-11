import { useState} from "react";
import { availableUnits } from "./assets/availableUnits";
import { availableParams } from "./assets/availableParams";
import LocationInput from "./components/LocationInput";
import ForecastLengthInput from "./components/ForecastLengthInput";
import UnitSelection from "./components/UnitSelection";
import WeatherParameterSelector from "./components/WeatherParameterSelector";
import WeatherTable from "./components/WeatherTable";
import { fetchWeather } from "./utils/fetchWeather";

export default function WeatherDisplay() {
    const [weather, setWeather] = useState(null);

    const [location, setLocation] = useState({
        latitude: 47.3923,
        longitude: -121.4001
    });
    const [forecastLength, setForecastLength] = useState(1);
    const [hourlyParams, setHourlyParams] = useState(["temperature_2m"]);
    const [units, setUnits] = useState({
        temperature: "fahrenheit",
        windSpeed: "mph",
        precipitation: "inch"
    });

    const handleForecastLengthChange = (event) => {
        setForecastLength(event.target.value);
    }
    const handleHourlyParamsChange = (e) => {
        const { value, checked } = e.target;
        setHourlyParams((prev) => 
            checked ? [...prev, value] : prev.filter((param) => param !== value)
        );
    };

    const handleFetchWeather = async () => {
        try {
            const weatherData = await fetchWeather({
                location,
                hourlyParams,
                forecastLength,
                units
            });
            setWeather(weatherData);
        } catch(error) {
            console.error("Failed to fetch weather data:", error);
        }
    }

    return (
        <div className="p-4">
            <button onClick={handleFetchWeather} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer">Fetch Weather Data</button>
            <LocationInput location={location} onChange={setLocation} />
            <ForecastLengthInput forecastLength={forecastLength} onChange={handleForecastLengthChange} />
            <UnitSelection  availableUnits={availableUnits} units={units} onChange={setUnits}/>
            <WeatherParameterSelector availableParams={availableParams} hourlyParams={hourlyParams} onChange={handleHourlyParamsChange} />
            {weather?.hourly ? (
                <div>
                    <h2>{`Latitude: ${weather.location.latitude}, Longitude: ${weather.location.longitude}`}</h2>
                    <WeatherTable weather={weather} />
                </div>
            ) : (<p>No data loaded yet.</p>)}
        </div>
    );
}


