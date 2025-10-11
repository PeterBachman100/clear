import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setParameters, deleteCard, setLegendVisibility, setRangeSliderVisibility, setHourlyLabelsVisibility, setLocation } from './DashboardSlice';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box, Button, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LocationSearch from './LocationSearch';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPrettyParameterName, hourlyParameters } from '../utils/parameters';

export default function CardSettings({ cardId, closeCardSettings }) {

    const dispatch = useDispatch();
    const sectionId = useSelector(state => state.dashboard.cards[cardId].sectionId);

    // DELETE
    const handleDeleteCard = () => {
        closeCardSettings();
        dispatch(deleteCard({sectionId: sectionId, cardId: cardId}));
    }

    //PARAMETERS
    const selectedParameters = useSelector(state => state.dashboard.cards[cardId].selectedParameters);
    const handleSetParameters = (event) => {
        const { target: { value } } = event;
        const newParams = (typeof value === 'string' ? value.split(',') : value);
        dispatch(setParameters({cardId: cardId, selectedParameters: newParams}));
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

    // LOCATION
    const handleSetLocation = (newLocation) => {
        handleCloseDialog();
        dispatch(setLocation({ itemCategory: 'cards', itemId: sectionId, location: newLocation }));
    };
    // Location Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {setDialogOpen(false)};

   
    

   return (
    <>
    <Box sx={{padding: '16px', display: 'flex', justifyContent: 'center'}}>
        <FormControlLabel control={<Switch checked={isLegendVisible} onChange={toggleLegendVisibility} color='secondary'/>} label="Legend" />
        <FormControlLabel control={<Switch checked={isRangeSliderVisible} onChange={toggleRangeSliderVisibility} color='secondary'/>} label="Range Slider" />
        <FormControlLabel control={<Switch checked={isHourlyLabelsVisible} onChange={toggleHourlyLabelsVisibility} color='secondary'/>} label="Hourly Labels" />
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="multiple-select-label">Parameters</InputLabel>
            <Select
                labelId="multiple-select-label"
                id="multiple-select"
                multiple
                value={selectedParameters}
                onChange={handleSetParameters}
                renderValue={() => 'Select Parameters'}
            >
                {hourlyParameters.map((param) => (
                    <MenuItem key={param} value={param}>
                        <Checkbox checked={selectedParameters.includes(param)} color='secondary' />
                        <ListItemText primary={getPrettyParameterName(param)} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Button onClick={() => {handleOpenDialog()}} color='secondary' variant='outlined'>Set Card Location</Button>
        <Button onClick={handleDeleteCard} color='error' variant='outlined'><DeleteIcon /> Delete Card</Button>
        
    </Box>
    <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
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
            <Button onClick={handleCloseDialog} variant="outlined" color="error">
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
    </>
   );
}