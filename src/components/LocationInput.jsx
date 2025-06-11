export default function LocationInput({ location, onChange }) {
    return (
        <div className="mb-4">
            <h3 className="text-3xl mb-1">Select Location:</h3>
            <label className="font-bold">Latitude: </label>
            <input 
                type="number"
                value={location.latitude}
                onChange={(e) =>
                    onChange((prev) => ({ ...prev, latitude: e.target.value }))
                }
            />
            <label className="font-bold">Longitude: </label>
            <input 
                type="number"
                value={location.longitude}
                onChange={(e) =>
                    onChange((prev) => ({ ...prev, longitude: e.target.value }))
                }
            />
        </div>
    );
}