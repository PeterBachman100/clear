import { useEffect, useState } from "react";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";
import useDebouncedValue from "../utils/debounce";

export default function LocationSearch({ onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
      const trimmed = debouncedSearchTerm.trim();
      if (!trimmed) return;

      const handleSearch = async () => {
        try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5`);
            const data = await res.json();
            setSearchResults(data.results || []);
        } catch(error) {
            console.error('Error fetching geocoding data:', error);
        }
      };

      handleSearch();
    }, [debouncedSearchTerm]);

    return (
        <Autocomplete 
            options={searchResults}
            getOptionLabel={(option) => 
                option.name + (option.admin1 ? `, ${option.admin1}` : '') + `, ${option.country}`
            }
            onInputChange={(event, newInputValue) => {
                setSearchTerm(newInputValue);
            }}
            onChange={(event, newValue) => {
                if (newValue) {
                    onSelect({
                        name: newValue.name,
                        admin1: newValue.admin1,
                        country: newValue.country,
                        latitude: newValue.latitude,
                        longitude: newValue.longitude,
                    });
                }
            }}
            renderInput={(params) => (
                <TextField {...params} label="Search for a location" variant="outlined" />
            )}
            renderOption={(props, option) => {
                const { key, ...rest} = props;
                return (
                    <Box component="li" key={key} {...rest}>
                        <Typography variant="body1">
                            {option.name}, {option.admin1}, {option.country}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Lat: {option.latitude}, Lon: {option.longitude}
                        </Typography>
                    </Box>
                );
            }}
            sx={{ my: 2 }}
        />
    );
}