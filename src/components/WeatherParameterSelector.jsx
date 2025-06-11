export default function WeatherParameterSelector({ availableParams, hourlyParams, onChange}) {
    return (
        <div className="mb-4">
            <h3 className="text-3xl mb-1">Select weather parameters</h3>
            <div className="space-y-1">
                {availableParams.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" value={value} checked={hourlyParams.includes(value)} onChange={onChange} />
                        {label}
                    </label>
                ))}
            </div>
        </div>
    );
}