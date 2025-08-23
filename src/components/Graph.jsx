import { ChartContainer, ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Chip } from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";

export default function Graph({ weather, parametersVisible, selectedParameters, setSelectedParameters, pageId, section, card }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weather.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    //Parameters
    const handleSelectedParametersChange = (event) => {
        const { target: { value } } = event;
        const newParams = (typeof value === 'string' ? value.split(',') : value);
        setSelectedParameters(pageId, section.id, card.id, newParams);
    }

    //TESTING
    // Step 1: Group parameters by their unit
    const parametersByUnit = {};
    selectedParameters.forEach(param => {
        const unit = weather.hourly.weatherVariables[param].unit;
        if (!parametersByUnit[unit]) {
            parametersByUnit[unit] = [];
        }
        parametersByUnit[unit].push(param);
    });

    // Step 2 & 3: Generate axes and series based on the grouped data
    const yAxes = [];
    const series = [];
    const uniqueUnits = Object.keys(parametersByUnit);

    uniqueUnits.forEach((unit, index) => {
        // Generate a single yAxis for the unit
        yAxes.push({
            id: unit,
            position: index % 2 === 0 ? 'left' : 'right',
            label: `${unit} ${getUnitAbbreviation(unit)}`, // Use a function for abbreviations if available
            labelStyle: { fontSize: 12 },
        });

        // Generate a series for each parameter within this unit group
        parametersByUnit[unit].forEach(param => {
            series.push({
                data: weather.hourly.weatherVariables[param].values,
                yAxisId: unit, // Correctly link series to the unit's y-axis
                type: 'line',
                label: param,
                showMark: false,
            });
        });
    });

    //END TESTING


    // const yAxes = selectedParameters.map((param) => {
    //     return {
    //         id: param,
    //         position: 'left',
    //         label: param + ' ' + '(' + weather?.hourly.weatherVariables[param].unit + ')',
    //         labelStyle: {fontSize: 12},
    //     }
    // });

    // const series = selectedParameters.map((param) => {
    //     return {
    //         data: weather?.hourly.weatherVariables[param].values,
    //         yAxisId: param,
    //         type: 'line',
    //         label: param,
    //         showMark: false,
    //     }
    // })

    const xAxis = [
        {
            // domainLimit: 'strict',
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
    
    const yAxis = yAxes;

    return (
        <div className='flex flex-col h-full'>  
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="multiple-select-label">Parameters</InputLabel>
                <Select
                    labelId="multiple-select-label"
                    id="multiple-select"
                    multiple
                    value={selectedParameters}
                    onChange={handleSelectedParametersChange}
                    renderValue={(selectedParameters) => selectedParameters.join(', ')}
                >
                    {hourlyParams.map((param) => (
                        <MenuItem key={param} value={param}>
                            <Checkbox checked={selectedParameters.includes(param)} />
                            <ListItemText primary={param} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ overflowX: 'scroll', width: '100%', height: '100%' }}>
                <Box sx={{ width: '100%', height: '100%' }}>
                    {}
                    <ChartDataProvider
                        series={series}
                        xAxis={xAxis}
                        yAxis={yAxis}
                    >
                        
                            <ChartsSurface sx={{width:'100%', height:'80%'}}>
                                <LinePlot />
                                <AreaPlot />
                                <ChartsXAxis />
                                {yAxes.map((axis) => (
                                    <ChartsYAxis key={axis.id} axisId={axis.id} position={axis.position} label={axis.label} />
                                ))}
                                <ChartsTooltip 
                                    slotProps={{tooltip: {axis: {x: {highlight: true,}, y: {highlight: true,},},},}}
                                />
                            </ChartsSurface>
                            
                            <ChartsLegend />
                        
                        
                    </ChartDataProvider>    
                </Box>
            </Box>
        </div>
    );
}