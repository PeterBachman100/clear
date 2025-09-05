import { useState } from "react";
import { ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot, ChartsReferenceLine, ChartsAxisHighlight, LineElement, BarPlot } from "@mui/x-charts";
import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Slider} from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";
import { getDomainLimitByUnit } from "../utils/chartUtils";
import { interpolateRdYlBu, interpolateRdYlGn } from "d3-scale-chromatic";

export default function Graph({ weather, parametersVisible, selectedParameters, setSelectedParameters, pageId, section, card }) {
    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, ...rest } = weather.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    //Slider
    const [visibleDataRange, setVisibleDataRange] = useState([0, 72]);
    const handleRangeChange = (event, newValue) => {
        setVisibleDataRange(newValue);
    };
    const getVisibleRange = (fullDataset) => {
        return fullDataset.slice(visibleDataRange[0], visibleDataRange[1]);
    }

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
    const yAxesFullRange = [];
    const series = [];
    const seriesFullRange = [];
    const uniqueUnits = Object.keys(parametersByUnit);

    uniqueUnits.forEach((unit, index) => {
        const axis = {
            id: unit,
            position: index % 2 === 0 ? 'left' : 'right',
            disableLine: true,
            disableTicks: true,
            ...((unit === 'fahrenheit' && {
                colorMap: {
                    type: 'continuous',
                    min: 0,
                    max: 110,
                    color: (t) => interpolateRdYlBu(1 - t),
                },
            })),
            ...((unit === 'dimensionless' && {
                colorMap: {
                    type: 'continuous',
                    min: 0,
                    max: 11, // Standard UV index scale
                    color: (t) => interpolateRdYlGn(1 - t),
                }
            })),
            label: getUnitAbbreviation(unit), 
            labelStyle: { fontSize: 16 },
            tickLabelStyle: {fontSize: 14, fontWeight: 'bold'},
            domainLimit: (minVal, maxVal) => getDomainLimitByUnit(minVal, maxVal, unit),
        };

        yAxes.push(axis);

        yAxesFullRange.push({
            ...axis,
            position: 'none',
        });

        // Generate a series for each parameter within this unit group
        parametersByUnit[unit].forEach(param => {
            const seriesItem = {
                data: getVisibleRange(weather.hourly.weatherVariables[param].values),
                yAxisId: unit, 
                xAxisId: 'hours',
                type: 'line',
                label: param,
                id: param,
                showMark: false,
                strokeDasharray: '5 5',
                customProperty: 'yes'
            };
            
            if(param === 'precipitation') {
                seriesItem.type = 'bar';
                seriesItem.color = '#0018FF';
                seriesItem.xAxisId = 'hours-band';
            }
            if(param === 'temperature' || param === 'apparent_temperature') {
                seriesItem.color = (t) => interpolateRdYlBu(1 - t);
            }

            series.push(seriesItem);
            
            const seriesItemFullRange = {
                ...seriesItem,
                data: weather.hourly.weatherVariables[param].values,
            }
            seriesFullRange.push(seriesItemFullRange);
        });
    });

    const xAxis = [
        {
            id: 'hours',
            scaleType: 'time',
            position: 'bottom',
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: {fontWeight: 300, fontSize: '10px'},
            data: getVisibleRange(weather.hourly.time),
            valueFormatter: (timestamp) => {
                return new Date(timestamp).toLocaleTimeString('en-US', {
                    weekday: undefined, month: undefined, day: undefined, hour: 'numeric', minute: undefined, second: undefined, hour12: true, timeZone: weather.location.timezone
                });
            },
        },
        {
            id: 'hours-band',
            scaleType: 'band',
            position: 'none',
            data: getVisibleRange(weather.hourly.time),
        },
        {
            id: 'days',
            scaleType: 'band', 
            disableTicks: true,
            disableLine: true,
            position: 'bottom',
            data: getVisibleRange(weather.hourly.time),
            valueFormatter: (timestamp) => {
                return new Date(timestamp).toLocaleDateString('en-US', {
                    weekday: 'short'
                });
            },
            tickLabelInterval: (value, index) => {
                if (index === 0) {
                    return true; 
                }
                const prevDate = new Date(getVisibleRange(weather.hourly.time)[index - 1]);
                const currentDate = new Date(value);
                return prevDate.getDate() !== currentDate.getDate();
            },
            labelStyle: { fontSize: 22 },
        }
    ];
 
    const xAxisFullRange = xAxis.map((axis) => {
        return {
            ...axis,
            data: weather.hourly.time,
            position: 'none'
        }
    })
    
    // DAY REFERENCE LINES
    const getDailyLinePositions = (timestamps) => {
        const dailyTimestamps = [];
        let prevDate = null;

        timestamps.forEach(timestamp => {
            const currentDate = new Date(timestamp);
            if (!prevDate || currentDate.getDate() !== prevDate.getDate()) {
                dailyTimestamps.push(timestamp);
            }
            prevDate = currentDate;
        });

        return dailyTimestamps;
    };

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
            {selectedParameters.length > 0 ? 
                (
                    <>
                    <Box sx={{ width: '100%', height: '90%' }}>
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <ChartDataProvider
                                key={uniqueUnits.length}
                                series={series}
                                xAxis={xAxis}
                                yAxis={yAxes}
                            >                    
                                <div className="w-full h-full flex flex-col">
                                        <ChartsLegend sx={{flexShrink: 0, justifyContent: 'center'}} />
                                        <div className="flex-grow">
                                            <ChartsSurface sx={{height: '100%'}}>
                                                {getDailyLinePositions(getVisibleRange(weather.hourly.time)).map((timestamp, index) => (
                                                    <ChartsReferenceLine
                                                        key={index}
                                                        x={timestamp}
                                                        lineStyle={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                        disableTooltips={true}
                                                    />
                                                ))}

                                                
                                                <LinePlot 
                                                    slotProps={{
                                                        line: (ownerState) => {
                                                            if (ownerState.id === 'apparent_temperature') {
                                                                return {
                                                                    strokeDasharray: '10 10'
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                                <BarPlot />
                                                {xAxis.map((axis) => (
                                                    <ChartsXAxis key={axis.id} axisId={axis.id} position={axis.position} />
                                                ))}
                                                {yAxes.map((axis) => (
                                                    <ChartsYAxis key={axis.id} axisId={axis.id} position={axis.position} label={axis.label} />
                                                ))}
                                                <ChartsAxisHighlight x='line' />
                                                <ChartsTooltip 
                                                    
                                                />
                                            </ChartsSurface>
                                        </div>
                                    </div>               
                            </ChartDataProvider>
                        </Box>
                    </Box>
                    
                    <Box sx={{position: 'relative', height: '30px', marginInline: '10px'}}>
                        <Slider
                            value={visibleDataRange}
                            onChange={handleRangeChange}
                            min={0}
                            max={336}
                            step={3}
                            sx={{
                                position: 'absolute', 
                                bottom: 0, 
                                left: 0, 
                                zIndex: 1, 
                                width: '100%', 
                                height: '100%',
                                padding: '0 !important',
                                '& .MuiSlider-thumb': {
                                    height: '100%', 
                                    borderRadius: 0,
                                    width: '8px',
                                    color: '#000'
                                },

                                '& .MuiSlider-track': {
                                    border: '1px solid gray',
                                    color: '#ffffff00',
                                    backdropFilter: 'brightness(1.2)',
                                    borderRadius: 0,
                                    height: '100%'
                                },
                                '& .MuiSlider-rail': {
                                    border: '0.5px solid black',
                                    borderRadius: 0,
                                    color: '#ffffff00',
                                    backdropFilter: 'brightness(0.5)',
                                },
                            }}
                        />
                        <ChartDataProvider
                            key={uniqueUnits.length}
                            series={seriesFullRange}
                            xAxis={xAxisFullRange}
                            yAxis={yAxesFullRange}
                            margin={{top: 3, bottom: 0, left: 5, right: 5}}
                        >                    
                            <ChartsSurface sx={{height: '100%'}}>
                                <LinePlot strokeWidth={1}  />
                                <BarPlot strokeWidth={1} />
                            </ChartsSurface>           
                        </ChartDataProvider>
                    </Box>
                </>
                ) :
                (
                    <div className="flex justify-center items-center h-full">
                        <p>Select one or more parameters to display the graph.</p>
                    </div>
                )
            }
            
        </div>
    );
}