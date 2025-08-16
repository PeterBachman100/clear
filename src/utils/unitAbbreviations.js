export function getUnitAbbreviation(fullUnit) {
    const mappings = {
        'fahrenheit': '°F',
        'percentage': '%',
        'inch': 'in',
        'hectopascal': 'hPa',
        'feet': 'ft',
        'miles_per_hour': 'mph',
        'dimensionless': '',
        'miles': 'mi'
    };
    return mappings[fullUnit] ?? fullUnit;
}