import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Button, Box, Popover, Card, CardHeader, Typography, CardActions } from "@mui/material";

export default function WeatherCard({ pageId, section, card, deleteCard, editMode }) {

    const handleDelete = () => {
        deleteCard(pageId, section.id, card.id);
    }

    return (
        <Card className="h-full" elevation={3}>
            <CardHeader title={<Typography variant="h3">{card.name}</Typography>}></CardHeader>
            <CardActions>
                <Button onClick={handleDelete}>Delete this card</Button>
                {editMode ? <Button className="drag-handle">Hold here to drag</Button> : ''}
                
            </CardActions>
        </Card>
    );
}