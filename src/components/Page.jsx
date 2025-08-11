import { useState } from "react";
import Section from "./Section";
import { Box, Typography, Divider, Button } from '@mui/material';
      
export default function Page({ page, editMode, toggleEditMode, onLayoutChange, addSection, deleteSection, addCard, deleteCard }) {

    return (
        <div className='w-full min-h-screen'>
            <Box 
                sx={{
                    p: 4
                }}
                className="w-full bg-gray-300"
                >
                <Typography variant="h1" className='w-full'>{page.name}</Typography>
                <Button onClick={() => {toggleEditMode(page.id)}}>{editMode? 'Save Layout' : 'Edit Layout'}</Button>
                <Button onClick={() => {addSection(page.id)}}>Add Section</Button>
            </Box>
            {page.sections.length === 0 ? <p>This page is empty. Edit the layout to add a section!</p> : ''}
            <div className='flex flex-col bg-gray-50 h-full'>
                {page.sections.map((section) => {
                    return (
                        <Section key={section.id} pageId={page.id} section={section} deleteSection={deleteSection} editMode={editMode} onLayoutChange={onLayoutChange} addCard={addCard} deleteCard={deleteCard} />
                    );
                })}
            </div>
        </div>
    );
}