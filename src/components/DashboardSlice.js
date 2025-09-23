import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialDashboardState = {
  activePageId: '2',
  pages: {
    '1': {
      id: '1',
      name: 'Kirkland',
      location: {
        name: "Kirkland",
        admin1: "Washington",
        country: "United States",
        latitude: 47.6751,
        longitude: -122.1930
      },
      editMode: false,
      sectionIds: ['1', '2', '3'],
    },
    '2': {
      id: '2',
      name: 'Sammamish',
      location: {
        name: "Sammamish",
        admin1: "Washington",
        country: "United States",
        latitude: 47.64177,
        longitude: -122.0804
      },
      editMode: false,
      sectionIds: ['4', '5', '6'],
    },
  },
  sections: {
    '1': {
      id: '1',
      name: 'Today',
      pageId: '1',
      layout: [
        {i: '1', x: 0, y: 0, h: 3, w: 12},
      ],
      cardIds: ['1'],
    },
    '2': {
      id: '2',
      name: 'Next 3 Days',
      pageId: '1',
      layout: [
        {i: '2', x: 0, y: 0, h: 2, w: 4},
        {i: '3', x: 4, y: 0, h: 2, w: 4},
        {i: '4', x: 8, y: 0, h: 2, w: 4},
      ],
      cardIds: ['2', '3', '4'],
    },
    '3': {
      id: '3',
      name: 'Next 2 Weeks',
      pageId: '1',
      layout: [
        {i: '5', x: 0, y: 0, h: 3, w: 12},
      ],
      cardIds: ['5'],
    },
    '4': {
      id: '4',
      name: 'Today',
      pageId: '2',
      layout: [
        {i: '6', x: 0, y: 0, h: 3, w: 12},
      ],
      cardIds: ['6'],
    },
    '5': {
      id: '5',
      name: 'Next 3 Days',
      pageId: '2',
      layout: [
        {i: '7', x: 0, y: 0, h: 2, w: 4},
        {i: '8', x: 4, y: 0, h: 2, w: 4},
        {i: '9', x: 8, y: 0, h: 2, w: 4},
      ],
      cardIds: ['7', '8', '9'],
    },
    '6': {
      id: '6',
      name: 'Next 2 Weeks',
      pageId: '2',
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
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low', 'visibility', 'wind_speed', 'wind_gusts', 'uv_index'],
      visibleDataRange: [5, 23],
      legendVisible: true,
    },
    '2': {
      id: '2',
      sectionId: '2',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low',],
      visibleDataRange: [29, 47],
      legendVisible: false,
    },
    '3': {
      id: '3',
      sectionId: '2',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low',],
      visibleDataRange: [53, 71],
      legendVisible: false,
    },
    '4': {
      id: '4',
      sectionId: '2',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low',],
      visibleDataRange: [77, 95],
      legendVisible: false,
    },
    '5': {
      id: '5',
      sectionId: '3',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low', 'visibility', 'wind_speed', 'wind_gusts', 'uv_index'],
      visibleDataRange: [0, 336],
      legendVisible: false,
    },
    '6': {
      id: '6',
      sectionId: '4',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low', 'visibility', 'wind_speed', 'wind_gusts', 'uv_index'],
      visibleDataRange: [5, 23],
      legendVisible: true,
    },
    '7': {
      id: '7',
      sectionId: '5',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low',],
      visibleDataRange: [29, 47],
      legendVisible: false,
    },
    '8': {
      id: '8',
      sectionId: '5',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low',],
      visibleDataRange: [53, 71],
      legendVisible: false,
    },
    '9': {
      id: '9',
      sectionId: '5',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low',],
      visibleDataRange: [77, 95],
      legendVisible: false,
    },
    '10': {
      id: '10',
      sectionId: '6',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low', 'visibility', 'wind_speed', 'wind_gusts', 'uv_index'],
      visibleDataRange: [0, 336],
      legendVisible: false,
    },
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {

    // LOCATION
    setLocation: (state, action) => {
      const { pageId, location } = action.payload;
      if (state.pages[pageId]) {
        state.pages[pageId].location = location;
      }
    },


    // PAGE
    setActivePage: (state, action) => {
      const {pageId} = action.payload;
      state.activePageId = pageId;
    },

    addPage: (state) => {
      const newPageId = uuidv4();
      const newSectionId = uuidv4();
      const newCardId = uuidv4();
      state.pages[newPageId] = {
        id: newPageId,
        name: 'New Page',
        editMode: false,
        location: null, 
        sectionIds: [newSectionId]
      };
      state.sections[newSectionId] = {id: newSectionId, name: 'Section Name', pageId: newPageId, layout: [{i: newCardId, x: 0, y: 0, h: 4, w: 12}], cardIds: [newCardId]};
      state.cards[newCardId] = { id: newCardId, sectionId: newSectionId, selectedParameters: ['temperature'], visibleDataRange: [0, 72] };
      state.activePageId = newPageId;
    },

    deletePage: (state, action) => {
      const {pageId} = action.payload;
      const pageIds = Object.keys(state.pages);
      if (pageIds.length === 1) {
          return;
      }
      delete state.pages[pageId];
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
      const {sectionId, newLayout} = action.payload;
      state.sections[sectionId].layout = newLayout; 
    },


    // SECTION
    addSection: (state, action) => {
      const {pageId} = action.payload;
      const newSectionId = uuidv4();
      const newSection = {id: newSectionId, name: 'Section Name', pageId: pageId, layout: [], cardIds: []}
      state.pages[pageId].sectionIds.push(newSectionId);
      state.sections[newSectionId] = newSection;
    },

    deleteSection: (state, action) => {
      const {pageId, sectionId} = action.payload;
      state.pages[pageId].sectionIds = state.pages[pageId].sectionIds.filter(id => id !== sectionId);
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
      const newCard = { id: newCardId, sectionId: sectionId, selectedParameters: ['temperature'], visibleDataRange: [0, 72] };
      const newLayoutItem = { i: newCardId, x: 0, y: Infinity, w: 4, h: 4 };
      state.sections[sectionId].layout.push(newLayoutItem);
      state.sections[sectionId].cardIds.push(newCardId);
      state.cards[newCardId] = newCard;
    },

    deleteCard: (state, action) => {
      const {sectionId, cardId} = action.payload;
      state.sections[sectionId].layout = state.sections[sectionId].layout.filter(item => item.i !== cardId);
      state.sections[sectionId].cardIds = state.sections[sectionId].cardIds.filter(card => card.id !== cardId);
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

  },
})

export const { setLocation, setActivePage, addPage, deletePage, updatePageName, toggleEditMode, updateLayout, addSection, deleteSection, updateSectionName, addCard, deleteCard, setParameters, setVisibleDataRange, setLegendVisibility } = dashboardSlice.actions;

export default dashboardSlice.reducer;