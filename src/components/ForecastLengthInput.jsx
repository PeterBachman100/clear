export default function ForecastLengthInput( {forecastLength, onChange}) {
    return (
        <div className="mb-4">
            <h3 className="text-3xl mb-1">Select Forecast Length: {forecastLength} Day(s)</h3>
            <input 
                type="number"
                id="forecastDays"
                min="1"
                max="16"
                value={forecastLength}
                onChange={onChange}
            />
        </div>
    );
}