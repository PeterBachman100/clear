# Clear

Clear is a customizable weather dashboard, enabling users to quickly and easily see the weather that they care about, in a way that is intuitive to them.

**Live Deployment**: https://clear-sepia.vercel.app/

---

![App Screenshot](./src/assets/images/app-screenshot-9.24.2025.jpg "App Screenshot")

---
## Features
### Pages
Each page contains a customizable layout of user-created cards that display hourly weather forecast information.

### Graphs
- **Add, delete, move, resize, and customize graphs**
	- A 12-column grid layout
	- Drag and drop resizing and movement
- **Display any number of parameters on 1 chart:**
	- Temperature
	- Chance of Precipitation
	- Precipitation Amount
	- Total Cloud Cover
	- Low Cloud Cover (below ~10,000 ft.)
	- Visibility
	- Wind Speed
	- Wind Gusts
	- UV Index
- **Select the forecast range:**
	- Choose to display any range of hourly data within the next 2 weeks, e.g.
		- The next 24 hours
		- Tomorrow (hours 24 - 48)
		- The next 3 days (hours 0 - 72)
		- The next 14 days (hours 0 - 336)
- **Customize graph display:** by toggling visibility of:
	- Hourly labels
	- Legend
	- Forecast range selection slider
- **Cascading location selection:**
	- See weather for any number of locations on a single page
	- Set location for the entire Page, a Section, or a single Card
	- Location gets inherited automatically, unless an override is set

---
## Technologies, Libraries, APIs
- HTML
- CSS
- Tailwind
- JavaScript
- React
- Redux
- Redux Toolkit
- React-grid-layout
- MUI, MUI x-charts
- Open-meteo

---

## Possible Future Features
- Current Weather
- Daily Weather
- Save layout
- Accounts