import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardContent, Typography, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import DataCard from "./DataCard";
import { Responsive, WidthProvider } from "react-grid-layout";
import { updateLayout, updateSectionName, deleteSection, addCard } from "./DashboardSlice";
import { selectWeatherByLocation } from "../utils/selectors";
import { useDispatch, useSelector } from "react-redux";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Section({ pageId, sectionId, editMode, openCardSettings, cardSettingsId }) {

    const dispatch = useDispatch();

    const section = useSelector(state => state.dashboard.sections[sectionId]);
    const cards = useSelector(state => state.dashboard.sections[sectionId]?.cardIds
        .map(cardId => state.dashboard.cards[cardId])
        .filter(card => card) // Filter out null/undefined values
    );

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
    const handleLayoutChange = (newLayout) => {
        dispatch(updateLayout({ sectionId, newLayout }));
    };

    //CARD
    const handleAddCard = () => {
        dispatch(addCard({ sectionId }));
    }

    // LOCATION and WEATHER
    const location = useSelector((state) => state.dashboard.pages[pageId].location);
    const weatherState = useSelector(state => selectWeatherByLocation(state, location));

    return (
        <Card variant="contained" className="w-full !overflow-visible" elevation={3} sx={{borderRadius: 0}}>
            <CardHeader
                subheader={<><LocationPinIcon /> {location.name}</>}
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
                sx={{p: 1, justifyContent: 'center', width: '100%'}}
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
                    layouts={{ lg: section.layout, md: section.layout, sm: section.layout, xs: section.layout, xxs: section.layout }}
                    breakpoints={{ lg: 1200, md: 1000, sm: 600, xs: 400, xxs: 0 }}
                    cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                    rowHeight={75}
                    isDraggable={editMode}
                    isResizable={editMode}
                    autoSize={true}
                    resizeHandles={['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']}
                    onLayoutChange={handleLayoutChange}
                >
                    {cards.map((card) => {
                        return (
                            <div key={card.id}>
                                <DataCard pageId={pageId} sectionId={sectionId} cardId={card.id} cardData={card} editMode={editMode} openCardSettings={openCardSettings} isBeingEdited={cardSettingsId === card.id} />
                            </div>
                        );
                    })}
                </ResponsiveReactGridLayout>
            </CardContent>
        </Card>

    );
}


