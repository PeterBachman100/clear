import { getWeatherDescription } from "../utils/weatherCodeDescriptions";

export default function WeatherTable({ weather }) {
    return (
        <table className="table-auto w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
                <tr>
                    {Object.keys(weather.hourly).map((key) => {
                        return <th key={key} className="px-2 py-1 border-b">{key}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {weather.hourly.time.map((t, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                    {Object.entries(weather.hourly).map(([key, values]) => (
                            <td key={key} className="px-2 py-1 border-b text-center">
                                {
                                    key === "time"
                                        ? values[i].toLocaleString()
                                        : key === "weather_code"
                                            ? getWeatherDescription(values[i])
                                            : values[i]
                                }
                            </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}