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

    const parseVariablesWithTime = (section, isCurrent = false) => {
        const parsed = {};
        const timeStart = Number(section.time()) * 1000;
        const interval = section.interval();
        const timeEnd = Number(section.timeEnd?.() ?? 0) * 1000;

        parsed.time = isCurrent
            ? timeStart
            : [...Array((timeEnd - timeStart) / (interval * 1000))].map(
                (_, i) => timeStart + i * interval * 1000
                );

        parsed.weatherVariables = {};

        for (let i = 0; i < section.variablesLength(); i++) {
            const variable = section.variables(i);
            const key = getVariableKey(variable);
            const unit = getUnit(variable);

            let values;

            if (variable.valuesInt64Length() > 0) {
                values = Array.from({ length: variable.valuesInt64Length() }, (_, j) =>
                Number(variable.valuesInt64(j)) * 1000
                );
            } else {
                values = variable.valuesArray();
            }

            parsed.weatherVariables[key] = isCurrent
                ? { value: variable.value(), unit }
                : { values, unit };
        }

        return parsed;
  };

  return {
    location: {
      latitude: response.latitude(),
      longitude: response.longitude(),
      timezone: response.timezone()
    },
    current: parseVariablesWithTime(response.current(), true),
    daily: parseVariablesWithTime(response.daily()),
    hourly: parseVariablesWithTime(response.hourly())
  };
}

  