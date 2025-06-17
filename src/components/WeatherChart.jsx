import { ChartContainer, ChartsXAxis, ChartsYAxis, LinePlot, LineChart } from "@mui/x-charts";
import { useState } from "react";

export default function WeatherChart({ weatherData }) {
    const [selectedParameter, setSelectedParameter] = useState({ parameter: 'temperature2m', data: weatherData.hourly.temperature2m })

   const { freezingLevelHeight, isDay, snowDepth, time, weatherCode, windDirection10m, ...rest } = weatherData.hourly;
   const hourlyParams = Object.keys(rest);

   const renderedOptions = hourlyParams.map((param) => {
    return <button key={param} onClick={() => setSelectedParameter({parameter: param, data: weatherData.hourly[param]})} className="border p-1 m-1 cursor-pointer">{param}</button>;
   });

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
            {renderedOptions}
            <LineChart
                series={series}
                xAxis={xAxis}
                yAxis={yAxis}
                height={500}
            />
        </div>
    );
}