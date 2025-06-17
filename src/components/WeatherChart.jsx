import { ChartContainer, ChartsXAxis, ChartsYAxis, LinePlot, LineChart } from "@mui/x-charts";
import { useState } from "react";

export default function WeatherChart({ weatherData }) {
    const [selectedData, setSelectedData] = useState(weatherData.hourly.cloud_cover);

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
            valueFormatter: (date) => date.toLocaleTimeString([], {weekday: 'short', hour: 'numeric', hour12: true}),
            
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