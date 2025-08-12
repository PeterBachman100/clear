import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, Popover, Card, CardHeader, Typography, CardActions, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import OpenWithIcon from '@mui/icons-material/OpenWith';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function WeatherCard({ pageId, section, card, deleteCard, updateCardName, editMode }) {

    

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

    return (
        <Card className="h-full" elevation={3}>
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
                            <Typography variant="h3">{card.name}</Typography>
                        }
                action={
                    <IconButton
                        aria-describedby={id} 
                        onClick={handleOpenMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
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
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" />
                    Delete this card
                </MenuItem>
            </Menu>
        </Card>
    );
}