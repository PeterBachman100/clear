import { useState, useMemo } from "react";
import { ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot, MarkPlot, ChartsReferenceLine, ChartsAxisHighlight, BarPlot, ChartContainer  } from "@mui/x-charts";
import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Slider} from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";
import { getDomainLimitByUnit } from "../utils/chartUtils";
import { interpolateRdYlBu, interpolateRdYlGn } from "d3-scale-chromatic";
import { useDispatch, useSelector } from "react-redux";
import { setParameters } from "./DashboardSlice";

// Drawing Order
const parameterDrawingOrder = [
    'cloud_cover', 
    'cloud_cover_low',
    'precipitation_probability',
    'precipitation',
    'temperature',
    'wind_speed',
    'wind_gusts',
    'visibility',
    'uv_index'
];

// LINE PLOT SLOT PROPS
const linePlotSlotProps = {
    line: (ownerState) => {
        if (ownerState.id === 'cloud_cover' || ownerState.id === 'cloud_cover_low') {
            return {
                strokeWidth: '0px'
            }
        }
        if (ownerState.id === 'precipitation_probability') {
            return {
                strokeWidth: '1px'
            }
        }
        if (ownerState.id === 'apparent_temperature') {
            return {
                strokeDasharray: '10 10',
                strokeWidth: '3px'

            }
        } 
        if (ownerState.id === 'temperature') {
            return {
                strokeWidth: '3px'
            }
        }
        if (ownerState.id === 'visibility') {
            return {
                strokeWidth: '1px',
                strokeDasharray: '1 5'
            }
        }
        if (ownerState.id === 'wind_speed') {
            return {
                strokeWidth: '0.5px'
            }
        }
        if (ownerState.id === 'wind_gusts') {
            return {
                strokeWidth: '0.5px',
                strokeDasharray: '4 12'
            }
        }
    }
}

// BAR PLOT SLOT PROPS
const barPlotSlotProps = {
    bar: (ownerState) => {
        if (ownerState.id === 'uv_index') {
            return {
                height: 5,
                style: {
                    transform: 'translateY(-10px)'
                }                                                                 
            }
        }
    }
}


export default function Graph({ weather, parametersVisible, cardId, editMode }) {

    const dispatch = useDispatch();
    

    const { freezing_level_height, is_day, snow_depth, weather_code, wind_direction, surface_pressure, rain, showers, snowfall, relative_humidity, cloud_cover_mid, cloud_cover_high, dew_point, apparent_temperature, ...rest } = weather.hourly.weatherVariables;
    const hourlyParams = Object.keys(rest);

    //Slider
    const [visibleDataRange, setVisibleDataRange] = useState([0, 72]);
    const handleRangeChange = (event, newValue) => {
        setVisibleDataRange(newValue);
    };
    const getVisibleRange = (fullDataset) => {
        return fullDataset.slice(visibleDataRange[0], visibleDataRange[1]);
    }

    //PARAMETERS
    const selectedParameters = useSelector(state => state.dashboard.cards[cardId].selectedParameters);
    const handleSetParameters = (event) => {
        const { target: { value } } = event;
        const newParams = (typeof value === 'string' ? value.split(',') : value);
        dispatch(setParameters({cardId: cardId, selectedParameters: newParams}));
    }


    // MEMO-IZED Y Axes and Series
    const { yAxes, yAxesFullRange, series, seriesFullRange, uniqueUnits } = useMemo(() => {
        const orderedSelectedParameters = parameterDrawingOrder.filter(param => selectedParameters.includes(param));

        // Group parameters by their unit
        const parametersByUnit = {};
        orderedSelectedParameters.forEach(param => {
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

        uniqueUnits.forEach((unit) => {
            const axis = {
                id: unit,
                position:'none',
                disableLine: true,
                disableTicks: true,
                label: getUnitAbbreviation(unit), 
                labelStyle: { fontSize: 16 },
                tickLabelStyle: {fontSize: 14, fontWeight: 'bold'},
                domainLimit: (minVal, maxVal) => getDomainLimitByUnit(minVal, maxVal, unit),
                
            };
            if (unit === 'fahrenheit') {
                axis.colorMap = {
                        type: 'continuous',
                        min: 1,
                        max: 110,
                        color: (t) => interpolateRdYlBu(1 - t),
                    };
            }
            if (unit === 'dimensionless') {
                axis.reverse = 'true';
                axis.position = 'none';
                axis.colorMap = {
                        type: 'continuous',
                        min: 1,
                        max: 12, 
                        color: (t) => interpolateRdYlGn(1 - t),
                    };
            }

            yAxes.push(axis);

            yAxesFullRange.push({
                ...axis,
                position: 'none',
            });

            parametersByUnit[unit].forEach(param => {
                const seriesItem = {
                    data: getVisibleRange(weather.hourly.weatherVariables[param].values),
                    yAxisId: unit, 
                    xAxisId: 'hours',
                    type: 'line',
                    label: `${param} (${getUnitAbbreviation(unit)})`,
                    id: param,
                    showMark: true,
                    
                };
                
                if(param === 'precipitation') {
                    seriesItem.type = 'bar';
                    seriesItem.color = '#0018FF';
                    seriesItem.xAxisId = 'hours-band';
                }
                if (param === 'precipitation_probability') {
                    seriesItem.area = 'true';
                    seriesItem.color = 'rgba(155, 223, 250, 0.6)';
                }
                if (param === 'uv_index') {
                    seriesItem.type = 'bar';
                    seriesItem.xAxisId = 'uv-band';
                    seriesItem.color = '#036837';
                }
                if(param === 'temperature') {
                    seriesItem.color = '#fce400';
                }
                if (param === 'cloud_cover') {
                    seriesItem.area = 'true';
                    seriesItem.color = '#C9C9C9';
                }
                if (param === 'cloud_cover_low') {
                    seriesItem.area = 'true';
                    seriesItem.color = '#b8b8b8';
                }
                if (param === 'visibility') {
                    seriesItem.color = '#000';
                }
                if (param === 'wind_speed') {
                    seriesItem.color = '#900000';
                }
                if (param === 'wind_gusts') {
                    seriesItem.color = '#690000';
                }
                

                series.push(seriesItem);
                
                const seriesItemFullRange = {
                    ...seriesItem,
                    data: weather.hourly.weatherVariables[param].values,
                }
                seriesFullRange.push(seriesItemFullRange);
            });
        });
        return { yAxes, yAxesFullRange, series, seriesFullRange, uniqueUnits };
    }, [selectedParameters, weather, visibleDataRange]);

    // MEMO-IZED X AXES
    const { xAxis, xAxisFullRange } = useMemo(() => {
        const xAxis = [
            {
                id: 'hours',
                scaleType: 'time',
                position: 'bottom',
                disableLine: true,
                disableTicks: true,
                tickLabelStyle: { fontWeight: 300, fontSize: '10px' },
                data: getVisibleRange(weather.hourly.time),
                valueFormatter: (timestamp) => {
                    return new Date(timestamp).toLocaleTimeString('en-US', {
                        weekday: undefined, month: undefined, day: undefined, hour: 'numeric', minute: undefined, second: undefined, hour12: true, timeZone: weather.location.timezone
                    });
                },
            },
            {
                id: 'uv-band',
                scaleType: 'band',
                position: 'none',
                data: getVisibleRange(weather.hourly.time),
                barGapRatio: '-1',
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
            },
        ];

        const xAxisFullRange = xAxis.map((axis) => {
            return {
                ...axis,
                data: weather.hourly.time,
                position: 'none',
            };
        });

        return { xAxis, xAxisFullRange };
    }, [weather.hourly.time, visibleDataRange]);
    // end memo-ized x axes
    
    // DAY REFERENCE LINES
    const renderedDayReferenceLines = useMemo(() => {
    
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
        
        return getDailyLinePositions(getVisibleRange(weather.hourly.time)).map((timestamp, index) => (
            <ChartsReferenceLine
                key={index}
                x={timestamp}
                lineStyle={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '4 4' }}
                disableTooltips={true}
            />
        ));
    }, [weather.hourly.time, visibleDataRange]);



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
                        onChange={handleSetParameters}
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
                            {/* Key needed to avoid bug in MUI library */}
                            <ChartDataProvider key={uniqueUnits.length} series={series} xAxis={xAxis} yAxis={yAxes}>                  
                                <ChartsLegend sx={{flexShrink: 0, justifyContent: 'center'}} />      
                                <ChartsSurface sx={{width: '100%'}}>
                                    <AreaPlot skipAnimation />
                                    {renderedDayReferenceLines}
                                    <LinePlot slotProps={linePlotSlotProps} skipAnimation />
                                    <BarPlot slotProps={barPlotSlotProps} skipAnimation />
                                    {xAxis.map(axis => <ChartsXAxis key={axis.id} axisId={axis.id} position={axis.position} />)}
                                    {yAxes.map(axis => <ChartsYAxis key={axis.id} axisId={axis.id} position={axis.position} label={axis.label} />)}
                                    <ChartsAxisHighlight x='line' />
                                    <ChartsTooltip />
                                </ChartsSurface>                
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
                                position: 'absolute', bottom: 0, left: 0, zIndex: 1, width: '100%', height: '100%',padding: '0 !important',
                                '& .MuiSlider-thumb': {height: '100%', borderRadius: 0, width: '8px', color: '#000'},
                                '& .MuiSlider-track': {border: '1px solid gray', color: '#ffffff00', backdropFilter: 'brightness(1.2)', borderRadius: 0, height: '100%'},
                                '& .MuiSlider-rail': {border: '0.5px solid black', borderRadius: 0, color: '#ffffff00', backdropFilter: 'brightness(0.5)'},
                            }}
                        />
                        <ChartDataProvider key={uniqueUnits.length} series={seriesFullRange} xAxis={xAxisFullRange} yAxis={yAxesFullRange} margin={{top: 3, bottom: 0, left: 5, right: 5}}>                    
                            <ChartsSurface sx={{height: '100%'}}>
                                <AreaPlot skipAnimation />
                                <LinePlot slotProps={linePlotSlotProps} strokeWidth={1} skipAnimation/>
                                <BarPlot slotProps={barPlotSlotProps} strokeWidth={1} skipAnimation />
                            </ChartsSurface>           
                        </ChartDataProvider>
                    </Box>
                </>
                ) :
                (<div className="flex justify-center items-center h-full">
                    <p>Select one or more parameters to display the graph.</p>
                </div>)
            }
        </div>
    );
}