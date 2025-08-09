import Sidebar from "./Sidebar";
import Page from "./Page";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const initialDashboardState = {
  activePageId: 'page-1',

  pages: [
    {
      id: 'page-1',
      name: 'Page 1',
      sections: [
        {
          id: '1',
          name: 'Section 1',
          layout: [
            {i: '1', x: 0, y: 0, h: 4, w: 6},
            {i: '2', x: 6, y: 0, h: 2, w: 6},
            {i: '3', x: 6, y: 2, h: 2, w: 3},
            {i: '4', x: 9, y: 2, h: 2, w: 3}
          ],
          cards: [
            {
              id: '1',
              name: "Card 1",
            },
            {
              id: '2',
              name: "Card 2",
            },
            {
              id: '3',
              name: 'Card 3',
            },
            {
              id: '4',
              name: 'Card 4'
            }
          ],
        },
        {
          id: '2',
          name: 'Section 2',
          layout: [
            {i: '1', x: 0, y: 0, h: 1, w: 1},
          ],
          cards: [
            {
              id: '1',
              name: "Card 1",
            },
          ],
        }
      ],
    },
    {
    id: 'page-2',
      name: 'Page 2',
      sections: [
        {
          id: '1',
          name: 'Section 1',
          layout: [],
          cards: [
            
          ],
        },
      ],
    }
  ],
};

export default function Dashboard() {

  const [dashboardState, setDashboardState] = useState(initialDashboardState);

  const addPage = () => {
    const newId = uuidv4();
    const newPage = {
      id: newId,
      name: 'New Page',
      sections: []
    }

    setDashboardState((prevState) => {
      const updatedPages = [...prevState.pages, newPage];
      return {...prevState, pages: updatedPages, activePageId: newId,};
    });
  };

  const deletePage = (pageId) => {
    setDashboardState((prevState) => {
      if (prevState.pages.length === 1) {
        return prevState;
      }
      
      const updatedPages = prevState.pages.filter((page) => page.id !== pageId);
      
      let newActivePageId = prevState.activePageId;

      if (prevState.activePageId === pageId) {
        newActivePageId = updatedPages.length > 0 ? updatedPages[0].id : null;
      }

      return {
        ...prevState,
        pages: updatedPages,
        activePageId: newActivePageId,
      };
    });
  };

  const addSection = (pageId) => {
    const newId = uuidv4();
    const newSection = {
      id: newId,
      name: 'Section Name',
      layout: [],
      cards: [],
    }
    setDashboardState(prevState => {
      const pageIndex = prevState.pages.findIndex(page => page.id === pageId);
      if (pageIndex === -1) return prevState;

      const updatedPage = {...prevState.pages[pageIndex]};
      updatedPage.sections = [...updatedPage.sections, newSection];

      const updatedPages = [...prevState.pages];
      updatedPages[pageIndex] = updatedPage;

      return {...prevState, pages: updatedPages};
    });
  };

  const deleteSection = (pageId, sectionId) => {
    setDashboardState(prevState => {
      const pageIndex = prevState.pages.findIndex(page => page.id === pageId);
      if (pageIndex === -1) return prevState;

      const updatedPage = {...prevState.pages[pageIndex]};
      updatedPage.sections = updatedPage.sections.filter((section) => {
        return section.id !== sectionId;
      });

      const updatedPages = [...prevState.pages];
      updatedPages[pageIndex] = updatedPage;

      return {...prevState, pages: updatedPages};
    });
  }

  const addCard = (pageId, sectionId) => {
    const newId = uuidv4();
    const newCard = { id: newId, name: 'Card Name' };
    const newLayoutItem = { i: newId, x: 0, y: Infinity, w: 4, h: 4 };

    setDashboardState(prevState => {
      const updatedPages = prevState.pages.map(page => {
        if (page.id === pageId) {
          const updatedSections = page.sections.map(section => {
            if (section.id === sectionId) {
             
              const updatedCards = [...section.cards, newCard];
              const updatedLayout = [...section.layout, newLayoutItem];
              
              return {
                ...section,
                cards: updatedCards,
                layout: updatedLayout,
              };
            }
            return section;
          });

          return {
            ...page,
            sections: updatedSections,
          };
        }
        return page;
      });

      return {
        ...prevState,
        pages: updatedPages,
      };
    });
  };


  const deleteCard = (pageId, sectionId, cardId) => {
    setDashboardState(prevState => {
      // Use map to create an immutable copy of the pages array.
      const updatedPages = prevState.pages.map(page => {
        // Find the page we want to update.
        if (page.id === pageId) {
          // Create an immutable copy of the sections array for that page.
          const updatedSections = page.sections.map(section => {
            // Find the section we want to update.
            if (section.id === sectionId) {
              return {
                ...section,
                // Use .filter() to create a new cards array without the deleted card.
                cards: section.cards.filter(card => card.id !== cardId),
                // Use .filter() to create a new layout array without the deleted item.
                layout: section.layout.filter(item => item.i !== cardId),
              };
            }
            return section;
          });

          return {
            ...page,
            sections: updatedSections,
          };
        }
        return page;
      });

      // Return the new state object with the updated pages array.
      return {
        ...prevState,
        pages: updatedPages,
      };
    });
  };

  const handleLayoutChange = (pageId, sectionId, newLayout) => {
    setDashboardState(prevState => {
      // Create a deep copy of the state to avoid direct mutation
      const newState = JSON.parse(JSON.stringify(prevState));
      const pageToUpdate = newState.pages.find(page => page.id === pageId);
      if (pageToUpdate) {
        const sectionToUpdate = pageToUpdate.sections.find(section => section.id === sectionId);
        if (sectionToUpdate) {
          sectionToUpdate.layout = newLayout;
        }
      }
      return newState;
    });
  };
  
  const setActivePageId = (pageId) => {
    setDashboardState(prevState => ({
      ...prevState,
      activePageId: pageId
    }));
  };
  const activePage = dashboardState.pages.find(
    (page) => page.id === dashboardState.activePageId
  );
    
  return (
    <div>
      <div className='flex min-h-screen min-w-screen'>
        <Sidebar pages={dashboardState.pages} setActivePageId={setActivePageId} addPage={addPage} deletePage={deletePage} />
        <Page page={activePage} onLayoutChange={handleLayoutChange} addSection={addSection} deleteSection={deleteSection} addCard={addCard} deleteCard={deleteCard} />
      </div>
    </div>
  );
}