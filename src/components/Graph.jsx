import { useState, useMemo, useEffect, useRef } from "react";
import { ChartDataProvider, ChartsLegend, ChartsSurface, ChartsXAxis, ChartsYAxis, ChartsTooltip, LinePlot, AreaPlot, ChartsReferenceLine, ChartsAxisHighlight, BarPlot  } from "@mui/x-charts";
import { Slider } from "@mui/material";
import { getUnitAbbreviation, getDomainLimitByUnit, parameterDrawingOrder, linePlotSlotProps, barPlotSlotProps, sliderBarPlotSlotProps } from "../utils/chartUtils";
import { getPrettyParameterName } from "../utils/parameters";
import { interpolateRdYlGn, interpolateTurbo, interpolateRdYlBu } from "d3-scale-chromatic";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleDataRange } from "./DashboardSlice";
import { TemperatureGradientIcon, UVIndexIcon, WindGustIcon, VisibilityIcon, CloudCoverIcon, PrecipitationProbabilityIcon, PrecipitationIcon } from "../assets/legendIcons";

const convertTimestampsToDateObjects = (timestamps) => {
    return timestamps.map(timestamp => new Date(timestamp * 1000));
}

const convertDateToTimezoneBasedString = (date, timezone) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        timeZone: timezone,
    });
    return formatter.format(date);
}


export default function Graph({ weather, cardId }) {

    const dispatch = useDispatch();

    const selectedParameters = useSelector((state) => state.dashboard.cards[cardId].selectedParameters);
    const visibleDataRange = useSelector((state) => state.dashboard.cards[cardId].visibleDataRange);
    const isLegendVisible = useSelector(state => state.dashboard.cards[cardId].legendVisible);
    const isRangeSliderVisible = useSelector(state => state.dashboard.cards[cardId].rangeSliderVisible);
    const isHourlyLabelsVisible = useSelector(state => state.dashboard.cards[cardId].hourlyLabelsVisible);
    const isReferenceLinesVisible = useSelector(state => state.dashboard.cards[cardId].referenceLinesVisible);

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
            if (unit === '°F') {
                axis.colorMap = {
                        type: 'continuous',
                        min: 0,
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
                    data: getVisibleRange(weather.hourly.weatherVariables[param].data),
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
                };
                
                if(param === 'precipitation') {
                    seriesItem.type = 'bar';
                    seriesItem.color = '#58b0db';
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
                    seriesItem.color = 'url(#precipitationProbabilityGradient)';
                    seriesItem.labelMarkType = PrecipitationProbabilityIcon;
                }
                if (param === 'uv_index') {
                    seriesItem.type = 'bar';
                    seriesItem.xAxisId = 'uv-band';
                    seriesItem.color = '#036837';
                    seriesItem.labelMarkType = UVIndexIcon;
                }
                if(param === 'temperature_2m') {
                    seriesItem.color = '#fce400';
                    seriesItem.labelMarkType = TemperatureGradientIcon;
                }
                if (param === 'cloud_cover') {
                    seriesItem.area = 'true';
                    seriesItem.color = 'url(#cloudCoverGradient)';
                    seriesItem.labelMarkType = CloudCoverIcon;
                }
                if (param === 'visibility') {
                    seriesItem.color = '#FFF';
                    seriesItem.labelMarkType = VisibilityIcon;
                }
                if (param === 'wind_speed_10m') {
                    seriesItem.color = 'red';
                }
                if (param === 'wind_gusts_10m') {
                    seriesItem.color = 'red';
                    seriesItem.labelMarkType = WindGustIcon;
                }
                
                series.push(seriesItem);
                
                const seriesItemFullRange = {
                    ...seriesItem,
                    data: weather.hourly.weatherVariables[param].data,
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
                position: isHourlyLabelsVisible ? 'bottom' : 'none',
                domainLimit: 'strict',
                disableLine: true,
                disableTicks: true,
                tickLabelStyle: { fontWeight: 200, fontSize: '10px' },
                sx: {
                    '& .MuiChartsAxis-tickLabel': {
                        fill: '#a2a2a3 !important',
                    }
                },
                tickMinStep: (1000 * 60 * 60), // 1 hour
                data: convertTimestampsToDateObjects(getVisibleRange(weather.hourly.time)),
                valueFormatter: date => convertDateToTimezoneBasedString(date, weather.location.timezone),
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
            x.data = convertTimestampsToDateObjects(weather.hourly.time);
            x.position = 'none';
            return x;
        });

        return { xAxis, xAxisFullRange };
    }, [weather.hourly.time, visibleDataRange, isHourlyLabelsVisible]);
    // end memo-ized x axes
    
    // DAY REFERENCE LINES
    const getDayStarts = (timestamps) => {
        const dayStartTimestamps = [];
        let prevDay = null;

        const dayFormatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            timeZone: weather.location.timezone,
        });

        timestamps.forEach(timestamp => {
            const date = new Date(timestamp * 1000);
            const currentDay = dayFormatter.format(date);

            if (!prevDay || currentDay !== prevDay) {
                dayStartTimestamps.push({date: date, day: currentDay});
            }
            prevDay = currentDay;
        });
        return dayStartTimestamps;
    };

    const dayReferenceLines = useMemo(() => {
        return getDayStarts(getVisibleRange(weather.hourly.time)).map((timestamp, index) => (
            <ChartsReferenceLine
                key={index}
                x={timestamp.date}
                xAxisId="hours"
                label={timestamp.day.slice(0,3)}
                labelAlign="start"
                labelStyle={{fontSize: 14, fontWeight: 400}}
                spacing={{x:0,y:-18}}
                lineStyle={{ stroke: '#454545', strokeWidth: 1}}
                disableTooltips={true}
            />
        ));
    }, [weather.hourly.time, visibleDataRange]);

    const fullRangeDayReferenceLines = useMemo(() => {
        return getDayStarts(weather.hourly.time).map((timestamp, index) => (
            <ChartsReferenceLine
                key={index}
                x={timestamp.date}
                xAxisId="hours"
                label={timestamp.day[0]}
                labelAlign="start"
                labelStyle={{fontSize: 10, fontWeight: 'bold'}}
                spacing={{x:2,y:0}}
                lineStyle={{ stroke: '#949292', strokeWidth: 1}}
                disableTooltips={true}
            />
        ));
    }, [weather.hourly.time]);


    const tooltipAnchorRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    useEffect(() => {
        if (tooltipAnchorRef.current) {
        setAnchorEl(tooltipAnchorRef.current);
        }
    }, [tooltipAnchorRef.current]);

    return (
        <div className='flex flex-col h-full'>  
            <div style={{width: '100%', flex: '1', height: 'calc(100% - 30px'}} >
                {/* Key needed to avoid bug in MUI library */}
                <ChartDataProvider key={selectedParameters.length} series={series} xAxis={xAxis} yAxis={yAxes} margin={isHourlyLabelsVisible? {bottom: 0, left: 12, right: 16, top: 20} : {bottom: 0, left: 0, right: 0, top: 20}}>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <div ref={tooltipAnchorRef} style={{position: 'relative'}}>
                            {isLegendVisible && <ChartsLegend sx={{justifyContent: 'center'}} />}
                        </div>
                        <ChartsSurface sx={{width: '100%', flex: '1',}}>
                            <defs> 
                                <linearGradient id="precipitationProbabilityGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop 
                                        offset="0%" 
                                        stopColor="#1fdaff" 
                                        stopOpacity={0.3} 
                                    /> 
                                    <stop 
                                        offset="100%" 
                                        stopColor="#1fdaff" 
                                        stopOpacity={0.1} 
                                    /> 
                                </linearGradient>
                                <linearGradient id="cloudCoverGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop 
                                        offset="0%" 
                                        stopColor="#545454" 
                                        stopOpacity={1} 
                                    /> 
                                    <stop 
                                        offset="100%" 
                                        stopColor="#545454" 
                                        stopOpacity={0.1} 
                                    /> 
                                </linearGradient>
                            </defs>
                            <AreaPlot skipAnimation />
                            <BarPlot slotProps={barPlotSlotProps} skipAnimation />
                            <LinePlot slotProps={linePlotSlotProps} skipAnimation />
                            {isReferenceLinesVisible && dayReferenceLines}
                            {xAxis.map(axis => <ChartsXAxis key={axis.id} axisId={axis.id} position={axis.position} />)}
                            {yAxes.map(axis => <ChartsYAxis key={axis.id} axisId={axis.id} position={axis.position} label={axis.label} />)}
                            
                            <ChartsAxisHighlight x='line' />
                            {tooltipAnchorRef.current &&
                                <ChartsTooltip anchorEl={anchorEl} placement="top"
                                    sx={{
                                        '& .MuiChartsTooltip-root': {position: 'static', transform: 'none', marginTop: '5px', zIndex: 100},
                                        '& .MuiChartsTooltip-container': {display: 'flex', 'flexWrap': 'wrap'},
                                        '& .MuiChartsTooltip-table caption': {fontWeight: 900},
                                        '& .MuiChartsTooltip-table tbody': {display: 'flex', flexWrap: 'wrap'},
                                        '& .MuiChartsTooltip-table': {display: 'inline-flex'},

                                    }}
                                />
                            }
                        </ChartsSurface> 
                    </div>               
                </ChartDataProvider>
            </div>
            {isRangeSliderVisible &&
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
                        <ChartsSurface sx={{height: '95%'}}>
                            <AreaPlot skipAnimation />
                            <BarPlot slotProps={sliderBarPlotSlotProps} strokeWidth={1} skipAnimation />
                            <LinePlot slotProps={linePlotSlotProps} strokeWidth={1} skipAnimation/>
                            {fullRangeDayReferenceLines}
                        </ChartsSurface>           
                    </ChartDataProvider>
                </div>
            }
        </div>
    );
}