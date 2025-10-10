import { useEffect } from 'react';
import Graph from './Graph';
import { Card, CardHeader, IconButton, CardContent, Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { useDispatch, useSelector } from "react-redux";
import { getWeather } from "../utils/weatherThunk";
import { selectCardLocationId } from "../utils/selectors";

export default function DataCard({ pageId, sectionId, cardId, editMode, openCardSettings, isBeingEdited }) {

    const dispatch = useDispatch();
    
    // LOCATION
    const locationId = useSelector(state => selectCardLocationId(state, cardId));
    const location = useSelector((state) => state.dashboard.locations[locationId]);

    // WEATHER
    const weatherState = useSelector((state) => state.weather[locationId]);
    useEffect(() => {
        if(locationId) {
            dispatch(getWeather(locationId));
        }
    }, [dispatch, locationId]);
    
    

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
                return <Graph weather={weatherState.data} pageId={pageId} sectionId={sectionId} cardId={cardId} />;
            }
        }
        
        else {
            return (
                <Typography variant="h2">No weatherState</Typography>
            )
        }
    };

    return (
        <Card className={`h-full flex flex-col !overflow-visible`} sx={isBeingEdited ? { boxShadow: '0 0 0 5px #ffd4d2' } : null} elevation={3}>
            <CardHeader
                action={
                    <IconButton
                        aria-describedby={cardId}
                        onClick={() => {
                            openCardSettings(cardId);
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                }
                subheader={<><LocationPinIcon /> {location?.name}</>}
                sx={{width: '100%', p:0, position: 'absolute', justifyContent: 'space-between', fontSize: '1rem'}}
            ></CardHeader>
            <CardContent sx={{height: '100%', padding: '32px 8px 8px 8px !important'}}>
                <div className='w-full h-full'>
                    {renderContent()}
                </div>
            </CardContent>
        </Card>
    );

}