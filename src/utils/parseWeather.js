import { Variable, Unit, Aggregation } from './flat-buffers/openmeteo-sdk.js';

export default function parseWeather(response) {
    
    const getVariableKey = (variable) => {
        const base = Variable[variable.variable()];
        const suffix = Aggregation[variable.aggregation()];
        return suffix === 'none'
            ? base
            : `${base}_${suffix}`;
    };

    const getUnit = (variable) => {
        return Unit[variable.unit()];
    }

    const parsedResponse = {
        location: {
            latitude: response.latitude(),
            longitude: response.longitude(),
            timezone: response.timezone()
        },
    }

    //current
    parsedResponse.current = {};
    const current = response.current();
    parsedResponse.current.time = Number(current.time()) * 1000;
    parsedResponse.current.weatherVariables = {};
    
    for (let i = 0; i < current.variablesLength(); i++) {
        const weatherVariable = current.variables(i);
        const key = getVariableKey(weatherVariable);
        const unit = getUnit(weatherVariable);
        const value = weatherVariable.value();

        parsedResponse.current.weatherVariables[key] = {
            value,
            unit
        };
 
    }

    //daily
    const daily = response.daily();

    parsedResponse.daily = {};
    parsedResponse.daily.time = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => (Number(daily.time()) + i * daily.interval()) * 1000
            );
    parsedResponse.daily.weatherVariables = {};

    for(let i = 0; i < daily.variablesLength(); i++) {
        const weatherVariable = daily.variables(i);
        const key = getVariableKey(weatherVariable);
        const unit = getUnit(weatherVariable);
        let values = weatherVariable.valuesArray();

        if (key === "sunrise" || key === "sunset") {
            values = [...Array(weatherVariable.valuesInt64Length())].map(
                (_, i) => (Number(weatherVariable.valuesInt64(i))) * 1000
            )
        }

        parsedResponse.daily.weatherVariables[key] = {
            values,
            unit
        };
    }

    //hourly
    const hourly = response.hourly();
    parsedResponse.hourly = {};
    parsedResponse.hourly.time = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => ((Number(hourly.time()) + i * hourly.interval()) * 1000)
            );
    parsedResponse.hourly.weatherVariables = {};

    for (let i = 0; i < hourly.variablesLength(); i++) {
        const weatherVariable = hourly.variables(i);
        const key = getVariableKey(weatherVariable);
        const unit = getUnit(weatherVariable);
        let values = weatherVariable.valuesArray();

        parsedResponse.hourly.weatherVariables[key] = {
            values,
            unit
        };
    }

    return parsedResponse;
}

  