import { useState } from 'react';
import currentWeather from '../currentWeather.json';
import { weatherCode as weatherCodesMap } from '../weatherCodesMap.json';

const { data: { values } } = currentWeather;
const currentWeatherData = {
    ...values,
    conditions: weatherCodesMap[values.weatherCode] || "Unknown"
};

delete currentWeatherData.weatherCode;

const fieldOptions = Object.keys(currentWeatherData).map((key) => ({
  key,
  label: key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase()),
}));

export default function DashBoard() {

    const [selectedFields, setSelectedFields] = useState({
        first: "",
        second: "",
    });

    const handleFieldChange = (dropdownKey, value) => {
        setSelectedFields((prev) => ({
            ...prev,
            [dropdownKey]: value,
        }));
    }



    return (
        <div>
            <div>
                <select value={selectedFields.first} onChange={(e) => handleFieldChange("first", e.target.value)}>
                    <option value="">Please select an option</option>
                    {fieldOptions.map((option) => {
                        return (
                            <option key={option.key} value={option.key}>{option.label}</option>
                        );
                    })}
                </select>
                <p>{selectedFields.first ? currentWeatherData[selectedFields.first] : "No selection"}</p>
            </div>
             <div>
                <select value={selectedFields.second} onChange={(e) => handleFieldChange("second", e.target.value)}>
                    <option value="">Please select an option</option>
                    {fieldOptions.map((option) => {
                        return (
                            <option key={option.key} value={option.key}>{option.label}</option>
                        );
                    })}
                </select>
                <p>{selectedFields.second ? currentWeatherData[selectedFields.second] : "No selection"}</p>
            </div>
        </div>
    );
}