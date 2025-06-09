import { fetchWeatherApi } from "openmeteo";
import { useState} from "react";

export default function WeatherDisplay() {
    const [weather, setWeather] = useState(null);
    const [lat, setLat] = useState(47.3923);
    const [lon, setLon] = useState(-121.4001)

    const handleLatChange = (event) => {
        setLat(event.target.value);
    }
    const handleLonChange = (event) => {
        setLon(event.target.value);
    }

    const fetchWeather = async () => {
        try {
            const params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "temperature_2m",
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
                hourly: {
                    time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: hourly.variables(0).valuesArray(),
                },
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
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
            {weather?.hourly ? (
                <div>
                    <h2>{`Latitude: ${weather.location.latitude}, Longitude: ${weather.location.longitude}`}</h2>
                    <table className="table-auto w-full text-sm border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                            <th className="px-2 py-1 border-b">Time</th>
                            <th className="px-2 py-1 border-b">Temperature (°F)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weather.hourly.time.map((t, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="px-2 py-1 border-b text-center">{t.toLocaleString()}</td>
                                <td className="px-2 py-1 border-b text-center">{weather.hourly.temperature2m[i]}°F</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (<p>No data loaded yet.</p>)}
        </div>
    );
}


