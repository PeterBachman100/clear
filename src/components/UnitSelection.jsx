export default function UnitSelection({ availableUnits, units, onChange }) {
    return (
        <div className="mb-4">
            <h3 className="text-3xl mb-1">Select Units</h3>
            <h4 className="text-xl">Temperature</h4>
            <div className="space-y-1">
                {availableUnits.temperature.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                        <input 
                            type="radio" 
                            value={value} 
                            name="temperatureUnit" 
                            checked={units.temperature === value} 
                            onChange={(e) => onChange((prev) => ({...prev, temperature: e.target.value}))} />
                        {label}
                    </label>
                ))}
            </div>
            <h4 className="text-xl">Wind Speed</h4>
            <div className="space-y-1">
                {availableUnits.windSpeed.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                        <input 
                            type="radio" 
                            name="windSpeedUnit" 
                            value={value} 
                            checked={units.windSpeed === value} 
                            onChange={(e) => onChange((prev) => ({...prev, windSpeed: e.target.value}))} />
                        {label}
                    </label>
                ))}
            </div>
            <h4 className="text-xl">Precipitation</h4>
            <div className="space-y-1">
                {availableUnits.precipitation.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                        <input 
                            type="radio" 
                            value={value} 
                            checked={units.precipitation === value} 
                            name="precipitationUnit" 
                            onChange={(e) => onChange((prev) => ({...prev, precipitation: e.target.value}))} />
                        {label}
                    </label>
                ))}
            </div>
        </div>
    );
}