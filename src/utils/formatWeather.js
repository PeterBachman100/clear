function formatSection(data, units) {
    const visibilityKeys = new Set(['visibility', 'visibility_mean', 'visibility_min', 'visibility_max']);

    return Object.entries(data).reduce((acc, [key, value]) => {
        if (key !== 'time' && key !== 'interval') {
            const weatherVariable = {
                unit: units[key] || 'dimensionless',
                data: value,
            };

            if (visibilityKeys.has(key)) {
                if (Array.isArray(weatherVariable.data)) {
                    weatherVariable.data = weatherVariable.data.map(feet => feet / 5280);
                } else {
                    weatherVariable.data = weatherVariable.data / 5280;
                }
                weatherVariable.unit = 'miles';
            }

            acc[key] = weatherVariable;
        }
        return acc;
    }, {});
}

export default function formatWeather(weatherData) {

    const currentWeather = formatSection(weatherData.current, weatherData.current_units);
    const dailyWeather = formatSection(weatherData.daily, weatherData.daily_units);
    const hourlyWeather = formatSection(weatherData.hourly, weatherData.hourly_units);

    const formattedWeatherData = {
        location: {
            latitude: weatherData.latitude,
            longitude: weatherData.longitude,
            timezone: weatherData.timezone,
            utc_offset_seconds: weatherData.utc_offset_seconds,
        },
        current: {
            time: weatherData.current.time,
            weatherVariables: currentWeather,
        },
        daily: {
            time: weatherData.daily.time,
            weatherVariables: dailyWeather,
        },
        hourly: {
            time: weatherData.hourly.time,
            weatherVariables: hourlyWeather,
        }
    };

    return formattedWeatherData;
}