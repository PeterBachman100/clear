import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardContent, Typography, IconButton, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { EditLocationOutlined as EditLocationOutlinedIcon } from '@mui/icons-material'
import DataCard from "./DataCard";
import LocationSearch from "./LocationSearch";
import { Responsive, WidthProvider } from "react-grid-layout";
import { updateLayout, updateSectionName, deleteSection, addCard, setLocation, setLocationVisibility } from "./DashboardSlice";
import { selectSectionLocationId } from "../utils/selectors";
import { useDispatch, useSelector } from "react-redux";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Section({ pageId, sectionId }) {

    const dispatch = useDispatch();

    const section = useSelector(state => state.dashboard.sections[sectionId]);
    const cardIds = useSelector(state => state.dashboard.sections[sectionId].cardIds);
    const editMode = useSelector(state => state.dashboard.pages[pageId].editMode);

    // LOCATION
    const locationId = useSelector(state => selectSectionLocationId(state, sectionId, pageId));
    const location = useSelector(state => state.dashboard.locations[locationId]);

    const handleSetLocation = (newLocation) => {
        handleCloseDialog();
        dispatch(setLocation({ itemCategory: 'sections', itemId: sectionId, location: newLocation }));
    };

    // LOCATION LABEL
    const isLocationVisible = useSelector(state => state.dashboard.sections[sectionId].locationVisible);
    const toggleLocationVisibility = (event) => {
        dispatch(setLocationVisibility({category: 'sections', id: sectionId, visible: event.target.checked}));
    }

     // Location Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
        handleCloseMenu();
    };
    const handleCloseDialog = () => {setDialogOpen(false)};

    const handleDeleteSection = () => {
        dispatch(deleteSection({pageId, sectionId}));
        handleCloseMenu();
    }
    const handleUpdateSectionName = () => {
        dispatch(updateSectionName({sectionId, newName: sectionName}));
        setEditingSectionName(false);
    }

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


    // Page Name
    const [editingSectionName, setEditingSectionName] = useState(false);
    const [sectionName, setSectionName] = useState(section.name);

    const handleNameChange = (e) => {
        setSectionName(e.target.value);
    };

    const [showName, setShowName] = useState(true);
    const handleToggleNameVisibility = () => {
        setShowName(!showName);
        handleCloseMenu();
    };

    // LAYOUT
    const layout = useSelector((state) => state.dashboard.sections[sectionId].layout);
    const handleLayoutChange = (newLayout) => {
        dispatch(updateLayout({ category: 'sections', id: sectionId, newLayout }));
    };

    //CARD
    const handleAddCard = () => {
        dispatch(addCard({ sectionId }));
    }

    const dragHandle = editMode ? 
        <OpenWithIcon className="draggableHandleSection cursor-pointer absolute top-3 left-1/2 -translate-x-1/2" fontSize='large' />
        : null; 

    return (
        <>
        <Card className="w-full h-full" sx={{p:0, backgroundColor: '#0c0c0c', backgroundImage: 'none', border: '1px solid #737373'}}>
            <CardHeader
                title={
                    editingSectionName ?
                        <div className="flex gap-4">
                            <TextField
                                label={"Page Name"}
                                variant="outlined"
                                value={sectionName}
                                onChange={handleNameChange}
                            /> 
                            <Button onClick={handleUpdateSectionName} variant="outlined" color="success">Save</Button>
                            <Button onClick={() => {setEditingSectionName(false)}} variant="outlined" color="error">Cancel</Button>
                            </div>
                        :
                        <>{showName && <Typography variant="subtitle">{section.name}</Typography>}    {isLocationVisible && <>(<LocationPinIcon />{location?.name || 'No section-level location selected'})</>}</>
                    }
                action={editMode && <IconButton onClick={handleOpenMenu}><MoreVertIcon /></IconButton>}
                sx={{paddingBottom: 0, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', width: '100%'}}
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
                <MenuItem onClick={() => {
                    handleAddCard();
                    handleCloseMenu();
                }}>
                    <AddIcon sx={{ mr: 1}} color="success" />
                    Add a Card
                </MenuItem>
                <MenuItem onClick={() => {handleOpenDialog()}}>
                    <EditLocationOutlinedIcon sx={{ mr: 1 }} />
                    Set Section Location
                </MenuItem>
                <MenuItem onClick={() => {
                    setEditingSectionName(true);
                    handleCloseMenu();
                    }}>
                    <EditOutlinedIcon sx={{ mr: 1}} />
                    Update Section Name
                </MenuItem>
                <MenuItem onClick={handleToggleNameVisibility}>
                    {showName ? <><VisibilityOffOutlinedIcon sx={{ mr: 1 }} />Hide name</> : <><VisibilityOutlinedIcon sx={{ mr: 1 }} />Show name</>}
                </MenuItem>
                <MenuItem>
                    <FormControlLabel control={<Switch checked={isLocationVisible} onChange={toggleLocationVisibility} color='secondary'/>} label="Location Label" />
                </MenuItem>
                <MenuItem onClick={handleDeleteSection}>
                    <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                    Delete this Section
                </MenuItem>
            </Menu>
            {dragHandle}
            <CardContent sx={{padding: '0 !important'}}>
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                    breakpoints={{ lg: 1200, md: 1000, sm: 600, xs: 400, xxs: 0 }}
                    cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                    rowHeight={50}
                    isDraggable={editMode}
                    draggableHandle=".draggableHandle"
                    isResizable={editMode}
                    autoSize={true}
                    compactType={null}
                    resizeHandles={['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']}
                    onLayoutChange={handleLayoutChange}
                >
                    {cardIds.map((cardId) => {
                        return (
                            <div key={cardId}>
                                <DataCard pageId={pageId} sectionId={sectionId} cardId={cardId} />
                            </div>
                        );
                    })}
                </ResponsiveReactGridLayout>
            </CardContent>
        </Card>
        <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth 
            maxWidth="lg"
        >
            <DialogTitle id="dialog-title">
                {"Set Section Location"}
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


