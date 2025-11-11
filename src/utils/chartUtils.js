export const getDomainLimitByUnit = (minValue, maxValue, unit) => {
    let min = minValue;
    let max = maxValue;

    const defaultDomains = {
        '°F': { min: 32, max: 100 },
        '%': { min: 0, max: 105 },
        'mp/h': { min: 0, max: 25 },
        'miles': { min: 0, max: 15 },
        'inch': { min: 0, max: 0.3 },
        'dimensionless': { min: 0, max: 12 },
    };

    const domain = defaultDomains[unit];
    
    if (domain) {
        min = Math.min(minValue, domain.min);
        max = Math.max(maxValue, domain.max);
    }
    
    if (min === max) {
        max = min + 1;
    }
    
    return { min, max };
};

export function getUnitAbbreviation(fullUnit) {
    const mappings = {
        '°F': '°F',
        '%': '%',
        'inch': 'in',
        'mp/h': 'mph',
        'dimensionless': '',
        'miles': 'mi'
    };
    return mappings[fullUnit] ?? fullUnit;
}

export const parameterDrawingOrder = [
    'cloud_cover', 
    'precipitation_probability',
    'precipitation',
    'temperature_2m',
    'wind_speed_10m',
    'wind_gusts_10m',
    'visibility',
    'uv_index'
];

export const linePlotSlotProps = {
    line: (ownerState) => {
        if (ownerState.id === 'cloud_cover') {
            return {
                strokeWidth: '1px'
            }
        }
        if (ownerState.id === 'precipitation_probability') {
            return {
                strokeWidth: '2px'
            }
        }
        if (ownerState.id === 'temperature_2m') {
            return {
                strokeWidth: '5px'
            }
        }
        if (ownerState.id === 'visibility') {
            return {
                strokeWidth: '2px',
                strokeDasharray: '1 4'
            }
        }
        if (ownerState.id === 'wind_speed_10m') {
            return {
                strokeWidth: '0.75px'
            }
        }
        if (ownerState.id === 'wind_gusts_10m') {
            return {
                strokeWidth: '0.75px',
                strokeDasharray: '4 12'
            }
        }
    }
}

export const barPlotSlotProps = {
    bar: (ownerState) => {
        if (ownerState.id === 'uv_index') {
            return {
                height: 3,
                rx: 2,
                style: {
                    transform: 'translateY(-5px)',
                }                                                                 
            }
        }
    }
}

export const sliderBarPlotSlotProps = {
    bar: (ownerState) => {
        if (ownerState.id === 'uv_index') {
            return {
                height: 2,
                style: {
                    transform: 'translateY(-2px)',
                }                                                                 
            }
        }
    }
}

export const convertTimestampsToDateObjects = (timestamps) => {
    return timestamps.map(timestamp => new Date(timestamp * 1000));
}

export const convertDateToTimezoneBasedString = (date, timezone) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        timeZone: timezone,
    });
    return formatter.format(date);
}

export const convertTimestampToLocalDayString = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: timezone,
    });
    return formatter.format(date);
}

export const convertTimestampToLocalTimeString = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: timezone,
    });
    return formatter.format(date);
}