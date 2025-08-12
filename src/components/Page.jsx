import { useState } from "react";
import Section from "./Section";
import { Box, Typography, Divider, Button, Card, CardHeader, CardContent, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
      
export default function Page({ page, updatePageName, updateSectionName, updateCardName, editMode, toggleEditMode, onLayoutChange, deletePage, addSection, deleteSection, addCard, deleteCard }) {

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

    return (
        
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
                        <Typography variant="h1">{page.name}</Typography>
                }
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
                <MenuItem onClick={() => addSection(page.id)}>
                    <AddIcon sx={{ mr: 1}} color="success" />
                    Add a Section
                </MenuItem>
                <MenuItem onClick={() => toggleEditMode(page.id)}>
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
                <MenuItem onClick={handleDelete}>
                    <DeleteOutlineIcon sx={{ mr: 1 }} color="error" />
                    Delete this Page
                </MenuItem>
            </Menu>
            <CardContent>
                {page.sections.length === 0 ? <p>This page is empty. Edit the layout to add a section!</p> : ''}
                <div className='flex flex-col bg-gray-50 h-full'>
                {page.sections.map((section) => {
                    return (
                        <Section key={section.id} pageId={page.id} section={section} deleteSection={deleteSection} updateSectionName={updateSectionName} updateCardName={updateCardName} editMode={editMode} onLayoutChange={onLayoutChange} addCard={addCard} deleteCard={deleteCard} />
                    );
                })}
            </div>
            </CardContent>
        </Card>
    );
}