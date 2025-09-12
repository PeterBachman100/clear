import { createSelector } from '@reduxjs/toolkit';

const selectDashboardState = state => state.dashboard;

export const selectCardParameters = createSelector(
  [
    selectDashboardState,
    (state, pageId) => pageId,
    (state, pageId, sectionId) => sectionId,
    (state, pageId, sectionId, cardId) => cardId,
  ],
  (dashboardState, pageId, sectionId, cardId) => {
    const page = dashboardState.pages.find(p => p.id === pageId);
    if (!page) return [];
    const section = page.sections.find(s => s.id === sectionId);
    if (!section) return [];
    const card = section.cards.find(c => c.id === cardId);
    return card ? card.selectedParameters : [];
  }
);

