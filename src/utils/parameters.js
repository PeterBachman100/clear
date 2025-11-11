import { convertTimestampToLocalTimeString } from "./chartUtils";

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
        'temperature_2m_max': 'Temperature - Max',
        'temperature_2m_min': 'Temperature - Min',
        'temperature_2m_mean': 'Temperature - Avg.',
        'sunrise': 'Sunrise',
        'sunset': 'Sunset',
        'rain_sum': 'Rain Total',
        'snowfall_sum': 'Snow Total',
        'precipitation_sum': 'Precipitation Total',
        'precipitation_probability_max': 'Precipitation Probability - Max',
        'precipitation_probability_mean': 'Precipitation Probability - Avg.',
        'precipitation_probability_min': 'Precipitation Probability - Min',
        'uv_index_max': 'UV Index - Max',
        'precipitation_hours': 'Hours of Precipitation',
        'cloud_cover_mean': 'Cloud Cover - Avg.',
        'cloud_cover_max': 'Cloud Cover - Max',
        'cloud_cover_min': 'Cloud Cover - Min',
        'visibility_mean': 'Visibility - Avg.',
        'visibility_min': 'Visibility - Min',
        'visibility_max': 'Visibility - Max',
        'wind_speed_10m_min': 'Wind - Min',
        'wind_speed_10m_mean': 'Wind - Avg.',
        'wind_speed_10m_max': 'Wind - Max',
        'wind_gusts_10m_min': 'Wind Gust - Min',
        'wind_gusts_10m_mean': 'Wind Gust - Avg.',
        'wind_gusts_10m_max': 'Wind Gust - Max',
    };
    return mappings[parameter] ?? parameter;
}

export const formatDailyParameter = (param, data, timezone) => {
    switch(param) {
        // Temperature
        case "temperature_2m_max":
            return data;
            break;
        case "temperature_2m_min":
            return data;
            break;
        case "temperature_2m_mean":
            return data;
            break;

        // Sunrise/Sunset
        case "sunrise":
            return convertTimestampToLocalTimeString(data, timezone);
            break;
        case "sunset":
            return convertTimestampToLocalTimeString(data, timezone);
            break;

        // Precipitation
        case "rain_sum":
            return data;
            break;
        case "snowfall_sum":
            return data;
            break;
        case "precipitation_sum":
            return data;
            break;
        case "precipitation_hours":
            return data;
            break;

        // Precipitation Probability
        case "precipitation_probability_max":
            return data;
            break;
        case "precipitation_probability_mean":
            return data;
            break;
        case "precipitation_probability_min":
            return data;
            break;

        // UV Index    
        case "uv_index_max":
            return data;
            break;

        // Cloud Cover
        case "cloud_cover_mean":
            return data;
            break;
        case "cloud_cover_max":
            return data;
            break;
        case "cloud_cover_min":
            return data;
            break;

        // Visibility    
        case "visibility_mean":
            return Math.round(data);
            break;
        case "visibility_min":
            return Math.round(data);
            break;
        case "visibility_max":
            return Math.round(data);
            break;

        // Wind
        case "wind_speed_10m_min":
            return data;
            break;
        case "wind_speed_10m_mean":
            return data;
            break;
        case "wind_speed_10m_max":
            return data;
            break;
        case "wind_gusts_10m_min":
            return data;
            break;
        case "wind_gusts_10m_mean":
            return data;
            break;
        case "wind_gusts_10m_max":
            return data;
            break;

        // Default
        default: return param;
    }
}

export const currentParameters = ["temperature_2m", "apparent_temperature", "precipitation", "cloud_cover", "wind_speed_10m", "wind_gusts_10m"];
export const hourlyParameters = ["temperature_2m", "precipitation_probability", "precipitation", "cloud_cover", "visibility", "wind_speed_10m", "wind_gusts_10m", "uv_index"];
export const dailyParameters = ["temperature_2m_mean", "temperature_2m_max", "temperature_2m_min", "rain_sum", "snowfall_sum", "precipitation_sum", "precipitation_probability_mean", "precipitation_probability_min","precipitation_probability_max", "precipitation_hours", "cloud_cover_mean", "cloud_cover_max", "cloud_cover_min", "uv_index_max", "visibility_mean", "visibility_min", "visibility_max", "wind_speed_10m_min", "wind_speed_10m_mean", "wind_speed_10m_max", "wind_gusts_10m_min", "wind_gusts_10m_mean", "wind_gusts_10m_max", "sunrise", "sunset"];
export const timeScales = ["Hourly", "Daily"];