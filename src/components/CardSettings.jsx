import React, { useTransition } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setParameters, deleteCard } from './DashboardSlice';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CardSettings({ cardId, weather, closeCardSettings }) {

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
    const hourlyParams = Object.keys(weather.hourly.weatherVariables);

    

   return (
    <Box sx={{padding: '16px', display: 'flex', justifyContent: 'center'}}>
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
        <Button onClick={handleDeleteCard} color='error' variant='outlined'><DeleteIcon /> Delete Card</Button>
    </Box>
   );
}