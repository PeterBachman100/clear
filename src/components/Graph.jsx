import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, Popover, Card } from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";

export default function Graph({ weather, parametersVisible, selectedParameter, setSelectedParameter, pageId, section, card }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weather.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    const handleParameterChange = (e) => {
        setSelectedParameter(pageId, section.id, card.id, e.target.value);
    };


   const optionsDropdown = (
    <select
        className="border p-1 mb-2"
        value={selectedParameter}
        onChange={handleParameterChange}
    >
        {hourlyParams.map((param) => (
            <option key={param} value={param}>{param.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())}</option>
        ))}
    </select>
   );

   // Visibility: convert feet to miles
   const seriesData = selectedParameter === 'visibility'
        ? weather.hourly.weatherVariables[selectedParameter].values.map(feet => feet / 5280) // Convert ft to miles
        : weather.hourly.weatherVariables[selectedParameter].values;

    const series = [
        {
            data: seriesData,
            showMark: false
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

    // Conditional logic for yAxis label
    const yAxisLabel = selectedParameter === 'visibility'
        ? 'Visibility (mi)' // Custom label for visibility
        : selectedParameter.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, (match) => match.toUpperCase()) + ' ' + getUnitAbbreviation(weather.hourly.weatherVariables[selectedParameter].unit);
    
        const yAxis = [
        {
            label: yAxisLabel,
            labelStyle: {
                fontSize: 12,
            },
        }
    ];

    return (
        
        <div className='flex flex-col h-full'>    
            {parametersVisible && optionsDropdown}
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