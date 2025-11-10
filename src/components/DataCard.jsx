import { useEffect, useState } from 'react';
import Graph from './Graph';
import Daily from './Daily';
import { Card, CardHeader, CardActions, IconButton, CardContent, Typography, FormControl, InputLabel, Select, Menu, MenuItem, Checkbox, ListItemText, Box, Button, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import LocationSearch from './LocationSearch';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { useDispatch, useSelector } from "react-redux";
import { setHourlyParameters, setDailyParameters, deleteCard, setLegendVisibility, setRangeSliderVisibility, setHourlyLabelsVisibility, setLocation, setReferenceLinesVisibility, setLocationVisibility, setTimeScale } from './DashboardSlice';
import { getWeather } from "../utils/weatherThunk";
import { selectCardLocationId } from "../utils/selectors";
import { getPrettyParameterName, hourlyParameters, dailyParameters, timeScales } from '../utils/parameters';
import { EditLocationOutlined as EditLocationOutlinedIcon } from '@mui/icons-material';

export default function DataCard({ pageId, sectionId, cardId }) {

    const dispatch = useDispatch();

    const editMode = useSelector(state => state.dashboard.pages[pageId].editMode);
    
    // LOCATION
    const locationId = useSelector(state => selectCardLocationId(state, cardId));
    const location = useSelector((state) => state.dashboard.locations[locationId]);

    // LOCATION
    const handleSetLocation = (newLocation) => {
        dispatch(setLocation({ itemCategory: 'cards', itemId: cardId, location: newLocation }));
        handleCloseDialog();
    };
    // Location Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {setDialogOpen(false)};

    // WEATHER
    const weatherState = useSelector((state) => state.weather[locationId]);
    useEffect(() => {
        if(locationId) {
            dispatch(getWeather(locationId));
        }
    }, [dispatch, locationId]);

    // DELETE
    const handleDeleteCard = () => {
        dispatch(deleteCard({sectionId: sectionId, cardId: cardId}));
    }

    // HOURLY PARAMETERS
    const selectedHourlyParameters = useSelector(state => state.dashboard.cards[cardId].selectedHourlyParameters);
    const handleSetHourlyParameters = (event) => {
        const { target: { value } } = event;
        const newParams = (typeof value === 'string' ? value.split(',') : value);
        dispatch(setHourlyParameters({cardId: cardId, selectedHourlyParameters: newParams}));
    }

    // DAILY PARAMETERS
    const selectedDailyParameters = useSelector(state => state.dashboard.cards[cardId].selectedDailyParameters);
    const handleSetDailyParameters = (event) => {
        const {target: {value}} = event;
        const newParams = (typeof value === 'string' ? value.split(',') : value);
        dispatch(setDailyParameters({cardId, selectedDailyParameters: newParams}));
    }

    // LEGEND
    const isLegendVisible = useSelector(state => state.dashboard.cards[cardId].legendVisible);
    const toggleLegendVisibility = (event) => {
        dispatch(setLegendVisibility({cardId, visible: event.target.checked}));
    }

    // RANGE SLIDER
    const isRangeSliderVisible = useSelector(state => state.dashboard.cards[cardId].rangeSliderVisible);
    const toggleRangeSliderVisibility = (event) => {
        dispatch(setRangeSliderVisibility({cardId, visible: event.target.checked}));
    }

    // HOURLY LABELS
    const isHourlyLabelsVisible = useSelector(state => state.dashboard.cards[cardId].hourlyLabelsVisible);
    const toggleHourlyLabelsVisibility = (event) => {
        dispatch(setHourlyLabelsVisibility({cardId, visible: event.target.checked}));
    }

    // REFERENCE LINES
    const isReferenceLinesVisible = useSelector(state => state.dashboard.cards[cardId].referenceLinesVisible);
    const toggleReferenceLinesVisibility = (event) => {
        dispatch(setReferenceLinesVisibility({cardId, visible: event.target.checked}));
    }

    // LOCATION LABEL
    const isLocationVisible = useSelector(state => state.dashboard.cards[cardId].locationVisible);
    const toggleLocationVisibility = (event) => {
        dispatch(setLocationVisibility({category: 'cards', id: cardId, visible: event.target.checked}));
    }

    // TIMESCALE
    const timeScale = useSelector(state => state.dashboard.cards[cardId].timeScale);
    const handleSetTimeScale = (event) => {
        const { target: { value } } = event;
        dispatch(setTimeScale({cardId, timeScale: value}));
    }

    // Card Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'section-menu' : undefined;
    

    const renderContent = () => {
        if (weatherState) {
            if (weatherState.status === 'pending') {
                return (
                    <Typography variant="h2">weatherState status: pending</Typography>
                );
            }

            if (weatherState.status === 'rejected') {
                return (
                    <Typography variant="h2">weatherState status: rejected</Typography>
                );
            }

            if (weatherState.status === 'fulfilled') {
                if (timeScale === "Hourly") {
                    return <Graph weather={weatherState.data} pageId={pageId} sectionId={sectionId} cardId={cardId} />;
                } 
                else if (timeScale === "Daily") {
                    return <Daily weather={weatherState.data} pageId={pageId} sectionId={sectionId} cardId={cardId} />;
                }
                else {
                    return "Time Scale selection Error";
                }
            }
        }
        
        else {
            return (
                <Typography variant="h2">No weatherState</Typography>
            )
        }
    };

    const isHeaderHidden = !(editMode || isLocationVisible);
    const dragHandle = editMode ? (
        <div className='absolute w-full h-full grid items-center justify-center z-10 bg-black/70'>
            <OpenWithIcon className="draggableHandle cursor-pointer" fontSize='medium' />
        </div>
        ) : null;    
    
    return (
        <>
        <Card className={`h-full flex flex-col bg-black`}>
            {!isHeaderHidden && <CardHeader
                title={isLocationVisible && <div className='text-sm'><LocationPinIcon /> {location?.name}</div>}
                action={editMode && <IconButton onClick={handleOpenMenu}><MoreVertIcon /></IconButton>}
                sx={{width: '100%', p:1, position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', fontSize: '1rem', backgroundColor: 'black'}}
            ></CardHeader>}
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem>
                    <FormControlLabel control={<Switch checked={isLegendVisible} onChange={toggleLegendVisibility} color='secondary'/>} label="Legend" />
                </MenuItem>
                <MenuItem>
                    <FormControlLabel control={<Switch checked={isRangeSliderVisible} onChange={toggleRangeSliderVisibility} color='secondary'/>} label="Range Slider" />
                </MenuItem>
                <MenuItem>
                    <FormControlLabel control={<Switch checked={isHourlyLabelsVisible} onChange={toggleHourlyLabelsVisibility} color='secondary'/>} label="Hourly Labels" />
                </MenuItem>
                <MenuItem>
                    <FormControlLabel control={<Switch checked={isReferenceLinesVisible} onChange={toggleReferenceLinesVisibility} color='secondary'/>} label="Day Reference Lines" />
                </MenuItem>
                <MenuItem>
                    <FormControlLabel control={<Switch checked={isLocationVisible} onChange={toggleLocationVisibility} color='secondary'/>} label="Location Label" />
                </MenuItem>
                <MenuItem>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="timeScale-select-label">Time Scale</InputLabel>
                        <Select 
                            labelId="timeScale-select-label"
                            id="timeScale-select"
                            value={timeScale}
                            onChange={handleSetTimeScale}
                            renderValue={(timeScale) => timeScale}
                        >
                            {timeScales.map((scale) => (
                                <MenuItem key={scale} value={scale}>
                                    <Checkbox checked={timeScale === scale} color='secondary' />
                                    <ListItemText primary={scale} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>
                {(timeScale === "Hourly") && 
                    <MenuItem>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="hourlyParameters-select-label">Hourly Parameters</InputLabel>
                            <Select
                                labelId="hourlyParameters-select-label"
                                id="hourlyParameters-select"
                                multiple
                                value={selectedHourlyParameters}
                                onChange={handleSetHourlyParameters}
                                renderValue={() => 'Select Hourly Parameters'}
                            >
                                {hourlyParameters.map((param) => (
                                    <MenuItem key={param} value={param}>
                                        <Checkbox checked={selectedHourlyParameters.includes(param)} color='secondary' />
                                        <ListItemText primary={getPrettyParameterName(param)} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </MenuItem>
                }
                {(timeScale === "Daily") &&
                    <MenuItem>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="dailyParameters-select-label">Daily Parameters</InputLabel>
                            <Select
                                labelId="dailyParameters-select-label"
                                id="dailyParameters-select"
                                multiple
                                value={selectedDailyParameters}
                                onChange={handleSetDailyParameters}
                                renderValue={() => 'Select Daily Parameters'}
                            >
                                {dailyParameters.map((param) => (
                                    <MenuItem key={param} value={param}>
                                        <Checkbox checked={selectedDailyParameters.includes(param)} color='secondary' />
                                        <ListItemText primary={getPrettyParameterName(param)} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </MenuItem>
                }
                <MenuItem onClick={() => {
                    handleOpenDialog()
                    handleCloseMenu();
                }
                }>
                    <EditLocationOutlinedIcon sx={{ mr: 1 }} />
                    Set Card Location
                </MenuItem>
                <MenuItem onClick={handleDeleteCard}>
                    <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                    Delete this Card
                </MenuItem>
            </Menu>
            <CardContent sx={{height: '100%', padding: () => `${isHeaderHidden ? '8px' : '32px'} 8px 8px 8px !important`, backgroundColor: 'black'}}>
                <div className='w-full h-full relative'>
                    {dragHandle}
                    {renderContent()}
                </div>
            </CardContent>
        </Card>
        <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth 
            maxWidth="lg"
        >
            <DialogTitle id="dialog-title">
                {"Set Card Location"}
            </DialogTitle>
            <DialogContent>
                <LocationSearch onSelect={handleSetLocation} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleSetLocation(null)} variant="outlined" color="secondary">Set to "Null"</Button>
                <Button onClick={handleCloseDialog} variant="outlined" color="error">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );

}

        