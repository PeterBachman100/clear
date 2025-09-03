export const getDomainLimitByUnit = (minValue, maxValue, unit) => {
    let min = minValue;
    let max = maxValue;

    const defaultDomains = {
        'fahrenheit': { min: 32, max: 100 },
        'percentage': { min: 0, max: 100 },
        'feet': { min: 0, max: 160000 }, 
        'miles_per_hour': { min: 0, max: 25 },
        'miles': { min: 0, max: 30 },
        'inch': { min: 0, max: 0.3 },
        'hectopascal': { min: 950, max: 1050 },
        'index': { min: 0, max: 12 },
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