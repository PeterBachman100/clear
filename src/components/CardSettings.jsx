import { useSelector, useDispatch } from 'react-redux';
import { setParameters, deleteCard, setLegendVisibility } from './DashboardSlice';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box, Button, FormControlLabel, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPrettyParameterName } from '../utils/parameterNames';

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

    // LEGEND
    const isLegendVisible = useSelector(state => state.dashboard.cards[cardId].legendVisible);
    const toggleLegendVisibility = (event) => {
        dispatch(setLegendVisibility({cardId, visible: event.target.checked}));
    }
   
    

   return (
    <Box sx={{padding: '16px', display: 'flex', justifyContent: 'center'}}>
        <FormControlLabel control={<Switch checked={isLegendVisible} onChange={toggleLegendVisibility} color='secondary'/>} label="Legend" />
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
                {hourlyParams.map((param) => (
                    <MenuItem key={param} value={param}>
                        <Checkbox checked={selectedParameters.includes(param)} color='secondary' />
                        <ListItemText primary={getPrettyParameterName(param)} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Button onClick={handleDeleteCard} color='error' variant='outlined'><DeleteIcon /> Delete Card</Button>
        
    </Box>
   );
}