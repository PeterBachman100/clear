import formatWeather from "./formatWeather";
import { currentParameters ,hourlyParameters, dailyParameters } from "./parameters";

export async function fetchWeather(location) {
    
    const params = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "daily": dailyParameters,
        "hourly": hourlyParameters,
        "current": currentParameters,
        "timezone": "auto",
        "forecast_days": 14,
        "wind_speed_unit": "mph",
        "temperature_unit": "fahrenheit",
        "precipitation_unit": "inch",
    };

    
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const weatherData = await response.json();
        const formattedWeatherData = formatWeather(weatherData);
        return formattedWeatherData;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}