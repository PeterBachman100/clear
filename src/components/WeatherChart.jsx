import { ChartContainer, ChartsXAxis, ChartsYAxis, LinePlot, LineChart } from "@mui/x-charts";
import { useState } from "react";

export default function WeatherChart({ weatherData }) {
    const { freezingLevelHeight, isDay, snowDepth, time, weatherCode, windDirection10m, ...rest } = weatherData.hourly;
    const hourlyParams = Object.keys(rest);

    const [selectedParameter, setSelectedParameter] = useState({ parameter: hourlyParams[0], data: weatherData.hourly[hourlyParams[0]] })

//    const renderedOptions = hourlyParams.map((param) => {
//     return <button key={param} onClick={() => setSelectedParameter({parameter: param, data: weatherData.hourly[param]})} className="border p-1 m-1 cursor-pointer">{param}</button>;
//    });
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
                height={500}
            />
        </div>
    );
}