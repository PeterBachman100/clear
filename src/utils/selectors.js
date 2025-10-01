import { createSelector } from '@reduxjs/toolkit';

const getWeatherSlice = (state) => state.weather;
const getLocationId = (state, locationId) => locationId;

export const selectWeatherByLocation = createSelector(
  [getWeatherSlice, getLocationId],
  (weatherSlice, locationId) => {
    return weatherSlice[locationId] || null;
  }
);

export const selectPages = (state) => state.dashboard.pages;
export const selectActivePageId = (state) => state.dashboard.activePageId;

const getCards = (state) => state.dashboard.cards;
const getSections = (state) => state.dashboard.sections;
const getPages = (state) => state.dashboard.pages;
const getCardId = (state, cardId) => cardId;
const getSectionId = (state, sectionId) => sectionId;
const getPageId = (state, sectionId, pageId) => pageId; 

export const selectSectionLocationId = createSelector(
  [getSections, getPages, getSectionId, getPageId],
  (sections, pages, sectionId, pageId) => {
    const sectionLocationId = sections[sectionId]?.locationId;
    if (sectionLocationId) {
        return sectionLocationId;
    }
    return pages[pageId]?.locationId || null;
  }
);

export const selectCardLocationId = createSelector(
  [getCards, getSections, getPages, getCardId],
  (cards, sections, pages, cardId) => {
    const card = cards[cardId];
    if (!card) return null;
    if (card.locationId) {
      return card.locationId;
    }
    
    const section = sections[card.sectionId];
    if (!section) return null;
    if (section.locationId) {
      return section.locationId;
    }

    const page = pages[section.pageId];
    return page?.locationId || null;
  }
);
