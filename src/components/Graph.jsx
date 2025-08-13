import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, Popover, Card } from "@mui/material";

export default function Graph({ weather }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weather.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    const [selectedParameter, setSelectedParameter] = useState('temperature');

    const handleParameterChange = (e) => {
        setSelectedParameter(e.target.value);
    };


   const optionsDropdown = (
    <select
        className="border p-1 mb-2"
        value={selectedParameter}
        onChange={handleParameterChange}
    >
        {hourlyParams.map((param) => (
            <option key={param} value={param}>{param}</option>
        ))}
    </select>
   );

    const series = [
        {
            data: weather.hourly.weatherVariables[selectedParameter].values,
            showMark: false,
        }
    ];
    const xAxis = [
        {
            domainLimit: 'strict',
            scaleType: 'time',
            label: 'Time',
            data: weather.hourly.time,
            valueFormatter: (timestamp, context) => {
                if(context.location === 'tick') {
                    return new Date(timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric', hour12: true, timeZone: weather.location.timeZone
                    });
                }
                return new Date(timestamp).toLocaleTimeString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', hour12: true, timeZone: weather.location.timezone
                    });
            },
        }
    ];
    const yAxis = [
        {
            label: selectedParameter + ' (' + weather.hourly.weatherVariables[selectedParameter].unit + ')'
        }
    ];

    return (
        
        <div className='flex flex-col h-full'>    
            {optionsDropdown}
            <Box sx={{ overflowX: 'scroll', width: '100vw', height: '100%' }}>
                <Box sx={{ minWidth: '4000px', width: '100%', height: '100%' }}>
                    <LineChart
                        series={series}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        grid={{vertical:true, horizontal:true}}
                    />        
                </Box>
            </Box>
        </div>
    );
}