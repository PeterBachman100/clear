import { useState } from "react";

export default function DataCard({ fieldOptions, weatherData }) {
    const [selectedField, setSelectedField] = useState("");

    const handleSelectChange = (event) => {
        setSelectedField(event.target.value);
    }

    const renderSelectedData = (selectedField, fieldOptions, weatherData) => {
        if (!selectedField) return "No data selected";

        const selectedOption = fieldOptions.find((opt) => opt.key === selectedField);
        return `${weatherData[selectedField]}`;
    };

     return (
        <div>
            <select value={selectedField} onChange={handleSelectChange}>
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