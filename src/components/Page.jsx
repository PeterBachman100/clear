import { useState, useEffect } from "react";
import Section from "./Section";
import LocationSearch from "./LocationSearch";
import CardSettings from "./CardSettings";
import { Typography, Button, Drawer, Card, CardHeader, CardContent, IconButton, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ViewComfy as ViewComfyIcon, MoreVert as MoreVertIcon, DeleteOutlined as DeleteOutlineIcon, EditOutlined as EditOutlinedIcon, Add as AddIcon, VisibilityOutlined as VisibilityOutlinedIcon, VisibilityOffOutlined as VisibilityOffOutlinedIcon, EditLocationOutlined as EditLocationOutlinedIcon, LocationPin as LocationPinIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux'
import { deletePage, updatePageName, setLocation, toggleEditMode, addSection } from "./DashboardSlice";
import { fetchAndStoreWeather } from "../utils/weatherThunk";
import { selectWeatherByLocation } from "../utils/selectors";
      
export default function Page() {

    const dispatch = useDispatch();
    const page = useSelector(state => state.dashboard.pages[state.dashboard.activePageId]);
    const editMode = page.editMode;    

    //SECTIONS
    const handleAddSection = () => {
        dispatch(addSection({pageId: page.id}));
    }

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

    const handleDeletePage = () => {
        dispatch(deletePage({pageId: page.id}));
        handleCloseMenu();
    }
    

    // Page Name
    const [editingPageName, setEditingPageName] = useState(false);
    const [pageNameInput, setPageNameInput] = useState(page.name);
    const handleNameChange = (e) => {
            setPageNameInput(e.target.value);
        };
    const handleUpdatePageName = () => {
        dispatch(updatePageName({pageId: page.id, newPageName: pageNameInput}));
        setEditingPageName(false);
    }

    const [showName, setShowName] = useState(true);
    const handleToggleNameVisibility = () => {
        setShowName(!showName);
        handleCloseMenu();
    };

    // LOCATION
    const location = useSelector((state) => state.dashboard.pages[page.id].location);
    const handleSetLocation = (pageId, newLocation) => {
        handleCloseDialog();
        dispatch(setLocation({ pageId: pageId, location: newLocation }));
    };

    // LAYOUT
    const handleToggleEditMode = (pageId) => {
        dispatch(toggleEditMode({pageId: pageId}));
    }
    

    // Weather
    useEffect(() => {
        if (location) {
            dispatch(fetchAndStoreWeather(location));
        }
    }, [dispatch, location?.latitude, location?.longitude]);
    
    const weatherState = useSelector(state => selectWeatherByLocation(state, location));
    const weather = weatherState?.data;


    // Location Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
        handleCloseMenu();
    };
    const handleCloseDialog = () => {setDialogOpen(false)};
    

    // Card settings
    const [cardSettingsOpen, setCardSettingsOpen] = useState(false);
    const [cardSettingsId, setCardSettingsId] = useState(null);

    const handleOpenCardSettings = (cardId) => {
        setCardSettingsId(cardId);
        setCardSettingsOpen(true);
    }
    
    const handleCloseCardSettings = () => {
        setCardSettingsOpen(false);
        setCardSettingsId(null);
    }

    

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
                                    value={pageNameInput}
                                    onChange={handleNameChange}
                                /> 
                                <Button onClick={handleUpdatePageName} variant="outlined" color="success">Save</Button>
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
                    subheader={<><LocationPinIcon /> {location.name}</>}
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
                    <MenuItem onClick={() => {
                        handleAddSection();
                        handleCloseMenu();
                    }}>
                        <AddIcon sx={{ mr: 1}} color="success" />
                        Add a Section
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleToggleEditMode(page.id);
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
                    <MenuItem onClick={handleDeletePage}>
                        <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                        Delete this Page
                    </MenuItem>
                </Menu>
                <CardContent sx={{p:0, display: 'flex', flexDirection: 'column'}}>
                    {editMode && <Button variant="outlined" color="success" onClick={() => {
                            handleToggleEditMode(page.id);
                            handleCloseMenu();
                        }}>
                            Save Layout
                        </Button>
                    }
                    <div>
                        {page.sectionIds.map((sectionId) => {
                            return (
                                <Section key={sectionId} pageId={page.id} editMode={editMode} sectionId={sectionId} openCardSettings={handleOpenCardSettings} cardSettingsId={cardSettingsId} />
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
                    <LocationSearch page={page} onSelect={handleSetLocation} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="outlined" color="error">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Drawer
                anchor="bottom"
                open={cardSettingsOpen}
                onClose={handleCloseCardSettings}
                sx={{position: 'relative'}}
            >
                <IconButton variant="outlined" color="secondary" sx={{position: 'absolute', top: 0, right: 0}} onClick={handleCloseCardSettings}><CloseIcon /></IconButton>
                {cardSettingsId && <CardSettings cardId={cardSettingsId} closeCardSettings={handleCloseCardSettings} weather={weather} />}
            </Drawer>
        </>
    );
}

