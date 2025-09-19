import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialDashboardState = {
  activePageId: 'page-1',
  pages: {
    'page-1': {
      id: 'page-1',
      name: 'Kirkland',
      location: {
        name: "Kirkland",
        admin1: "Washington",
        country: "United States",
        latitude: 47.6751,
        longitude: -122.1930
      },
      editMode: false,
      sectionIds: ['1'],
    },
  },
  sections: {
    '1': {
      id: '1',
      name: 'Section 1',
      pageId: 'page-1',
      layout: [
        {i: '1', x: 0, y: 0, h: 4, w: 12},
        {i: '2', x: 0, y: 4, h: 4, w: 12}
      ],
      cardIds: ['1', '2'],
    },
  },
  cards: {
    '1': {
      id: '1',
      sectionId: '1',
      selectedParameters: ['temperature', 'precipitation_probability', 'precipitation', 'cloud_cover', 'cloud_cover_low', 'visibility', 'wind_speed', 'wind_gusts', 'uv_index'],
      visibleDataRange: [0, 72],
    },
    '2': {
      id: '2',
      sectionId: '1',
      selectedParameters: ['temperature', 'cloud_cover'],
      visibleDataRange: [0, 200]
    }
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
    }

  },
})

export const { setLocation, setActivePage, addPage, deletePage, updatePageName, toggleEditMode, updateLayout, addSection, deleteSection, updateSectionName, addCard, deleteCard, setParameters, setVisibleDataRange } = dashboardSlice.actions;

export default dashboardSlice.reducer;