import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import Graph from './Graph';
import { Button, Box, Popover, Card, CardHeader, Typography, CardActions, IconButton, Menu, MenuItem, TextField, CardContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function WeatherCard({ pageId, weather, section, card, deleteCard, updateCardName, editMode }) {

    

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

    // Card Name
    const [editingCardName, setEditingCardName] = useState(false);
    const [cardName, setCardName] = useState(card.name);

    const handleNameChange = (e) => {
        setCardName(e.target.value);
    };

    const handleCardNameChange = () => {
        updateCardName(pageId, section.id, card.id, cardName);
        setEditingCardName(false);
    }

    const [showName, setShowName] = useState(true);
    const handleToggleNameVisibility = () => {
        setShowName(!showName);
        handleCloseMenu();
    };

    return (
        <Card className="h-full flex flex-col" elevation={3}>
            <CardHeader 
                title={
                        editingCardName ?
                            <div className="flex gap-4">
                                <TextField
                                    label={"Page Name"}
                                    variant="outlined"
                                    value={cardName}
                                    onChange={handleNameChange}
                                /> 
                                <Button onClick={handleCardNameChange} variant="outlined" color="success">Save</Button>
                                <Button onClick={() => {setEditingCardName(false)}} variant="outlined" color="error">Cancel</Button>
                                </div>
                            :
                            <>{showName && <Typography variant="overline">{card.name}</Typography>}</>
                        }
                action={
                    <IconButton
                        aria-describedby={id} 
                        onClick={handleOpenMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
                sx={{flexDirection: 'row-reverse', p:1}}
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
                <MenuItem onClick={() => {
                    setEditingCardName(true);
                    handleCloseMenu();
                    }}>
                    <EditOutlinedIcon sx={{ mr: 1}} />
                    Update Card Name
                </MenuItem>
                <MenuItem onClick={handleToggleNameVisibility}>
                    {showName ? <><VisibilityOffOutlinedIcon sx={{ mr: 1 }} />Hide name</> : <><VisibilityOutlinedIcon sx={{ mr: 1 }} />Show name</>}
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" />
                    Delete this card
                </MenuItem>
            </Menu>
            <CardContent className="grow" sx={{ p:1, '&:last-child': { paddingBottom: 1 } }}>
                {weather? 
                    <Graph weather={weather} /> :
                    <div>No Weather Data</div>
                }
            </CardContent>
        </Card>
    );
}