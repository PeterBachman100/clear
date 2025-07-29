import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

export default function WeatherChart({ weatherData }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weatherData.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    const [selectedParameter, setSelectedParameter] = useState({ 
        parameter: hourlyParams[0], 
        data: weatherData.hourly.weatherVariables[hourlyParams[0]]
    });

    useEffect(() => {
        setSelectedParameter(prev => ({
            parameter: prev.parameter,
            data: weatherData.hourly.weatherVariables[prev.parameter]
        }));
    }, [weatherData]);


   const optionsDropdown = (
    <select
        className="border p-2 m-2"
        value={selectedParameter.parameter}
        onChange={(e) => setSelectedParameter({
            parameter: e.target.value,
            data: weatherData.hourly.weatherVariables[e.target.value]
        })}
    >
        {hourlyParams.map((param) => (
            <option key={param} value={param}>{param}</option>
        ))}
    </select>
   );

    const series = [
        {
            data: selectedParameter.data.values,
        }
    ];
    const xAxis = [
        {
            scaleType: 'time',
            label: 'Time',
            data: weatherData.hourly.time,
            valueFormatter: (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', hour12: true, timeZone: weatherData.location.timezone
            }),
            tickMinStep: 3600 * 1000 * 24
        }
    ];
    const yAxis = [
        {
            label: selectedParameter.parameter + ' (' + selectedParameter.data.unit + ')'
        }
    ];

    return (
        <div>
            {optionsDropdown}
            <LineChart
                series={series}
                xAxis={xAxis}
                yAxis={yAxis}
                height={300}
                grid={{vertical:true, horizontal:false}}
            />
        </div>
    );
}