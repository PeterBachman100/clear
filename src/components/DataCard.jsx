import { useState } from "react";
import Graph from './Graph';
import { Card, CardHeader, IconButton, Menu, MenuItem, CardContent, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { deleteCard } from "./DashboardSlice";
import { useDispatch } from "react-redux";

export default function WeatherCard({ pageId, weather, sectionId, cardId, cardData, editMode, openCardSettings, isBeingEdited }) {

    return (
        <Card className={`h-full flex flex-col`} sx={isBeingEdited ? { boxShadow: '0 0 0 5px #ffd4d2' } : null} elevation={3}>
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
            <CardContent className="p-1 h-full">
                <div className='w-full h-full'>
                    {weather? 
                        <Graph weather={weather} pageId={pageId} sectionId={sectionId} cardId={cardId} cardData={cardData} editMode={editMode} /> :
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <Typography variant="h2">No weather data</Typography>
                            <p>It could be any of the following:</p>
                            <ul>
                                <li>- A Location has not been selected</li>
                                <li>- Data is currently loading</li>
                                <li>- Data failed to load</li>
                            </ul>
                            
                        </div>
                    }
                </div>
            </CardContent>
        </Card>
    );
}