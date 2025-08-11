import { useState} from "react";
import LocationInput from "./LocationInput";
import { fetchWeather } from "../utils/fetchWeather";
import { Button, Box, Card, CardHeader, CardContent, CardActions, Typography, Popover } from "@mui/material";
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


    return (
        <Card sx={{ p: 2 }} variant="outlined" className="w-full" elevation={3}>
            <CardHeader title={<Typography variant="h2" className='w-full'>{section.name}</Typography>}></CardHeader>
            <CardActions>
                <Button onClick={() => {addCard(pageId, section.id)}}>Add Card</Button>
                <Button onClick={() => {deleteSection(pageId, section.id)}}>Delete This Section</Button>
            </CardActions>
            <CardContent>
                 <ResponsiveReactGridLayout
                    className="layout"
                    layouts={{ lg: section.layout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    isDraggable={editMode}
                    draggableHandle=".drag-handle"
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


