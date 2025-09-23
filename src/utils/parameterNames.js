export function getPrettyParameterName(parameter) {
    const mappings = {
        'precipitation': 'Precipitation Amount',
        'uv_index': 'UV Index',
        'cloud_cover': 'Total Cloud Cover',
        'cloud_cover_low': 'Low Cloud Cover',
        'precipitation_probability': 'Chance of Precipitation',
        'temperature': 'Temperature',
        'wind_speed': 'Wind Speed',
        'wind_gusts': 'Wind Gusts',
        'visibility': 'Visibility',
    };
    return mappings[parameter] ?? parameter;
}