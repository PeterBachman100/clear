import { fetchWeatherApi } from "openmeteo";

export async function fetchWeather({ location, units }) {
    const params = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "sunrise", "sunset", "daylight_duration", "rain_sum", "showers_sum", "snowfall_sum", "precipitation_sum", "precipitation_probability_max", "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant", "uv_index_max", "precipitation_hours", "sunshine_duration", "temperature_2m_mean", "apparent_temperature_mean", "cloud_cover_mean", "cloud_cover_max", "cloud_cover_min", "dew_point_2m_mean", "dew_point_2m_max", "dew_point_2m_min", "precipitation_probability_mean", "precipitation_probability_min", "relative_humidity_2m_mean", "relative_humidity_2m_max", "relative_humidity_2m_min", "surface_pressure_mean", "surface_pressure_max", "surface_pressure_min", "visibility_mean", "visibility_min", "visibility_max", "winddirection_10m_dominant", "wind_gusts_10m_mean", "wind_speed_10m_mean", "wind_gusts_10m_min", "wind_speed_10m_min"],
        "hourly": ["temperature_2m", "relative_humidity_2m", "dew_point_2m", "apparent_temperature", "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "snow_depth", "weather_code", "surface_pressure", "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high", "visibility", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "uv_index", "is_day", "freezing_level_height"],
        "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloud_cover", "surface_pressure", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "is_day"],
        "timezone": "auto",
        "forecast_days": 1,
        "wind_speed_unit": units.windSpeed,
        "temperature_unit": units.temperature,
        "precipitation_unit": units.precipitation,
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const timezone = response.timezone();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current();
    const daily = response.daily();
    const hourly = response.hourly();

    const sunrise = daily.variables(5);
    const sunset = daily.variables(6);

    const weatherData = {
        timezone: timezone,
        location: {
            latitude: latitude,
            longitude: longitude
        },
        current: {
            time: Number(current.time()) * 1000,
            temperature2m: current.variables(0).value(),
            relativeHumidity2m: current.variables(1).value(),
            apparentTemperature: current.variables(2).value(),
            precipitation: current.variables(3).value(),
            rain: current.variables(4).value(),
            showers: current.variables(5).value(),
            snowfall: current.variables(6).value(),
            weatherCode: current.variables(7).value(),
            cloudCover: current.variables(8).value(),
            surfacePressure: current.variables(9).value(),
            windSpeed10m: current.variables(10).value(),
            windDirection10m: current.variables(11).value(),
            windGusts10m: current.variables(12).value(),
            isDay: current.variables(13).value(),
        },
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => ((Number(hourly.time()) + i * hourly.interval()) * 1000)
            ),
            temperature2m: hourly.variables(0).valuesArray(),
            relativeHumidity2m: hourly.variables(1).valuesArray(),
            dewPoint2m: hourly.variables(2).valuesArray(),
            apparentTemperature: hourly.variables(3).valuesArray(),
            precipitationProbability: hourly.variables(4).valuesArray(),
            precipitation: hourly.variables(5).valuesArray(),
            rain: hourly.variables(6).valuesArray(),
            showers: hourly.variables(7).valuesArray(),
            snowfall: hourly.variables(8).valuesArray(),
            snowDepth: hourly.variables(9).valuesArray(),
            weatherCode: hourly.variables(10).valuesArray(),
            surfacePressure: hourly.variables(11).valuesArray(),
            cloudCover: hourly.variables(12).valuesArray(),
            cloudCoverLow: hourly.variables(13).valuesArray(),
            cloudCoverMid: hourly.variables(14).valuesArray(),
            cloudCoverHigh: hourly.variables(15).valuesArray(),
            visibility: hourly.variables(16).valuesArray(),
            windSpeed10m: hourly.variables(17).valuesArray(),
            windDirection10m: hourly.variables(18).valuesArray(),
            windGusts10m: hourly.variables(19).valuesArray(),
            uvIndex: hourly.variables(20).valuesArray(),
            isDay: hourly.variables(21).valuesArray(),
            freezingLevelHeight: hourly.variables(22).valuesArray(),
        },
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => (Number(daily.time()) + i * daily.interval()) * 1000
            ),
            weatherCode: daily.variables(0).valuesArray(),
            temperature2mMax: daily.variables(1).valuesArray(),
            temperature2mMin: daily.variables(2).valuesArray(),
            apparentTemperatureMax: daily.variables(3).valuesArray(),
            apparentTemperatureMin: daily.variables(4).valuesArray(),
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => (Number(sunrise.valuesInt64(i))) * 1000
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => (Number(sunset.valuesInt64(i))) * 1000
            ),
            daylightDuration: daily.variables(7).valuesArray(),
            rainSum: daily.variables(8).valuesArray(),
            showersSum: daily.variables(9).valuesArray(),
            snowfallSum: daily.variables(10).valuesArray(),
            precipitationSum: daily.variables(11).valuesArray(),
            precipitationProbabilityMax: daily.variables(12).valuesArray(),
            windSpeed10mMax: daily.variables(13).valuesArray(),
            windGusts10mMax: daily.variables(14).valuesArray(),
            windDirection10mDominant: daily.variables(15).valuesArray(),
            uvIndexMax: daily.variables(16).valuesArray(),
            precipitationHours: daily.variables(17).valuesArray(),
            sunshineDuration: daily.variables(18).valuesArray(),
            temperature2mMean: daily.variables(19).valuesArray(),
            apparentTemperatureMean: daily.variables(20).valuesArray(),
            cloudCoverMean: daily.variables(21).valuesArray(),
            cloudCoverMax: daily.variables(22).valuesArray(),
            cloudCoverMin: daily.variables(23).valuesArray(),
            dewPoint2mMean: daily.variables(24).valuesArray(),
            dewPoint2mMax: daily.variables(25).valuesArray(),
            dewPoint2mMin: daily.variables(26).valuesArray(),
            precipitationProbabilityMean: daily.variables(27).valuesArray(),
            precipitationProbabilityMin: daily.variables(28).valuesArray(),
            relativeHumidity2mMean: daily.variables(29).valuesArray(),
            relativeHumidity2mMax: daily.variables(30).valuesArray(),
            relativeHumidity2mMin: daily.variables(31).valuesArray(),
            surfacePressureMean: daily.variables(32).valuesArray(),
            surfacePressureMax: daily.variables(33).valuesArray(),
            surfacePressureMin: daily.variables(34).valuesArray(),
            visibilityMean: daily.variables(35).valuesArray(),
            visibilityMin: daily.variables(36).valuesArray(),
            visibilityMax: daily.variables(37).valuesArray(),
            winddirection10mDominant: daily.variables(38).valuesArray(),
            windGusts10mMean: daily.variables(39).valuesArray(),
            windSpeed10mMean: daily.variables(40).valuesArray(),
            windGusts10mMin: daily.variables(41).valuesArray(),
            windSpeed10mMin: daily.variables(42).valuesArray(),
        },
    };

    return weatherData;
}