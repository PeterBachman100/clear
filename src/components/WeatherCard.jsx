import { useState } from "react";
import Graph from './Graph';
import { Card, CardHeader, IconButton, Menu, MenuItem, CardContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteCard } from "./DashboardSlice";
import { useDispatch } from "react-redux";

export default function WeatherCard({ pageId, weather, sectionId, card, editMode }) {

    const dispatch = useDispatch();

    //CARD
    const handleDeleteCard = () => {
        dispatch(deleteCard({pageId, sectionId: sectionId, cardId: card.id}));
        handleCloseMenu();
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
    const id = open ? 'card-menu' : undefined;

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
                <MenuItem onClick={handleDeleteCard}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" />
                    Delete this card
                </MenuItem>
            </Menu>
            <CardContent className="p-1 h-full">
                <div className='w-full h-full'>
                    {weather? 
                        <Graph weather={weather} parametersVisible={parametersVisible} pageId={pageId} sectionId={sectionId} cardId={card.id} editMode={editMode} /> :
                        <div>No Weather Data</div>
                    }
                </div>
            </CardContent>
        </Card>
    );
}