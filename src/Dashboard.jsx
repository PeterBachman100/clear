import { useRef, useState } from 'react';
import currentWeather from '../currentWeather.json';
import { weatherCode as weatherCodesMap } from '../weatherCodesMap.json';
import DataCard from './DataCard';

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
    const [cards, setCards] = useState([]);
    const nextId = useRef(0);

    const handleAddCard = () => {
      setCards((prev) => [...prev, { id: nextId.current++ }]);
    }

    return (
        <div>
            <button onClick={handleAddCard}>Add DataCard</button>
            {cards.map(({ id }) => (
                <DataCard 
                    key={id}
                    fieldOptions={fieldOptions}
                    weatherData={currentWeatherData}
                />
            ))}
        </div>
    );
}