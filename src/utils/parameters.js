export function getPrettyParameterName(parameter) {
    const mappings = {
        'precipitation': 'Precipitation Amount',
        'uv_index': 'UV Index',
        'cloud_cover': 'Cloud Cover',
        'precipitation_probability': 'Chance of Precipitation',
        'temperature_2m': 'Temperature',
        'wind_speed_10m': 'Wind Speed',
        'wind_gusts_10m': 'Wind Gusts',
        'visibility': 'Visibility',
        'temperature_2m_max': 'Temperature: Maximum',
        'temperature_2m_min': 'Temperature: Minimum',
        'temperature_2m_mean': 'Temperature: Average',
        'sunrise': 'Sunrise',
        'sunset': 'Sunset',
        'rain_sum': 'Rain Total',
        'snowfall_sum': 'Snow Total',
        'precipitation_sum': 'Precipitation Total',
        'precipitation_probability_max': 'Precipitation Probability: Maximum',
        'precipitation_probability_mean': 'Precipitation Probability: Average',
        'precipitation_probability_min': 'Precipitation Probability: Minimum',
        'uv_index_max': 'UV Index: Maximum',
        'precipitation_hours': 'Hours of Precipitation',
        'cloud_cover_mean': 'Cloud Cover: Average',
        'cloud_cover_max': 'Cloud Cover: Maximum',
        'cloud_cover_min': 'Cloud Cover: Minimum',
        'visibility_mean': 'Visibility: Average',
        'visibility_min': 'Visibility: Minimum',
        'visibility_max': 'Visibility: Maximum',
        'wind_speed_10m_min': 'Wind: Minimum',
        'wind_speed_10m_mean': 'Wind: Average',
        'wind_speed_10m_max': 'Wind: Maximum',
        'wind_gusts_10m_min': 'Wind Gust: Minimum',
        'wind_gusts_10m_mean': 'Wind Gust: Average',
        'wind_gusts_10m_max': 'Wind Gust: Maximum',
    };
    return mappings[parameter] ?? parameter;
}

export const currentParameters = ["temperature_2m", "apparent_temperature", "precipitation", "cloud_cover", "wind_speed_10m", "wind_gusts_10m"];
export const hourlyParameters = ["temperature_2m", "precipitation_probability", "precipitation", "cloud_cover", "visibility", "wind_speed_10m", "wind_gusts_10m", "uv_index"];
export const dailyParameters = ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "rain_sum", "snowfall_sum", "precipitation_sum", "precipitation_probability_max", "uv_index_max", "precipitation_hours", "temperature_2m_mean", "cloud_cover_mean", "cloud_cover_max", "cloud_cover_min", "precipitation_probability_mean", "precipitation_probability_min", "visibility_mean", "visibility_min", "visibility_max", "wind_speed_10m_min", "wind_speed_10m_mean", "wind_speed_10m_max", "wind_gusts_10m_min", "wind_gusts_10m_mean", "wind_gusts_10m_max"];
export const timeScales = ["Hourly", "Daily"];