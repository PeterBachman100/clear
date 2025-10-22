import { useState, useEffect } from "react";
import Section from "./Section";
import LocationSearch from "./LocationSearch";
import { Typography, Button, Drawer, Card, CardHeader, CardContent, IconButton, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormControlLabel, Switch } from '@mui/material';
import { ViewComfy as ViewComfyIcon, MoreVert as MoreVertIcon, DeleteOutlined as DeleteOutlineIcon, EditOutlined as EditOutlinedIcon, Add as AddIcon, VisibilityOutlined as VisibilityOutlinedIcon, VisibilityOffOutlined as VisibilityOffOutlinedIcon, EditLocationOutlined as EditLocationOutlinedIcon, LocationPin as LocationPinIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux'
import { deletePage, updatePageName, setLocation, toggleEditMode, addSection, setLocationVisibility } from "./DashboardSlice";

      
export default function Page() {

    const dispatch = useDispatch();
    const page = useSelector(state => state.dashboard.pages[state.dashboard.activePageId]);
    const editMode = useSelector(state => state.dashboard.pages[state.dashboard.activePageId].editMode);    


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

    // Delete Page
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
    const locationId = useSelector((state) => state.dashboard.pages[page.id].locationId);
    const location = useSelector((state) => state.dashboard.locations[locationId]);

    const handleSetLocation = (newLocation) => {
        handleCloseDialog();
        dispatch(setLocation({ itemCategory: 'pages', itemId: page.id, location: newLocation }));
    };

    // LOCATION LABEL
    const isLocationVisible = useSelector(state => state.dashboard.pages[page.id].locationVisible);
    const toggleLocationVisibility = (event) => {
        dispatch(setLocationVisibility({category: 'pages', id: page.id, visible: event.target.checked}));
    }

    // LAYOUT
    const handleToggleEditMode = (pageId) => {
        dispatch(toggleEditMode({pageId: pageId}));
    }

    // Page Location Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
        handleCloseMenu();
    };
    const handleCloseDialog = () => {setDialogOpen(false)};

    return (
        <>
            <Card className='w-full min-h-screen bg-black'>
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
                    action={<IconButton onClick={handleOpenMenu}><MoreVertIcon /></IconButton>}
                    subheader={isLocationVisible && <><LocationPinIcon /> {location?.name || 'No page-level location selected'}</>}
                    sx={{p:1, textAlign: 'center', flexDirection: 'row-reverse', backgroundColor: '#000000'}}
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
                        Set Page Location
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
                        {editMode ? 'Save Dashboard' : 'Edit Dashboard'}
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
                    <MenuItem>
                        <FormControlLabel control={<Switch checked={isLocationVisible} onChange={toggleLocationVisibility} color='secondary'/>} label="Location Label" />
                    </MenuItem>
                    <MenuItem onClick={handleDeletePage}>
                        <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                        Delete this Page
                    </MenuItem>
                </Menu>
                <CardContent sx={{display: 'flex', flexDirection: 'column', backgroundColor: '#000'}}>
                    {editMode && <Button variant="outlined" color="success" onClick={() => {
                            handleToggleEditMode(page.id);
                            handleCloseMenu();
                        }}>
                            Save Dashboard
                        </Button>
                    }
                    <div className="flex flex-col gap-4">
                        {page.sectionIds.map((sectionId) => {
                            return (
                                <Section key={sectionId} pageId={page.id} sectionId={sectionId} />
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth 
                maxWidth="lg"
            >
                <DialogTitle id="dialog-title">
                    {"Set Page Location"}
                </DialogTitle>
                <DialogContent>
                    <LocationSearch onSelect={handleSetLocation} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSetLocation(null)} variant="outlined" color="secondary">Set to "Null"</Button>
                    <Button onClick={handleCloseDialog} variant="outlined" color="error">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

