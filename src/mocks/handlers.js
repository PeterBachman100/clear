import { http, HttpResponse } from "msw";

export const handlers = [
  // GeoLocation
  http.get(`https://geocoding-api.open-meteo.com/v1/search`, ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (name === "Snoqualmie") {
      return HttpResponse.json(
        {
          results: [
            {
              id: 5810995,
              name: "Snoqualmie",
              latitude: 47.52871,
              longitude: -121.82539,
              elevation: 129.0,
              feature_code: "PPL",
              country_code: "US",
              admin1_id: 5815135,
              admin2_id: 5799783,
              timezone: "America/Los_Angeles",
              population: 13169,
              postcodes: ["98065"],
              country_id: 6252001,
              country: "United States",
              admin1: "Washington",
              admin2: "King",
            },
            {
              id: 5811007,
              name: "Snoqualmie Pass",
              latitude: 47.39233,
              longitude: -121.40009,
              elevation: 831.0,
              feature_code: "PPL",
              country_code: "US",
              admin1_id: 5815135,
              admin2_id: 5799889,
              timezone: "America/Los_Angeles",
              population: 311,
              country_id: 6252001,
              country: "United States",
              admin1: "Washington",
              admin2: "Kittitas",
            },
            {
              id: 5810999,
              name: "Snoqualmie Falls",
              latitude: 47.53982,
              longitude: -121.80983,
              elevation: 164.0,
              feature_code: "PPL",
              country_code: "US",
              admin1_id: 5815135,
              admin2_id: 5799783,
              timezone: "America/Los_Angeles",
              country_id: 6252001,
              country: "United States",
              admin1: "Washington",
              admin2: "King",
            },
            {
              id: 5811005,
              name: "Snoqualmie Mountain",
              latitude: 47.45872,
              longitude: -121.41648,
              elevation: 1908.0,
              feature_code: "MT",
              country_code: "US",
              admin1_id: 5815135,
              admin2_id: 5799783,
              timezone: "America/Los_Angeles",
              country_id: 6252001,
              country: "United States",
              admin1: "Washington",
              admin2: "King",
            },
            {
              id: 5810996,
              name: "Snoqualmie Diversion Dam",
              latitude: 47.54149,
              longitude: -121.83789,
              elevation: 114.0,
              feature_code: "DAM",
              country_code: "US",
              admin1_id: 5815135,
              admin2_id: 5799783,
              timezone: "America/Los_Angeles",
              country_id: 6252001,
              country: "United States",
              admin1: "Washington",
              admin2: "King",
            },
          ],
          generationtime_ms: 0.69093704,
        },
        { status: 200 }
      );
    }
  }),
  //Forecast
  http.get("https://api.open-meteo.com/v1/forecast", ({ request }) => {
    return HttpResponse.json({
      filler: "filler",
    });
  }),
];
