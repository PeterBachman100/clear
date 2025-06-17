import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

export default function WeatherChart({ weatherData }) {
    const { freezingLevelHeight, isDay, snowDepth, time, weatherCode, windDirection10m, ...rest } = weatherData.hourly;
    const hourlyParams = Object.keys(rest);

    const [selectedParameter, setSelectedParameter] = useState({ 
        parameter: hourlyParams[0], 
        data: weatherData.hourly[hourlyParams[0]] 
    });

    useEffect(() => {
        setSelectedParameter(prev => ({
            parameter: prev.parameter,
            data: weatherData.hourly[prev.parameter]
        }));
    }, [weatherData]);


   const optionsDropdown = (
    <select
        className="border p-2 m-2"
        value={selectedParameter.parameter}
        onChange={(e) => setSelectedParameter({
            parameter: e.target.value,
            data: weatherData.hourly[e.target.value]
        })}
    >
        {hourlyParams.map((param) => (
            <option key={param} value={param}>{param}</option>
        ))}
    </select>
   );

    const series = [
        {
            data: selectedParameter.data,
        }
    ];
    const xAxis = [
        {
            scaleType: 'time',
            label: 'Time',
            data: weatherData.hourly.time,
            valueFormatter: (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', {
                weekday: 'short', hour: 'numeric', hour12: true, timeZone: weatherData.timezone
            }),
            
        }
    ];
    const yAxis = [
        {
            label: selectedParameter.parameter
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
            />
        </div>
    );
}