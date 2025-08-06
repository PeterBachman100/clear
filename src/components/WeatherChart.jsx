import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, Popover, Card } from "@mui/material";

export default function WeatherChart({ chartId, weatherData, selectedParameter, onParameterChange, onDelete }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weatherData.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    const handleParameterChange = (e) => {
        onParameterChange(chartId, e.target.value);
    };


   const optionsDropdown = (
    <select
        className="border p-2 m-2"
        value={selectedParameter}
        onChange={handleParameterChange}
    >
        {hourlyParams.map((param) => (
            <option key={param} value={param}>{param}</option>
        ))}
    </select>
   );


   //POPOVER
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // end popover

    const series = [
        {
            data: weatherData.hourly.weatherVariables[selectedParameter].values,
            showMark: false,
        }
    ];
    const xAxis = [
        {
            domainLimit: 'strict',
            scaleType: 'time',
            label: 'Time',
            data: weatherData.hourly.time,
            valueFormatter: (timestamp, context) => {
                if(context.location === 'tick') {
                    return new Date(timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric', hour12: true, timeZone: weatherData.location.timeZone
                    });
                }
                return new Date(timestamp).toLocaleTimeString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', hour12: true, timeZone: weatherData.location.timezone
                    });
            },
        }
    ];
    const yAxis = [
        {
            label: selectedParameter + ' (' + weatherData.hourly.weatherVariables[selectedParameter].unit + ')'
        }
    ];

    return (
        
        <div>
            <Button aria-describedby={id} variant="contained" onClick={handleOpenPopover}>Chart Settings</Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Card sx={{ p: 2 }} className="flex gap-2">
                    <Button onClick={() => {onDelete(chartId)}} color="error">Delete</Button>
                    {optionsDropdown}
                </Card>
            </Popover>

            <Box sx={{ overflowX: 'scroll', width: '100vw' }}>
                <Box sx={{ minWidth: '4000px', width: '100%' }}>
                    <LineChart
                        series={series}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        height={300}
                        grid={{vertical:true, horizontal:true}}
                    />        
                </Box>
            </Box>
        </div>
    );
}