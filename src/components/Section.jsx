import { useState} from "react";
import LocationInput from "./LocationInput";
import { fetchWeather } from "../utils/fetchWeather";
import { Button, Box, Card, CardHeader, CardContent, CardActions, Typography, Popover, IconButton, Menu, MenuItem } from "@mui/material";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationSearch from "./LocationSearch";
import WeatherCard from "./WeatherCard";
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Section({ pageId, section, deleteSection, onLayoutChange, editMode, addCard, deleteCard }) {
   
    const handleLayoutChange = (newLayout) => {
        onLayoutChange(pageId, section.id, newLayout);
    };

    // Section Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'section-menu' : undefined;

    const handleDelete = () => {
        deleteSection(pageId, section.id);
        handleCloseMenu();
    };

    return (
        <Card sx={{ p: 2, mb: 3 }} variant="outlined" className="w-full" elevation={3}>
            <CardHeader
                title={<Typography variant="h2" className='w-full'>{section.name}</Typography>}
                action={
                    <IconButton
                        aria-describedby={id} 
                        onClick={handleOpenMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
            />
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
                <MenuItem onClick={() => {addCard(pageId, section.id)}}>
                    <AddIcon sx={{ mr: 1}} color="success" />
                    Add a Card
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                    Delete this Section
                </MenuItem>
            </Menu>
            <CardContent>
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={{ lg: section.layout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    isDraggable={editMode}
                    dragHandleClassName={editMode ? ".drag-handle" : ""}
                    isResizable={editMode}
                    autoSize={true}
                    resizeHandles={['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']}
                    onLayoutChange={handleLayoutChange}
                >
                    {section.cards.map((card) => {
                        return (
                            <div key={card.id}>
                                <WeatherCard pageId={pageId} section={section} card={card} deleteCard={deleteCard} editMode={editMode} />
                            </div>
                        );
                    })}
                </ResponsiveReactGridLayout>
            </CardContent>
        </Card>

    );
}


