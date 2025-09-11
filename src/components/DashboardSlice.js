import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialDashboardState = {
  activePageId: 'page-1',

  pages: [
    {
      id: 'page-1',
      name: 'Snoqualmie Pass',
      location: {
        name: "Snoqualmie Pass",
        admin1: "Washington",
        country: "United States",
        latitude: 47.3923,
        longitude: -121.4001
      },
      editMode: false,
      sections: [
        {
          id: '1',
          name: 'Section 1',
          layout: [
            {i: '1', x: 0, y: 0, h: 4, w: 12},
          ],
          cards: [
            {
              id: '1',
              selectedParameters: ['temperature']
            },
          ],
        },
      ],
    },
  ],
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {

    // LOCATION
    setLocation: (state, action) => {
      const { pageId, location } = action.payload;
      const page = state.pages.find(p => p.id === pageId);
      if (page) {
        page.location = location;
      }
    },


    // PAGE
    setActivePage: (state, action) => {
      const {pageId} = action.payload;
      state.activePageId = pageId;
    },

    addPage: (state) => {
      const newId = uuidv4();
      const newPage = {id: newId, name: 'New Page', editMode: false, location: [], sections: []}
      state.pages.push(newPage);
      state.activePageId = newId;
    },

    deletePage: (state, action) => {
      const {pageId} = action.payload;
      if (state.pages.length === 1) {
        return; 
      }
      const updatedPages = state.pages.filter((page) => page.id !== pageId);
      state.pages = updatedPages;
      state.activePageId = updatedPages[0].id; 
    },

    updatePageName: (state, action) => {
      const {pageId, newPageName} = action.payload;
      const page = state.pages.find(page => page.id === pageId);
      page.name = newPageName;
    },


    // LAYOUT
    toggleEditMode: (state, action) => {
      const {pageId} = action.payload;
      state.pages.forEach((page) => {
        page.editMode = page.id === pageId ? !page.editMode : false;
      });
    },

    updateLayout: (state, action) => {
      const {pageId, sectionId, newLayout} = action.payload;
      const page = state.pages.find(page => page.id === pageId);
      const section = page.sections.find(s => s.id === sectionId);
      section.layout = newLayout; 
    },


    // SECTION
    addSection: (state, action) => {
      const {pageId} = action.payload;
      const newId = uuidv4();
      const newSection = {id: newId, name: 'Section Name', layout: [], cards: []}
      const page = state.pages.find(page => page.id === pageId);
      page.sections.push(newSection);
    },

    deleteSection: (state, action) => {
      const {pageId, sectionId} = action.payload;
      const page = state.pages.find(page => page.id === pageId);
      page.sections = page.sections.filter(section => section.id !== sectionId);
    },

    updateSectionName: (state, action) => {
      const {pageId, sectionId, newName} = action.payload;
      const page = state.pages.find(page => page.id === pageId);
      const section = page.sections.find(section => section.id === sectionId);
      section.name = newName;
    },


    // CARD
    addCard: (state, action) => {
      const {pageId, sectionId} = action.payload;
      const newId = uuidv4();
      const newCard = { id: newId, selectedParameters: ['temperature'] };
      const newLayoutItem = { i: newId, x: 0, y: Infinity, w: 4, h: 4 };
      const page = state.pages.find(page => page.id === pageId);
      const section = page.sections.find(section => section.id === sectionId);
      section.layout.push(newLayoutItem);
      section.cards.push(newCard);
    },

    deleteCard: (state, action) => {
      const {pageId, sectionId, cardId} = action.payload;
      const page = state.pages.find(page => page.id === pageId);
      const section = page.sections.find(section => section.id === sectionId);
      section.cards = section.cards.filter(card => card.id !== cardId);
      section.layout = section.layout.filter(item => item.id !== cardId);
    },


    // PARAMETERS
    setParameters: (state, action) => {
      const {pageId, sectionId, cardId, selectedParameters} = action.payload;
      const page = state.pages.find(page => page.id === pageId);
      const section = page.sections.find(section => section.id === sectionId);
      const card = section.cards.find(card => card.id === cardId);
      card.selectedParameters = selectedParameters;
    },

  },
})

export const { setLocation, setActivePage, addPage, deletePage, updatePageName, toggleEditMode, updateLayout, addSection, deleteSection, updateSectionName, addCard, deleteCard, setParameters } = dashboardSlice.actions;

export default dashboardSlice.reducer;