import { useState, useMemo, useEffect, useRef } from "react";
import { ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot, MarkPlot, ChartsReferenceLine, ChartsAxisHighlight, BarPlot, ChartContainer, LineHighlightPlot  } from "@mui/x-charts";
import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Slider, CircularProgress} from "@mui/material";
import { getUnitAbbreviation } from "../utils/unitAbbreviations";
import { getPrettyParameterName } from "../utils/parameterNames";
import { getDomainLimitByUnit } from "../utils/chartUtils";
import { interpolateRdYlBu, interpolateRdYlGn } from "d3-scale-chromatic";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleDataRange } from "./DashboardSlice";
import { TemperatureGradientIcon, UVIndexIcon, WindGustIcon, VisibilityIcon, CloudCoverIcon, CloudCoverLowIcon, PrecipitationProbabilityIcon, PrecipitationIcon } from "../assets/legendIcons";

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
                strokeDasharray: '1 4'
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
                strokeDasharray: '4 8'
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
    const { yAxes, yAxesFullRange, series, seriesFullRange } = useMemo(() => {
        const orderedSelectedParameters = parameterDrawingOrder.filter(param => selectedParameters.includes(param));

        const yAxes = [];
        const yAxesFullRange = [];
        const series = [];
        const seriesFullRange = [];

        orderedSelectedParameters.forEach((param) => {
            const unit = weather.hourly.weatherVariables[param].unit;
            const axis = {
                id: param,
                position:'none',
                disableLine: true,
                disableTicks: true,
                label: getUnitAbbreviation(unit), 
                labelStyle: { fontSize: 16 },
                tickLabelStyle: {fontSize: 14, fontWeight: 'bold'},
                domainLimit: (minVal, maxVal) => getDomainLimitByUnit(minVal, maxVal, unit),
            }
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

            const seriesItem = {
                    data: getVisibleRange(weather.hourly.weatherVariables[param].values),
                    yAxisId: param, 
                    xAxisId: 'hours',
                    type: 'line',
                    label: (location) => {
                        const unitAbbreviation = getUnitAbbreviation(unit);
                        const name = getPrettyParameterName(param);
                        if(location === 'legend') {
                             if(unitAbbreviation === '') {
                                return `${name}`
                            } else {
                                return `${name} (${unitAbbreviation})`
                            }
                        } else {
                            return `${name}: `
                        }
                    },
                    valueFormatter: (value) => {
                        const unitAbbreviation = getUnitAbbreviation(unit);
                        const rounded = Math.round(value);
                        if(unitAbbreviation === '') {
                            return `${rounded}`;
                        }
                        return `${rounded} ${unitAbbreviation}`;
                    },
                    id: param,
                    showMark: false,
                    shape: 'circle',   
                };
                
                if(param === 'precipitation') {
                    seriesItem.type = 'bar';
                    seriesItem.color = '#0018FF';
                    seriesItem.xAxisId = 'hours-band';
                    seriesItem.valueFormatter = (value) => {
                        const unitAbbreviation = getUnitAbbreviation(unit);
                        const rounded = Math.round(value * 100) / 100;
                        if(unitAbbreviation === '') {
                            return `${rounded}`;
                        }
                        return `${rounded} ${unitAbbreviation}`;
                    };
                }
                if(param === 'precipitation') {
                    seriesItem.labelMarkType = PrecipitationIcon;
                }
                if (param === 'precipitation_probability') {
                    seriesItem.area = 'true';
                    seriesItem.color = 'rgba(155, 223, 250, 0.6)';
                    seriesItem.labelMarkType = PrecipitationProbabilityIcon;
                }
                if (param === 'uv_index') {
                    seriesItem.type = 'bar';
                    seriesItem.xAxisId = 'uv-band';
                    seriesItem.color = '#036837';
                    seriesItem.labelMarkType = UVIndexIcon;
                }
                if(param === 'temperature') {
                    seriesItem.color = '#fce400';
                    seriesItem.labelMarkType = TemperatureGradientIcon;
                }
                if (param === 'cloud_cover') {
                    seriesItem.area = 'true';
                    seriesItem.color = '#C9C9C9';
                    seriesItem.labelMarkType = CloudCoverIcon;
                }
                if (param === 'cloud_cover_low') {
                    seriesItem.area = 'true';
                    seriesItem.color = '#99999980';
                    seriesItem.labelMarkType = CloudCoverLowIcon;
                }
                if (param === 'visibility') {
                    seriesItem.color = '#000';
                    seriesItem.labelMarkType = VisibilityIcon;
                }
                if (param === 'wind_speed') {
                    seriesItem.color = 'red';
                }
                if (param === 'wind_gusts') {
                    seriesItem.color = 'red';
                    seriesItem.labelMarkType = WindGustIcon;
                }
                
                series.push(seriesItem);
                
                const seriesItemFullRange = {
                    ...seriesItem,
                    data: weather.hourly.weatherVariables[param].values,
                }
                seriesFullRange.push(seriesItemFullRange);

        });

        return { yAxes, yAxesFullRange, series, seriesFullRange };
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
    const getDailyLinePositions = (timestamps) => {
        const dailyTimestamps = [];
        let prevDate = null;
        timestamps.forEach(timestamp => {
            const currentDate = new Date(timestamp);
            if (!prevDate || currentDate.getDate() !== prevDate.getDate()) {
                const day = currentDate.toLocaleDateString('en-US', {
                    weekday: 'short'
                });
                dailyTimestamps.push({timestamp: timestamp, day: day});
            }
            prevDate = currentDate;
        });
        return dailyTimestamps;
    };

    const renderedDayReferenceLines = useMemo(() => {
        return getDailyLinePositions(getVisibleRange(weather.hourly.time)).map((timestamp, index) => (
            <ChartsReferenceLine
                key={index}
                x={timestamp.timestamp}
                label={timestamp.day}
                labelAlign="start"
                labelStyle={{fontSize: 14}}
                lineStyle={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '4 4' }}
                disableTooltips={true}
            />
        ));
    }, [weather.hourly.time, visibleDataRange]);

    const fullRangeDayReferenceLines = useMemo(() => {
        return getDailyLinePositions(weather.hourly.time).map((timestamp, index) => (
            <ChartsReferenceLine
                key={index}
                x={timestamp.timestamp}
                label={timestamp.day[0]}
                labelAlign="start"
                labelStyle={{fontSize: 10, fontWeight: 'bold'}}
                spacing={{x:2,y:0}}
                lineStyle={{ stroke: '#a3a3a3', strokeWidth: 2, strokeDasharray: '4 4' }}
                disableTooltips={true}
            />
        ));
    }, [weather.hourly.time]);


    const tooltipAnchorRef = useRef(null);

    return (
        <div className='flex flex-col h-full'>  
            <div style={{width: '100%', height: 'calc(100% - 30px'}} >
                {/* Key needed to avoid bug in MUI library */}
                <ChartDataProvider key={selectedParameters.length} series={series} xAxis={xAxis} yAxis={yAxes}>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <div ref={tooltipAnchorRef} style={{position: 'relative'}}>
                            <ChartsLegend sx={{justifyContent: 'center'}} />
                        </div>
                        <ChartsSurface sx={{width: '100%', flex: '1', marginBottom: '-20px'}}>
                            <AreaPlot skipAnimation />
                            {renderedDayReferenceLines}
                            <LinePlot slotProps={linePlotSlotProps} skipAnimation />
                            <BarPlot slotProps={barPlotSlotProps} skipAnimation />
                            {xAxis.map(axis => <ChartsXAxis key={axis.id} axisId={axis.id} position={axis.position} />)}
                            {yAxes.map(axis => <ChartsYAxis key={axis.id} axisId={axis.id} position={axis.position} label={axis.label} />)}
                            <ChartsAxisHighlight x='line' />
                            <ChartsTooltip anchorEl={tooltipAnchorRef.current} placement="top" container={tooltipAnchorRef.current}
                                sx={{
                                    '& .MuiChartsTooltip-root': {position: 'static', transform: 'none', marginTop: '5px', zIndex: 100},
                                    '& .MuiChartsTooltip-container': {display: 'flex', 'flexWrap': 'wrap'},
                                    '& .MuiChartsTooltip-table caption': {display: 'none'},
                                    '& .MuiChartsTooltip-table tbody': {display: 'flex', flexWrap: 'wrap'},
                                    '& .MuiChartsTooltip-table': {display: 'inline-flex'},

                                }}
                            />
                        </ChartsSurface> 
                    </div>               
                </ChartDataProvider>
            </div>
            <div style={{position: 'relative', height: '30px'}} >
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
                <ChartDataProvider key={selectedParameters.length} series={seriesFullRange} xAxis={xAxisFullRange} yAxis={yAxesFullRange} margin={{top: 3, bottom: 0, left: 5, right: 5}}>                    
                    <ChartsSurface sx={{height: '100%'}}>
                        <AreaPlot skipAnimation />
                        {fullRangeDayReferenceLines}
                        <LinePlot slotProps={linePlotSlotProps} strokeWidth={1} skipAnimation/>
                        <BarPlot slotProps={barPlotSlotProps} strokeWidth={1} skipAnimation />
                    </ChartsSurface>           
                </ChartDataProvider>
            </div>
        </div>
    );
}