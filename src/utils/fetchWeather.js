import { fetchWeatherApi } from "openmeteo";
import parseWeather from "./parseWeather";

export async function fetchWeather(location) {
    
    const params = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "sunrise", "sunset", "daylight_duration", "rain_sum", "showers_sum", "snowfall_sum", "precipitation_sum", "precipitation_probability_max", "uv_index_max", "precipitation_hours", "sunshine_duration", "temperature_2m_mean", "apparent_temperature_mean", "cloud_cover_mean", "cloud_cover_max", "cloud_cover_min", "dew_point_2m_mean", "dew_point_2m_max", "dew_point_2m_min", "precipitation_probability_mean", "precipitation_probability_min", "relative_humidity_2m_mean", "relative_humidity_2m_max", "relative_humidity_2m_min", "surface_pressure_mean", "surface_pressure_max", "surface_pressure_min", "visibility_mean", "visibility_min", "visibility_max", "wind_speed_10m_min", "wind_speed_10m_mean", "wind_speed_10m_max", "wind_gusts_10m_min", "wind_gusts_10m_mean", "wind_gusts_10m_max", "wind_direction_10m_dominant"],
        "hourly": ["temperature_2m", "precipitation_probability", "precipitation", "cloud_cover", "cloud_cover_low", "visibility", "wind_speed_10m", "wind_gusts_10m", "uv_index"],
        "current": ["temperature_2m", "apparent_temperature", "precipitation", "weather_code", "cloud_cover", "wind_speed_10m", "wind_gusts_10m"],
        "timezone": "auto",
        "forecast_days": 14,
        "wind_speed_unit": "mph",
        "temperature_unit": "fahrenheit",
        "precipitation_unit": "inch",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const weatherData = parseWeather(response);
    const visibilityConvertedWeatherData = {
        ...weatherData,
        hourly: {
            ...weatherData.hourly,
            weatherVariables: {
                ...weatherData.hourly.weatherVariables,
                'visibility': {
                    ...weatherData.hourly.weatherVariables['visibility'],
                    unit: 'miles',
                    values: weatherData.hourly.weatherVariables['visibility'].values.map((value) => {
                        return (value / 5280);
                    })
                }
            }
        }
    }

    return visibilityConvertedWeatherData;
}