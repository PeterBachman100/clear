import { ChartContainer, ChartsXAxis, ChartsYAxis, LinePlot, LineChart } from "@mui/x-charts";
import { useState } from "react";

export default function WeatherChart({ weatherData }) {
    const [selectedData, setSelectedData] = useState(weatherData.hourly.temperature2m);

    const renderedButtons = Object.keys(weatherData.hourly).map((param) => {
        return <button key={param} className="p-4 border m-1" onClick={() => setSelectedData(weatherData.hourly[param])}>{param}</button>;
    })

    const series = [
        {
            data: selectedData,
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

    return (
        <div>
            {renderedButtons}
            <LineChart
                series={series}
                xAxis={xAxis}
                height={500}
            />
        </div>
    );
}