import { useState, useEffect } from "react";
import Section from "./Section";
import LocationInput from "./LocationInput";
import LocationSearch from "./LocationSearch";
import { fetchWeather } from "../utils/fetchWeather";
import { Box, Typography, Divider, Button, Card, CardHeader, CardContent, IconButton, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
      
export default function Page({ page, setLocation, setSelectedParameters, updatePageName, updateSectionName, updateCardName, editMode, toggleEditMode, onLayoutChange, deletePage, addSection, deleteSection, addCard, deleteCard }) {

    // Page Menu
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
        deletePage(page.id);
        handleCloseMenu();
    };

    // Page Name
    const [editingPageName, setEditingPageName] = useState(false);
    const [pageName, setPageName] = useState(page.name);

    const handleNameChange = (e) => {
        setPageName(e.target.value);
    };

    const handlePageNameChange = () => {
        updatePageName(page.id, pageName);
        setEditingPageName(false);
    }

    const [showName, setShowName] = useState(true);
    const handleToggleNameVisibility = () => {
        setShowName(!showName);
        handleCloseMenu();
    };


    // Weather
    const [weather, setWeather] = useState(null);
    const handleFetchWeather = async () => {
        try {
            const weatherData = await fetchWeather(page.location);
            setWeather(weatherData);
        } catch(error) {
            console.error("Failed to fetch weather data:", error);
        } 
    }
    useEffect(() => {
        handleFetchWeather();
    }, []);


    // Location Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
        handleCloseMenu();
    };
    const handleCloseDialog = () => {setDialogOpen(false)};

    return (
        <>
        <Card className='w-full min-h-screen'>
            <CardHeader
                title={
                    editingPageName ?
                        <div className="flex gap-4">
                            <TextField
                                label={"Page Name"}
                                variant="outlined"
                                value={pageName}
                                onChange={handleNameChange}
                            /> 
                            <Button onClick={handlePageNameChange} variant="outlined" color="success">Save</Button>
                            <Button onClick={() => {setEditingPageName(false)}} variant="outlined" color="error">Cancel</Button>
                         </div>
                        :
                        <>{showName && <Typography variant="h1">{page.name}</Typography>}</> 
                }
                action={
                    <IconButton
                        aria-describedby={id} 
                        onClick={handleOpenMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
                sx={{p:1, textAlign: 'center', flexDirection: 'row-reverse'}}
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
                <MenuItem onClick={() => {handleOpenDialog()}}>
                    <EditLocationOutlinedIcon sx={{ mr: 1 }} />
                    Set Location
                </MenuItem>
                <MenuItem onClick={() => addSection(page.id)}>
                    <AddIcon sx={{ mr: 1}} color="success" />
                    Add a Section
                </MenuItem>
                <MenuItem onClick={() => {
                    toggleEditMode(page.id);
                    handleCloseMenu();
                }}>
                    <ViewComfyIcon sx={{ mr: 1}} />
                    {editMode ? 'Save Layout' : 'Edit Layout'}
                </MenuItem>
                <MenuItem onClick={() => {
                    setEditingPageName(true);
                    handleCloseMenu();
                    }}>
                    <EditOutlinedIcon sx={{ mr: 1}} />
                    Update Page Name
                </MenuItem>
                <MenuItem onClick={handleToggleNameVisibility}>
                    {showName ? <><VisibilityOffOutlinedIcon sx={{ mr: 1 }} />Hide name</> : <><VisibilityOutlinedIcon sx={{ mr: 1 }} />Show name</>}
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                    Delete this Page
                </MenuItem>
            </Menu>
            <CardContent sx={{p:0, display: 'flex', flexDirection: 'column'}}>
                {page.sections.length === 0 ? <p>This page is empty. Edit the layout to add a section!</p> : ''}
                {editMode && <Button variant="outlined" color="success" onClick={() => {
                        toggleEditMode(page.id);
                        handleCloseMenu();
                    }}>
                        Save Layout
                    </Button>
                }
                <div>
                    {page.sections.map((section) => {
                        return (
                            <Section key={section.id} weather={weather} setSelectedParameters={setSelectedParameters} pageId={page.id} section={section} deleteSection={deleteSection} updateSectionName={updateSectionName} updateCardName={updateCardName} editMode={editMode} onLayoutChange={onLayoutChange} addCard={addCard} deleteCard={deleteCard} />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
        <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title"
                fullWidth 
                maxWidth="lg"
            >
                <DialogTitle id="dialog-title">
                    {"Set Location"}
                </DialogTitle>
                <DialogContent>
                    <LocationSearch page={page} onSelect={setLocation} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={() => {
                            handleFetchWeather();
                            handleCloseDialog();
                            }}
                    >
                        Save Location
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}