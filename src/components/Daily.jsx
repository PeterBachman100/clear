import { useSelector } from "react-redux";
import { getPrettyParameterName } from "../utils/parameters";
import { Card } from "@mui/material";

const convertTimestampToLocalDateString = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: timezone,
    });
    return formatter.format(date);
}

export default function Daily({ weather, pageId, sectionId, cardId }) {

    const selectedDailyParameters = useSelector(state => state.dashboard.cards[cardId].selectedDailyParameters);
    const dailyRange = useSelector(state => state.dashboard.cards[cardId].dailyRange);  
    const days = Array.from({length: dailyRange[1] - dailyRange[0] + 1}, (_, i) => dailyRange[0] + i - 1); 

    return (
        <div className="flex flex-wrap gap-1">
            {days.map(day => (
                <Card key={day}>
                    <h1>{convertTimestampToLocalDateString(weather.daily.time[day], weather.location.timezone)}</h1>
                    {selectedDailyParameters.map(param => (
                        <p key={param}>
                        {weather.daily.weatherVariables[param].data[day]}
                        </p>
                    ))}
                </Card>
            ))}
        </div>
    );
}

