import { useState } from "react";

export default function DataCard({ fieldOptions, weatherData }) {
    const [selectedField, setSelectedField] = useState("");

    const handleSelectChange = (event) => {
        setSelectedField(event.target.value);
    }

    const renderSelectedData = (selectedField, fieldOptions, weatherData) => {
        if (!selectedField) return "No data selected";

        const selectedOption = fieldOptions.find((opt) => opt.key === selectedField);
        return `${selectedOption?.label}: ${weatherData[selectedField]}`;
    };

     return (
        <div className="p-4 border m-1 rounded">
            <select 
                value={selectedField} 
                onChange={handleSelectChange}
                className="border rounded"
            >
                <option value="">Please select an option</option>
                {fieldOptions.map(({ key, label }) => {
                    return (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    );
                })}
            </select>
           <p>{renderSelectedData(selectedField, fieldOptions, weatherData)}</p>
            <p></p>
        </div>
    );
}