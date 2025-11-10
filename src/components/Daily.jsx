import { useSelector } from "react-redux";
import { getPrettyParameterName } from "../utils/parameters";

export default function Daily({ weather, pageId, sectionId, cardId }) {

    const selectedDailyParameters = useSelector(state => state.dashboard.cards[cardId].selectedDailyParameters);    

    return (
        <div>
            <h1>Daily</h1>
            <ul>
                {selectedDailyParameters.map((param) => {
                    return <li key={param}>{getPrettyParameterName(param)}: {weather.daily.weatherVariables[param].data}</li>;
                })}
            </ul>
        </div>
    );
}

