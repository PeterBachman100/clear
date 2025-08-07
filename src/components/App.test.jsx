import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe('Add location button', async () => {
  
  it("is rendered", () => {
    render(<App />);
    const addLocationButton = screen.getByText("Add Location Section");
    expect(addLocationButton).toBeInTheDocument();
  });

  it('adds a new WeatherDisplay component when clicked', async () => {
    render(<App />);
    const addLocationButton = screen.getByText("Add Location Section");
    await userEvent.click(addLocationButton);
    const setLocationButton = screen.getByText('Set Location');
    expect(setLocationButton).toBeInTheDocument();
  })
});