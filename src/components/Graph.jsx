import { useState } from "react";
import { ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot } from "@mui/x-charts";
import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Slider} from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";

export default function Graph({ weather, parametersVisible, selectedParameters, setSelectedParameters, pageId, section, card }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weather.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    //Slider
    const [visibleDataRange, setVisibleDataRange] = useState([0, 72]);
    const handleRangeChange = (event, newValue) => {
        setVisibleDataRange(newValue);
    };

    //Parameters
    const handleSelectedParametersChange = (event) => {
        const { target: { value } } = event;
        const newParams = (typeof value === 'string' ? value.split(',') : value);
        setSelectedParameters(pageId, section.id, card.id, newParams);
    }

    // Group parameters by their unit
    const parametersByUnit = {};
    selectedParameters.forEach(param => {
        const unit = weather.hourly.weatherVariables[param].unit;
        if (!parametersByUnit[unit]) {
            parametersByUnit[unit] = []; 
        }
        parametersByUnit[unit].push(param);
    });

    // Generate axes and series based on the grouped data
    const yAxes = [];
    const series = [];
    const uniqueUnits = Object.keys(parametersByUnit);

    uniqueUnits.forEach((unit, index) => {
        // Generate a single yAxis for the unit
        yAxes.push({
            id: unit,
            position: index % 2 === 0 ? 'left' : 'right',
            label: getUnitAbbreviation(unit), 
            labelStyle: { fontSize: 12 },
        });

        // Generate a series for each parameter within this unit group
        parametersByUnit[unit].forEach(param => {
            series.push({
                data: weather.hourly.weatherVariables[param].values.slice(visibleDataRange[0], visibleDataRange[1]),
                yAxisId: unit, 
                type: 'line',
                label: param,
                showMark: false,
            });
        });
    });


    const xAxis = [
        {
            scaleType: 'time',
            data: weather.hourly.time.slice(visibleDataRange[0], visibleDataRange[1]),
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
            {parametersVisible && 
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
            }
            <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ width: '100%', height: '100%' }}>
                    <ChartDataProvider
                        key={uniqueUnits.length}
                        series={series}
                        xAxis={xAxis}
                        yAxis={yAxis}
                    >                    
                        {selectedParameters.length > 0 ? (
                            <div className="w-full h-full flex flex-col">
                                <ChartsLegend sx={{flexShrink: 0, justifyContent: 'center'}} />
                                <div className="flex-grow">
                                    <ChartsSurface sx={{height: '100%'}}>
                                        <LinePlot />
                                        <AreaPlot />
                                        <ChartsXAxis />
                                        {yAxis.map((axis) => (
                                            <ChartsYAxis key={axis.id} axisId={axis.id} position={axis.position} label={axis.label} />
                                        ))}
                                        <ChartsTooltip 
                                            slotProps={{tooltip: {axis: {x: {highlight: true,}, y: {highlight: true,},},},}}
                                        />
                                    </ChartsSurface>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <p>Select one or more parameters to display the graph.</p>
                            </div>
                        )}                  
                    </ChartDataProvider>
                </Box>
            </Box>
            <Slider
                value={visibleDataRange}
                onChange={handleRangeChange}
                min={0}
                max={336}
                step={24}
            />
        </div>
    );
}