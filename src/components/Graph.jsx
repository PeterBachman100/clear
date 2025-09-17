import { useState, useMemo, useEffect, useTransition } from "react";
import { ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot, MarkPlot, ChartsReferenceLine, ChartsAxisHighlight, BarPlot, ChartContainer  } from "@mui/x-charts";
import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Slider, CircularProgress} from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";
import { getDomainLimitByUnit } from "../utils/chartUtils";
import { interpolateRdYlBu, interpolateRdYlGn } from "d3-scale-chromatic";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleDataRange } from "./DashboardSlice";

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


export default function Graph({ weather, cardId, cardData }) {

    const dispatch = useDispatch();

    const selectedParameters = cardData.selectedParameters;
    const visibleDataRange = cardData.visibleDataRange;

    // VISIBLE RANGE & SLIDER    
    // Util function 
    const getVisibleRange = (fullDataset) => {
        return fullDataset.slice(visibleDataRange[0], visibleDataRange[1]);
    }    

    // Local slider state
    const [localSliderRange, setLocalSliderRange] = useState(visibleDataRange);

    // Keep local slider in sync with Redux, hide spinner after update applied
    useEffect(() => {
        setLocalSliderRange(visibleDataRange);
    }, [visibleDataRange]);



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
            const x = {...axis};
            x.data = weather.hourly.time;
            x.position = 'none';
            return x;
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
            {selectedParameters.length > 0 ? 
                (
                    <>
                    <Box sx={{ width: '100%', height: '90%' }}>
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
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
                            {(1 === 2) && (
                                <Box
                                    sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    bgcolor: "rgba(255, 255, 255, 0.7)",
                                    zIndex: 10,
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </Box>
                    
                    <Box sx={{position: 'relative', height: '30px', marginInline: '10px', marginTop: '20px'}}>
                        <Slider
                            value={localSliderRange}
                            onChange={(event, newValue) => setLocalSliderRange(newValue)}
                            onChangeCommitted={(event, newValue) => {
                                
                                    dispatch(setVisibleDataRange({ cardId: cardId, range: newValue }));
                                
                            }}
                            min={0}
                            max={336}
                            step={1}
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