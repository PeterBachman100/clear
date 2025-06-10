import { fetchWeatherApi } from "openmeteo";
import { useState} from "react";

export default function WeatherDisplay() {
    const [weather, setWeather] = useState(null);
    const [lat, setLat] = useState(47.3923);
    const [lon, setLon] = useState(-121.4001)
    const [forecastDays, setForecastDays] = useState(1);
    const [hourlyParams, setHourlyParams] = useState(["temperature_2m"]);
    const [temperatureUnit, setTemperatureUnit] = useState("fahrenheit");
	const [windSpeedUnit, setWindSpeedUnit] = useState("mph");
	const [precipitationUnit, setPrecipitationUnit] = useState("inch")

    const availableParams = [
        { label: "Temperature", value: "temperature_2m" },
        { label: "Apparent Temperature", value: "apparent_temperature" },
        { label: "Humidity", value: "relative_humidity_2m" },
        { label: "Dew Point", value: "dew_point_2m"},
        { label: "Surface", value: "surface_pressure"},
        { label: "cloud_cover", value: "cloud_cover"},
        { label: "cloud_cover_low", value: "cloud_cover_low"},
        { label: "cloud_cover_mid", value: "cloud_cover_mid"},
        { label: "cloud_cover_high", value: "cloud_cover_high"},
        { label: "wind_speed_10m", value: "wind_speed_10m"},
        { label: "wind_gusts_10m", value: "wind_gusts_10m"},
        { label: "wind_direction_10m", value: "wind_direction_10m"},
        { label: "precipitation", value: "precipitation"},
        { label: "Wind snowfall", value: "snowfall" },
        { label: "rain", value: "rain" },
        { label: "showers", value: "showers" },
        { label: "weather_code", value: "weather_code" },
        { label: "snow_depth", value: "snow_depth" },
        { label: "freezing_level_height", value: "freezing_level_height" },
        { label: "visibility", value: "visibility" },
        { label: "is_day", value: "is_day" },
        { label: "uv_index", value: "uv_index"},
    ];

    const availableWindSpeedUnits = [
        { label: "mph", value: "mph" },
        { label: "km/h", value: "kmh" },
        { label: "m/s", value: "ms" },
        { label: "Knots", value: "kn" },
    ];

    const availableTemperatureUnits = [
        { label: "Fahrenheit", value: "fahrenheit" },
        { label: "Celsius", value: "celsius" },
    ];

    const availablePrecipitationUnits = [
        { label: "Inch", value: "inch" },
        { label: "Millimeter", value: "mm" },
    ];

    const handleLatChange = (event) => {
        setLat(event.target.value);
    }
    const handleLonChange = (event) => {
        setLon(event.target.value);
    }

    const handleForecastDaysChange = (event) => {
        setForecastDays(event.target.value);
    }

    const handleHourlyParamsChange = (e) => {
        const { value, checked } = e.target;
        setHourlyParams((prev) => 
            checked ? [...prev, value] : prev.filter((param) => param !== value)
        );
    };

    const fetchWeather = async () => {
        try {
            const params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": hourlyParams,
            "forecast_days": forecastDays,
            "wind_speed_unit": windSpeedUnit,
            "temperature_unit": temperatureUnit,
            "precipitation_unit": precipitationUnit,
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

            const weatherData = {
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
            };

            setWeather(weatherData);

        } catch(error) {
            console.error("Failed to fetch weather data:", error);
        }
    }

    return (
        <div className="p-4">
            <button onClick={fetchWeather} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer">Fetch Weather Data</button>
            <div className="mb-4">
                <h3 className="text-3xl mb-1">Select Location:</h3>
                <label className="font-bold">Lat: </label>
                <input 
                    type="number"
                    value={lat}
                    onChange={handleLatChange}
                />
                <label className="font-bold">Lon: </label>
                <input 
                    type="number"
                    value={lon}
                    onChange={handleLonChange}
                />
            </div>
            <div className="mb-4">
                <h3 className="text-3xl mb-1">Select Forecast Length: {forecastDays} Day(s)</h3>
                <input 
                    type="number"
                    id="forecastDays"
                    min="1"
                    max="16"
                    value={forecastDays}
                    onChange={handleForecastDaysChange}
                />
            </div>
            <div className="mb-4">
                <h3 className="text-3xl mb-1">Select Units</h3>
                <h4 className="text-xl">Temperature</h4>
                <div className="space-y-1">
                    {availableTemperatureUnits.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 text-sm">
                            <input type="radio" value={value} name="temperatureUnit" checked={temperatureUnit === value} onChange={(e) => setTemperatureUnit(e.target.value)} />
                            {label}
                        </label>
                    ))}
                </div>
                <h4 className="text-xl">Wind Speed</h4>
                <div className="space-y-1">
                    {availableWindSpeedUnits.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 text-sm">
                            <input type="radio" name="windSpeedUnit" value={value} checked={windSpeedUnit === value} onChange={(e) => setWindSpeedUnit(e.target.value)} />
                            {label}
                        </label>
                    ))}
                </div>
                <h4 className="text-xl">Precipitation</h4>
                <div className="space-y-1">
                    {availablePrecipitationUnits.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 text-sm">
                            <input type="radio" value={value} checked={precipitationUnit === value} name="precipitationUnit" onChange={(e) => setPrecipitationUnit(e.target.value)} />
                            {label}
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <h3 className="text-3xl mb-1">Select weather parameters</h3>
                <div className="space-y-1">
                    {availableParams.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" value={value} checked={hourlyParams.includes(value)} onChange={handleHourlyParamsChange} />
                            {label}
                        </label>
                    ))}
                </div>
            </div>
            {weather?.hourly ? (
                <div>
                    <h2>{`Latitude: ${weather.location.latitude}, Longitude: ${weather.location.longitude}`}</h2>
                    <table className="table-auto w-full text-sm border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {Object.keys(weather.hourly).map((key) => {
                                    return <th key={key} className="px-2 py-1 border-b">{key}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {weather.hourly.time.map((t, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                {/* <td className="px-2 py-1 border-b text-center">{t.toLocaleString()}</td>
                                <td className="px-2 py-1 border-b text-center">{weather.hourly.temperature2m[i]}°F</td> */}
                                {Object.entries(weather.hourly).map(([key, values]) => (
                                        <td key={key} className="px-2 py-1 border-b text-center">
                                            {key === "time"
                                                ? values[i].toLocaleString()
                                                : values[i]
                                            }
                                        </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (<p>No data loaded yet.</p>)}
        </div>
    );
}


