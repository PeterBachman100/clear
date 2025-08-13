import Sidebar from "./Sidebar";
import Page from "./Page";
import { useState } from "react";
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
      ],
    },
    {
      id: 'page-2',
      name: 'Mountain Loop Highway',
      editMode: false,
      location: {
        name: "Mount Dickerman",
        admin1: "Washington",
        country: "United States",
        latitude: 48.06872,
        longitude: 121.47039
      },
      sections: [
        {
          id: '1',
          name: 'Section 1',
          layout: [],
          cards: [],
        },
      ],
    }
  ],
};

export default function Dashboard() {

  const [dashboardState, setDashboardState] = useState(initialDashboardState);

  //LOCATION
  const setLocation = (pageId, location) => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        pages: prevState.pages.map((page) =>
          page.id === pageId ?
            { ...page, location: location } :
            page
        )
      };
    });
  };

  const toggleEditMode = (pageId) => {
    setDashboardState((prevState) => ({
        ...prevState,
        pages: prevState.pages.map((page) => ({
            ...page,
            editMode: page.id === pageId ? !page.editMode : false,
        })),
    }));
  };

  const addPage = () => {
    const newId = uuidv4();
    const newPage = {
      id: newId,
      name: 'New Page',
      editMode: false,
      location: [],
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

      return {
        ...prevState,
        pages: updatedPages,
        activePageId: updatedPages[0].id
      }
    })
  }

  const updatePageName = (pageId, newPageName) => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        pages: prevState.pages.map((page) =>
          page.id === pageId ? 
            { ...page, name: newPageName } :
            page
        )
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

  const updateSectionName = (pageId, sectionId, newName) => {
    setDashboardState(prevState => {
      return {
        ...prevState,
        pages: prevState.pages.map((page) =>
          page.id === pageId ?
            {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId ?
                  {
                    ...section,
                    name: newName
                  } :
                  section
              )
            } :
            page
        )
      };
    });
  };

  const addCard = (pageId, sectionId) => {
    const newId = uuidv4();
    const newCard = { id: newId, name: 'Card Name' };
    const newLayoutItem = { i: newId, x: Infinity, y: Infinity, w: 4, h: 4 };

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
      const updatedPages = prevState.pages.map(page => {
        if (page.id === pageId) {
          const updatedSections = page.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                cards: section.cards.filter(card => card.id !== cardId),
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

      return {
        ...prevState,
        pages: updatedPages,
      };
    });
  };

  const updateCardName = (pageId, sectionId, cardId, newName) => {
    setDashboardState(prevState => {
      return {
        ...prevState,
        pages: prevState.pages.map((page) =>
          page.id === pageId ?
            {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId ?
                  {
                    ...section,
                    // Go one level deeper to map over the cards
                    cards: section.cards.map((card) =>
                      card.id === cardId ?
                        {
                          ...card,
                          name: newName
                        } :
                        card
                    )
                  } :
                  section
              )
            } :
            page
        )
      };
    });
  };

  const handleLayoutChange = (pageId, sectionId, newLayout) => {
    setDashboardState(prevState => {
        
        const pageIndex = prevState.pages.findIndex(page => page.id === pageId);
        if (pageIndex === -1) return prevState;
      
        const updatedPage = { ...prevState.pages[pageIndex] };
        
        const sectionIndex = updatedPage.sections.findIndex(section => section.id === sectionId);
        if (sectionIndex === -1) return prevState;

        const updatedSection = { ...updatedPage.sections[sectionIndex] };
        
        updatedSection.layout = newLayout;
        
        const updatedSections = [...updatedPage.sections];
        updatedSections[sectionIndex] = updatedSection;
        updatedPage.sections = updatedSections;

        const updatedPages = [...prevState.pages];
        updatedPages[pageIndex] = updatedPage;

        return {
            ...prevState,
            pages: updatedPages,
        };
    });
  };

  const setActivePageId = (pageId) => {
    setDashboardState((prevState) => {
      const updatedPages = prevState.pages.map((page) => {
        if (page.id === prevState.activePageId) {
          return {...page, editMode: false};
        } else {
          return page;
        }
      });

      return {
        ...prevState,
        activePageId: pageId,
        pages: updatedPages
      };
    });
  };

  const activePage = dashboardState.pages.find(
    (page) => page.id === dashboardState.activePageId
  );
    
  return (
    <div>
      <div className='flex min-h-screen min-w-screen'>
        <Sidebar pages={dashboardState.pages} setActivePageId={setActivePageId} addPage={addPage} deletePage={deletePage} />
        <Page page={activePage} setLocation={setLocation} updatePageName={updatePageName} updateSectionName={updateSectionName} updateCardName={updateCardName} toggleEditMode={toggleEditMode} editMode={activePage.editMode} onLayoutChange={handleLayoutChange} deletePage={deletePage} addSection={addSection} deleteSection={deleteSection} addCard={addCard} deleteCard={deleteCard} />
      </div>
    </div>
  );
}