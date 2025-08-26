import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import Graph from './Graph';
import { Button, Box, Popover, Card, CardHeader, Typography, CardActions, IconButton, Menu, MenuItem, TextField, CardContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function WeatherCard({ pageId, weather, setSelectedParameters, section, card, deleteCard, editMode }) {

    

    // Card Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'card-menu' : undefined;

    const handleDelete = () => {
        deleteCard(pageId, section.id, card.id);
        handleCloseMenu();
    };

    //Graph Parameter Visibility
    const [parametersVisible, setParametersVisible] = useState(false);
    const handleToggleParameterVisbility = () => {
        setParametersVisible(!parametersVisible);
        handleCloseMenu();
    }


    return (
        <Card className="h-full flex flex-col" elevation={3}>
            <CardHeader 
                action={
                    <IconButton
                        aria-describedby={id} 
                        onClick={handleOpenMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
                sx={{flexDirection: 'row-reverse', p:1, position: 'absolute', right: 0}}
            ></CardHeader> 
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
                <MenuItem onClick={handleToggleParameterVisbility}>
                    {parametersVisible ? <><VisibilityOffOutlinedIcon sx={{ mr: 1 }} />Hide Parameters</> : <><VisibilityOutlinedIcon sx={{ mr: 1 }} />Select Parameters</>}
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" />
                    Delete this card
                </MenuItem>
            </Menu>
            <CardContent className="grow" sx={{ p:1, '&:last-child': { paddingBottom: 1 } }}>
                {weather? 
                    <Graph weather={weather} selectedParameters={card.selectedParameters} setSelectedParameters={setSelectedParameters} parametersVisible={parametersVisible} pageId={pageId} section={section} card={card} /> :
                    <div>No Weather Data</div>
                }
            </CardContent>
        </Card>
    );
}