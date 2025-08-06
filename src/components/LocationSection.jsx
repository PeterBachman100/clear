import { useState} from "react";
import LocationInput from "./LocationInput";
import { fetchWeather } from "../utils/fetchWeather";
import { Button, Box, Card, CardHeader, CardContent, CardActions, Typography, Popover } from "@mui/material";
import LocationSearch from "./LocationSearch";
import WeatherChart from "./WeatherChart";

export default function LocationSection() {
    const [weather, setWeather] = useState(null);
    const handleFetchWeather = async () => {
        try {
            const weatherData = await fetchWeather({ location });
            setWeather(weatherData);
        } catch(error) {
            console.error("Failed to fetch weather data:", error);
        } 
    }

    const [location, setLocation] = useState({
        name: "Snoqualmie Pass",
        admin1: "Washington",
        country: "United States",
        latitude: 47.3923,
        longitude: -121.4001
    });

    const[charts, setCharts] = useState([
        {
            id: 1,
            selectedParameter: "temperature",
        },
        {
            id: 2,
            selectedParameter: "precipitation",
        }
    ]);

    const addChart = () => {
        setCharts((prev) => [...prev, {id: Date.now(), selectedParameter: "temperature"}]);
    };

    const handleParameterChange = (chartIdToUpdate, newParameter) => {
        setCharts(prevCharts =>
            prevCharts.map(chart =>
                chart.id === chartIdToUpdate
                    ? { ...chart, selectedParameter: newParameter }
                    : chart
            )
        );
    };

    //POPOVER
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Card sx={{ p: 2 }} variant="outlined">
            <CardActions>
                <Button aria-describedby={id} variant="contained" onClick={handleOpenPopover}>
                Set Location
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                >
                    <Card sx={{ p: 2 }} className="flex flex-col gap-2">
                        <LocationSearch onSelect={setLocation} />
                        <LocationInput location={location} onChange={setLocation} />
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                handleFetchWeather();
                                handleClosePopover();
                                }}
                        >
                            Save Location
                        </Button>
                    </Card>
                </Popover>
                <Button variant="contained" onClick={addChart}>Add Chart</Button>
            </CardActions>
            <CardHeader title={
                    weather ? 
                    `${Number(weather.location.latitude).toFixed(4)}, ${Number(weather.location.longitude).toFixed(4)}` :
                    'Please select a location'
                }>
            </CardHeader>
            <CardContent>
                {weather?.hourly ? (
                    <Box className="flex flex-col gap-4">
                        {charts.map((chart) => (
                            <Card key={chart.id}>
                                <WeatherChart chartId={chart.id} weatherData={weather} selectedParameter={chart.selectedParameter} onParameterChange={handleParameterChange} />
                            </Card>
                        ))}
                    </Box>
                ) : (<p>No data loaded yet.</p>)}
            </CardContent>
        </Card>
    );
}


