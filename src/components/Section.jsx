import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardContent, Typography, IconButton, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { EditLocationOutlined as EditLocationOutlinedIcon } from '@mui/icons-material'
import DataCard from "./DataCard";
import LocationSearch from "./LocationSearch";
import { Responsive, WidthProvider } from "react-grid-layout";
import { updateLayout, updateSectionName, deleteSection, addCard, setLocation } from "./DashboardSlice";
import { selectSectionLocationId } from "../utils/selectors";
import { useDispatch, useSelector } from "react-redux";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Section({ pageId, sectionId, editMode, openCardSettings, cardSettingsId }) {

    const dispatch = useDispatch();

    const section = useSelector(state => state.dashboard.sections[sectionId]);
    const cardIds = useSelector(state => state.dashboard.sections[sectionId].cardIds);

    // LOCATION
    const locationId = useSelector(state => selectSectionLocationId(state, sectionId, pageId));
    const location = useSelector(state => state.dashboard.locations[locationId]);

    const handleSetLocation = (newLocation) => {
        handleCloseDialog();
        dispatch(setLocation({ itemCategory: 'sections', itemId: sectionId, location: newLocation }));
    };

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
        dispatch(updateLayout({ sectionId, newLayout }));
    };

    //CARD
    const handleAddCard = () => {
        dispatch(addCard({ sectionId }));
    }


    return (
        <>
        <Card variant="contained" className="w-full !overflow-visible" elevation={3} sx={{borderRadius: 0}}>
            <CardHeader
                subheader={<><LocationPinIcon /> {location?.name || 'No section-level location selected'}</>}
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
                        <>{showName && <Typography variant="subtitle">{section.name}</Typography>}</>
                    }
                action={
                    <IconButton
                        aria-describedby={id} 
                        onClick={handleOpenMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
                sx={{p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}
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
                <MenuItem onClick={handleDeleteSection}>
                    <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                    Delete this Section
                </MenuItem>
            </Menu>
            <CardContent sx={{p:0}}>
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                    breakpoints={{ lg: 1200, md: 1000, sm: 600, xs: 400, xxs: 0 }}
                    cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                    rowHeight={75}
                    isDraggable={editMode}
                    isResizable={editMode}
                    autoSize={true}
                    resizeHandles={['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']}
                    onLayoutChange={handleLayoutChange}
                >
                    {cardIds.map((cardId) => {
                        return (
                            <div key={cardId}>
                                <DataCard pageId={pageId} sectionId={sectionId} cardId={cardId} openCardSettings={openCardSettings} />
                            </div>
                        );
                    })}
                </ResponsiveReactGridLayout>
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
                {"Set Section Location"}
            </DialogTitle>
            <DialogContent>
                <LocationSearch onSelect={handleSetLocation} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} variant="outlined" color="error">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}


