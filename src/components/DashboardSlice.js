import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialDashboardState = {
  activePageId: '1',
  locations: {
    "45.97641,7.65861" : {
      name: "Matterhorn",
      admin1: null,
      country: "Switzerland",
      latitude: 45.97641,
      longitude: 7.65861,
      timezone: "Europe/Zurich"
    },
    '47.64177,-122.0804': {
      name: "Sammamish",
      admin1: "Washington",
      country: "United States",
      latitude: 47.64177,
      longitude: -122.0804,
      timezone: 'America/Los_Angeles'
    },
    "36.23962,-116.81133": {
      name: "Death Valley",
      admin1: "California",
      country: "United States",
      latitude: 36.23962,
      longitude: -116.81133,
      timezone: 'America/Los_Angeles'
    },
    "25.29847,91.58225": {
      name: "Mawsynrām",
      admin1: "Meghalaya",
      country: "India",
      latitude: 25.29847,
      longitude: 91.58225,
      timezone: "Asia/Kolkata"
    },
    "-78.15856,16.40626": {
      name: "Antarctica",
      admin1: null,
      country: null,
      latitude: -78.15856,
      longitude: 16.40626,
      timezone: "Antarctica/Syowa"
    },
    "-3.07583,37.35333": {
      name: "Mount Kilimanjaro",
      admin1: "Kilimanjaro",
      country: "Tanzania",
      latitude: -3.07583,
      longitude: 37.35333,
      timezone: "Africa/Dar_es_Salaam",
    },
  },
  pages: {
    '1': {
      id: '1',
      name: 'Around The World',
      locationId: null,
      locationVisible: false,
      editMode: false,
      sectionIds: ['1'],
      layout: [
        {i: '1', x: 0, y: 0, h: 10, w: 12},
      ],
    },
    '2': {
      id: '2',
      name: 'Sammamish',
      locationId: '47.64177,-122.0804',
      locationVisible: true,
      editMode: false,
      sectionIds: ['4', '5', '6'],
      layout: [
        {i: '4', x: 0, y: 0, h: 4, w: 12},
        {i: '5', x: 0, y: 4, h: 4, w: 12},
        {i: '6', x: 0, y: 8, h: 4, w: 12},
      ],
    },
  },
  sections: {
    '1': {
      id: '1',
      name: 'Today',
      pageId: '1',
      locationId: null,
      locationVisible: false,
      layout: [
        {i: '1', x: 0, y: 0, h: 3, w: 6},
        {i: '2', x: 6, y: 0, h: 3, w: 6},
        {i: '3', x: 0, y: 3, h: 3, w: 6},
        {i: '4', x: 6, y: 3, h: 3, w: 6},
        {i: '5', x: 0, y: 6, h: 3, w: 12},
      ],
      cardIds: ['1','2', '3', '4', '5'],
    },
    '4': {
      id: '4',
      name: 'Today',
      pageId: '2',
      locationId: null,
      locationVisible: false,
      layout: [
        {i: '6', x: 0, y: 0, h: 3, w: 12},
      ],
      cardIds: ['6'],
    },
    '5': {
      id: '5',
      name: 'Next 3 Days',
      pageId: '2',
      locationId: null,
      locationVisible: false,
      layout: [
        {i: '7', x: 0, y: 0, h: 3, w: 4},
        {i: '8', x: 4, y: 0, h: 3, w: 4},
        {i: '9', x: 8, y: 0, h: 3, w: 4},
      ],
      cardIds: ['7', '8', '9'],
    },
    '6': {
      id: '6',
      name: 'Next 2 Weeks',
      pageId: '2',
      locationId: null,
      locationVisible: false,
      layout: [
        {i: '10', x: 0, y: 0, h: 3, w: 12},
      ],
      cardIds: ['10'],
    }
  },
  cards: {
    '1': {
      id: '1',
      sectionId: '1',
      locationId: "45.97641,7.65861",
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility', 'wind_speed_10m', 'wind_gusts_10m', 'uv_index'],
      visibleDataRange: [0, 23],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: true,
      referenceLinesVisible: false,
      locationVisible: true,
    },
    '2': {
      id: '2',
      sectionId: '1',
      locationId: "36.23962,-116.81133",
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility', 'wind_speed_10m', 'wind_gusts_10m', 'uv_index'],
      visibleDataRange: [0, 23],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: true,
      referenceLinesVisible: false,
      locationVisible: true,
    },
    '3': {
      id: '3',
      sectionId: '1',
      locationId:  "25.29847,91.58225",
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility', 'wind_speed_10m', 'wind_gusts_10m', 'uv_index'],
      visibleDataRange: [0, 23],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: true,
      referenceLinesVisible: false,
      locationVisible: true,
    },
    '4': {
      id: '4',
      sectionId: '1',
      locationId: "-78.15856,16.40626",
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility', 'wind_speed_10m', 'wind_gusts_10m', 'uv_index'],
      visibleDataRange: [0, 23],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: true,
      referenceLinesVisible: false,
      locationVisible: true,
    },
    '5': {
      id: '5',
      sectionId: '1',
      locationId: "-3.07583,37.35333",
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility', 'wind_speed_10m', 'wind_gusts_10m', 'uv_index'],
      visibleDataRange: [0, 23],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: true,
      referenceLinesVisible: false,
      locationVisible: true,
    },
    '6': {
      id: '6',
      sectionId: '4',
      locationId: null,
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility',],
      visibleDataRange: [5, 23],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: true,
      referenceLinesVisible: false,
      locationVisible: false,
    },
    '7': {
      id: '7',
      sectionId: '5',
      locationId: null,
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover',],
      visibleDataRange: [29, 47],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: false,
      referenceLinesVisible: true,
      locationVisible: false,
    },
    '8': {
      id: '8',
      sectionId: '5',
      locationId: null,
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', ],
      visibleDataRange: [53, 71],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: false,
      referenceLinesVisible: true,
      locationVisible: false,
    },
    '9': {
      id: '9',
      sectionId: '5',
      locationId: null,
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover'],
      visibleDataRange: [77, 95],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: false,
      referenceLinesVisible: true,
      locationVisible: false,
    },
    '10': {
      id: '10',
      sectionId: '6',
      locationId: null,
      selectedParameters: ['temperature_2m', 'precipitation_probability', 'precipitation', 'cloud_cover', 'visibility',],
      visibleDataRange: [0, 336],
      legendVisible: false,
      rangeSliderVisible: false,
      hourlyLabelsVisible: false,
      referenceLinesVisible: true,
      locationVisible: false,
    },
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {

    // LOCATION
    setLocation: (state, action) => {
      const { itemCategory, itemId, location } = action.payload;
      if(location === null) {
        state[itemCategory][itemId].locationId = null;
      } else {
        const newLocationId = `${location.latitude},${location.longitude}`
        state[itemCategory][itemId].locationId = newLocationId;
        state.locations[newLocationId] = {
          name: location.name, 
          admin1: location.admin1, 
          country: location.country, 
          latitude: location.latitude, 
          longitude: location.longitude, 
          timezone: location.timezone
        };
      }
      
    },


    // PAGE
    setActivePage: (state, action) => {
      const {pageId} = action.payload;
      state.activePageId = pageId;
    },

    addPage: (state) => {
      const newPageId = uuidv4();
      state.pages[newPageId] = {
        id: newPageId,
        name: 'New Page',
        editMode: false,
        locationId: null, 
        locationVisible: true,
        sectionIds: [],
        layout: []
      };
      state.activePageId = newPageId;
    },

    deletePage: (state, action) => {
      const {pageId} = action.payload;
      const pageIds = Object.keys(state.pages);
      if (pageIds.length === 1) {
          return;
      }
      const sectionIds = state.pages[pageId].sectionIds;
      const cardIds = [];
      sectionIds.forEach((sectionId) => {
        cardIds.push(...state.sections[sectionId].cardIds);
      })
      delete state.pages[pageId];
      sectionIds.forEach((sectionId) => {
        delete state.sections[sectionId];
      })
      cardIds.forEach((cardId) => {
        delete state.cards[cardId];
      })
      const remainingPageIds = Object.keys(state.pages);
      state.activePageId = remainingPageIds[0];
    },

    updatePageName: (state, action) => {
      const {pageId, newPageName} = action.payload;
      state.pages[pageId].name = newPageName;
    },


    // LAYOUT
    toggleEditMode: (state, action) => {
      const {pageId} = action.payload;
      state.pages[pageId].editMode = !state.pages[pageId].editMode;
    },

    updateLayout: (state, action) => {
      const {category, id, newLayout} = action.payload;
	    state[category][id].layout = newLayout;
    },


    // SECTION
    addSection: (state, action) => {
      const {pageId} = action.payload;
      const newSectionId = uuidv4();
      const newSection = {id: newSectionId, name: 'Section Name', pageId: pageId, locationId: null, locationVisible: true, layout: [], cardIds: []};
      const newLayoutItem = { i: newSectionId, x: 0, y: 0, w: 4, h: 4 };
      state.pages[pageId].layout.push(newLayoutItem);
      state.pages[pageId].sectionIds.push(newSectionId);
      state.sections[newSectionId] = newSection;
    },

    deleteSection: (state, action) => {
      const {pageId, sectionId} = action.payload;
      state.pages[pageId].sectionIds = state.pages[pageId].sectionIds.filter(id => id !== sectionId);
      state.pages[pageId].layout = state.pages[pageId].layout.filter(item => item.i !== sectionId);
      const cardIds = state.sections[sectionId].cardIds;
      cardIds.forEach((cardId) => {
        delete state.cards[cardId];
      });
      delete state.sections[sectionId];
    },

    updateSectionName: (state, action) => {
      const {sectionId, newName} = action.payload;
      state.sections[sectionId].name = newName;
    },


    // CARD
    addCard: (state, action) => {
      const {sectionId} = action.payload;
      const newCardId = uuidv4();
      const newCard = { id: newCardId, sectionId: sectionId, locationId: null, locationVisible: true, selectedParameters: [], visibleDataRange: [0, 72], legendVisible: false, rangeSliderVisible: true, hourlyLabelsVisible: true, referenceLinesVisible: true, };
      const newLayoutItem = { i: newCardId, x: 0, y: 0, w: 4, h: 4 };
      state.sections[sectionId].layout.push(newLayoutItem);
      state.sections[sectionId].cardIds.push(newCardId);
      state.cards[newCardId] = newCard;
    },

    deleteCard: (state, action) => {
      const {sectionId, cardId} = action.payload;
      state.sections[sectionId].layout = state.sections[sectionId].layout.filter(item => item.i !== cardId);
      state.sections[sectionId].cardIds = state.sections[sectionId].cardIds.filter(id => id !== cardId);
      delete state.cards[cardId];
    },


    // PARAMETERS
    setParameters: (state, action) => {
      const {cardId, selectedParameters} = action.payload;
      state.cards[cardId].selectedParameters = selectedParameters;
    },


    // VISIBLE DATA
    setVisibleDataRange: (state, action) => {
      const {cardId, range} = action.payload;
      state.cards[cardId].visibleDataRange = range;
    },

    // LEGEND
    setLegendVisibility: (state, action) => {
      const {cardId, visible} = action.payload;
      state.cards[cardId].legendVisible = visible;
    },

    //RANGE SLIDER
    setRangeSliderVisibility: (state, action) => {
      const {cardId, visible} = action.payload;
      state.cards[cardId].rangeSliderVisible = visible;
    },

    // HOURLY LABELS
    setHourlyLabelsVisibility: (state, action) => {
      const {cardId, visible} = action.payload;
      state.cards[cardId].hourlyLabelsVisible = visible;
    },

    // REFERENCE LINES
    setReferenceLinesVisibility: (state, action) => {
      const {cardId, visible} = action.payload;
      state.cards[cardId].referenceLinesVisible = visible;
    },

    // LOCATION LABEL
    setLocationVisibility: (state, action) => {
      const {category, id, visible} = action.payload;
      state[category][id].locationVisible = visible;
    },

  },
});

export const { setLocation, setActivePage, addPage, deletePage, updatePageName, toggleEditMode, updateLayout, addSection, deleteSection, updateSectionName, addCard, deleteCard, setParameters, setVisibleDataRange, setLegendVisibility, setRangeSliderVisibility, setHourlyLabelsVisibility, setReferenceLinesVisibility, setLocationVisibility } = dashboardSlice.actions;

export default dashboardSlice.reducer;