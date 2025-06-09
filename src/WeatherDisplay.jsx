import { fetchWeatherApi } from "openmeteo";
import { useState} from "react";

export default function WeatherDisplay() {
    const [weather, setWeather] = useState(null);
    const [lat, setLat] = useState(47.3923);
    const [lon, setLon] = useState(-121.4001)
    const [hourlyParams, setHourlyParams] = useState(["temperature_2m", "apparent_temperature"]);

    const availableParams = [
        { label: "Temperature", value: "temperature_2m" },
        { label: "Apparent Temperature", value: "apparent_temperature" },
        { label: "Humidity", value: "relative_humidity_2m" },
        { label: "Wind Speed", value: "wind_speed_10m" },
        { label: "Precipitation", value: "precipitation" },
    ];

    const handleLatChange = (event) => {
        setLat(event.target.value);
    }
    const handleLonChange = (event) => {
        setLon(event.target.value);
    }

    const handleCheckboxChange = (e) => {
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
            "wind_speed_unit": "mph",
            "temperature_unit": "fahrenheit",
            "precipitation_unit": "inch"
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
            <label>Lat: </label>
            <input 
                type="number"
                value={lat}
                onChange={handleLatChange}
            />
            <label>Lon: </label>
            <input 
                type="number"
                value={lon}
                onChange={handleLonChange}
            />
            <div className="mb-4">
                <h3 className="font-medium mb-1 text-sm">Select weather parameters</h3>
                <div className="space-y-1">
                    {availableParams.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" value={value} checked={hourlyParams.includes(value)} onChange={handleCheckboxChange} />
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


