import { render, screen, waitFor } from "@testing-library/react";
import LocationSearch from "./LocationSearch";
import { expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

it('renders the search input field', () => {
  render(<LocationSearch onSelect={() => {}} />);
  const searchInput = screen.getByLabelText(/search for a location/i);
  expect(searchInput).toBeInTheDocument();
});

it('makes an api request with correct parameters', async () => {
  const mockOnSelect = vi.fn();
  render(<LocationSearch onSelect={mockOnSelect} />);
  
  const user = userEvent.setup();
  const apiCallSpy = vi.fn();

  const locationSearchInput = screen.getByLabelText(/search for a location/i);

  server.use(
    http.get('https://geocoding-api.open-meteo.com/v1/search', async ({request}) => {
      const url = new URL(request.url);
      const nameParam = url.searchParams.get('name');

      apiCallSpy({ name: nameParam});

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
    })
  );

  await user.click(locationSearchInput);
  await user.type(locationSearchInput, 'Snoqualmie');
  await waitFor(() => {
    expect(apiCallSpy).toHaveBeenCalledWith({ name: 'Snoqualmie' });
  }, { timeout: 500 });

  await waitFor(() => {
    expect(screen.getByText('Snoqualmie, Washington, United States')).toBeInTheDocument();
  });
});

it('calls onSelect with the correct data when an option is chosen', async () => {
  const mockOnSelect = vi.fn();
  render(<LocationSearch onSelect={mockOnSelect} />);

  const locationSearchInput = screen.getByLabelText(/search for a location/i);
  const user = userEvent.setup();

  const mockSnoqualmieData = {
    id: 5800587,
    name: 'Snoqualmie',
    admin1: 'Washington',
    country: 'United States',
    latitude: 47.5356,
    longitude: -121.8267,
    elevation: 126,
    feature_code: 'PPL',
    country_code: 'US',
    admin1_id: 5815135,
    timezone: 'America/Los_Angeles',
    population: 14064,
    postcodes: ['98065'],
    country_id: 6252001,
  };

  server.use(
    http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
      return HttpResponse.json({
        results: [mockSnoqualmieData],
        generationtime_ms: 0.5,
      });
    })
  );

  await user.click(locationSearchInput);
  await user.type(locationSearchInput, 'Snoqualmie');

  const expectedOptionText = `${mockSnoqualmieData.name}, ${mockSnoqualmieData.admin1}, ${mockSnoqualmieData.country}`;
  let optionToClick;

  await waitFor(() => {
    const textElement = screen.getByText(expectedOptionText);
    optionToClick = textElement.closest('[role="option"]');
    expect(optionToClick).toBeInTheDocument();
  });
  await user.click(optionToClick);

  expect(mockOnSelect).toHaveBeenCalledWith({
    name: mockSnoqualmieData.name,
    admin1: mockSnoqualmieData.admin1,
    country: mockSnoqualmieData.country,
    latitude: mockSnoqualmieData.latitude,
    longitude: mockSnoqualmieData.longitude,
  });
  
});