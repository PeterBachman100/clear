import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, Popover, Card, CardHeader, Typography, CardActions, IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function WeatherCard({ pageId, section, card, deleteCard, editMode }) {

    

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

    return (
        <Card className="h-full" elevation={3}>
            <CardHeader title={<Typography variant="h3">{card.name}</Typography>}
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
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" />
                    Delete this card
                </MenuItem>
            </Menu>
        </Card>
    );
}