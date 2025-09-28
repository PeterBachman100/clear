import { useEffect } from 'react';
import Graph from './Graph';
import { Card, CardHeader, IconButton, Menu, MenuItem, CardContent, Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from "react-redux";
import { selectWeatherByLocation } from "../utils/selectors";

export default function WeatherCard({ pageId, sectionId, cardId, cardData, editMode, openCardSettings, isBeingEdited }) {

    // LOCATION and WEATHER
    const location = useSelector((state) => state.dashboard.pages[pageId].location);
    const weatherState = useSelector(state => selectWeatherByLocation(state, location));

    const weather = weatherState?.data;

    const renderContent = () => {
        if (weatherState?.status === 'pending') {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <Typography variant="h2">Loading weather data...</Typography>
                </div>
            );
        }

        if (weatherState?.status === 'rejected') {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <Typography variant="h2">Error loading data</Typography>
                    <p>{weatherState.error}</p>
                </div>
            );
        }

        if (weatherState?.status === 'fulfilled' && weather) {
            return <Graph weather={weather} pageId={pageId} sectionId={sectionId} cardId={cardId} cardData={cardData} editMode={editMode} />;
        }

        // Fallback for initial render or no location
        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <Typography variant="h2">No weather data</Typography>
                <p>A location has not been selected for this page.</p>
            </div>
        );
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
                sx={{flexDirection: 'row-reverse', p:1, position: 'absolute', right: 0}}
            ></CardHeader>
            <CardContent sx={{height: '100%', padding: '24px 8px 8px 8px !important'}}>
                <div className='w-full h-full'>
                    {renderContent()}
                </div>
            </CardContent>
        </Card>
    );

}