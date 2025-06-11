import { fetchWeatherApi } from "openmeteo";

export async function fetchWeather({ location, hourlyParams, forecastLength, units }) {
    const params = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "hourly": hourlyParams,
        "forecast_days": forecastLength,
        "wind_speed_unit": units.windSpeed,
        "temperature_unit": units.temperature,
        "precipitation_unit": units.precipitation,
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();
    const hourly = response.hourly();

    return {
        location: {
            latitude: latitude,
            longitude: longitude
        },
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            ...Object.fromEntries(
                params.hourly.map((name, index) => [name, hourly.variables(index).valuesArray()])
            ),
        },
    }
}