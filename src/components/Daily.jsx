import { useSelector } from "react-redux";
import { convertTimestampToLocalDayString, getUnitAbbreviation } from "../utils/chartUtils";
import { getPrettyParameterName, formatDailyParameter } from "../utils/parameters";
import { Card } from "@mui/material";

export default function Daily({ weather, pageId, sectionId, cardId }) {

    const selectedDailyParameters = useSelector(state => state.dashboard.cards[cardId].selectedDailyParameters);
    const dailyRange = useSelector(state => state.dashboard.cards[cardId].dailyRange);  
    const days = Array.from({length: dailyRange[1] - dailyRange[0] + 1}, (_, i) => dailyRange[0] + i - 1); 

    return (
        <div className="flex flex-wrap gap-1">
            {days.map(day => (
                <Card key={day}>
                    <h1>{convertTimestampToLocalDayString(weather.daily.time[day], weather.location.timezone)}</h1>
                    {selectedDailyParameters.map(param => (
                        <p key={param}>
                            {getPrettyParameterName(param)}: {formatDailyParameter(param, weather.daily.weatherVariables[param].data[day], weather.location.timezone)} {getUnitAbbreviation(weather.daily.weatherVariables[param].unit)}
                        </p>
                    ))}
                </Card>
            ))}
        </div>
    );
}

