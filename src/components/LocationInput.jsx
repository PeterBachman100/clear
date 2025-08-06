import { TextField } from "@mui/material";

export default function LocationInput({ location, onChange }) {
    return (
        <div className="mb-4">
            <TextField 
                label="Latitude"
                type="number"
                value={location.latitude}
                onChange={(e) =>
                    onChange((prev) => ({ ...prev, latitude: e.target.value }))
                }
            />
            <TextField
                label="Longitude"
                type="number"
                value={location.longitude}
                onChange={(e) =>
                    onChange((prev) => ({ ...prev, longitude: e.target.value }))
                }
            />
        </div>
    );
}