// WeatherDisplay.jsx or .tsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherApi } from 'openmeteo';

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const params = {
          latitude: 47.3923,
          longitude: -121.4001,
          hourly: "temperature_2m",
          wind_speed_unit: "mph",
          temperature_unit: "fahrenheit",
          precipitation_unit: "inch",
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();

        const time = [...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        )].map((_, i) =>
          new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        );

        const temperature2m = hourly.variables(0).valuesArray();

        setWeatherData({
          time,
          temperature2m,
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p>Loading weather data...</p>;
  if (!weatherData) return <p>No weather data available.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Hourly Temperatures</h2>
      <ul className="space-y-1">
        {weatherData.time.map((t, i) => (
          <li key={i} className="text-sm">
            {t.toISOString()} — {weatherData.temperature2m[i]}°F
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherDisplay;
