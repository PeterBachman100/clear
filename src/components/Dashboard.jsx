import Sidebar from "./Sidebar";
import Page from "./Page";
import { useSelector, useDispatch } from 'react-redux'
import { setLocation, setActivePage, addPage, deletePage, updatePageName, toggleEditMode, updateLayout, addSection, deleteSection, updateSectionName, addCard, deleteCard, setParameters } from './DashboardSlice'
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {

  const dashboardState = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  //LOCATION
  const handleSetLocation = (pageId, newLocation) => {
    dispatch(setLocation({ pageId: pageId, location: newLocation }));
  };

  //PAGE
  const activePage = dashboardState.pages.find(
    (page) => page.id === dashboardState.activePageId
  );
  const handleSetActivePage = (pageId) => {
    dispatch(setActivePage({pageId: pageId}));
  }
  const handleAddPage = () => {
    dispatch(addPage());
  }
  const handleDeletePage = (pageId) => {
    dispatch(deletePage({pageId: pageId}));
  }
  const handleUpdatePageName = (pageId, newPageName) => {
    dispatch(updatePageName({pageId, newPageName}));
  }

  //LAYOUT
  const handleToggleEditMode = (pageId) => {
    dispatch(toggleEditMode({pageId: pageId}));
  }
  const handleLayoutChange = (pageId, sectionId, newLayout) => {
    dispatch(updateLayout({ pageId, sectionId, newLayout }));
  };

  //SECTION
  const handleAddSection = (pageId) => {
    dispatch(addSection({pageId}));
  }
  const handleDeleteSection = (pageId, sectionId) => {
    dispatch(deleteSection({pageId, sectionId}));
  }
  const handleUpdateSectionName = (pageId, sectionId, newName) => {
    dispatch(updateSectionName({pageId, sectionId, newName}));
  }

  //CARD
  const handleAddCard = (pageId, sectionId) => {
    dispatch(addCard({pageId, sectionId}));
  }
  const handleDeleteCard = (pageId, sectionId, cardId) => {
    dispatch(deleteCard({pageId, sectionId, cardId}));
  }

  //PARAMETERS
  const handleSetParameters = (pageId, sectionId, cardId, selectedParameters) => {
    dispatch(setParameters({pageId, sectionId, cardId, selectedParameters}));
  }

  return (
    <div>
      <div className='flex min-h-screen min-w-screen'>
        <Sidebar pages={dashboardState.pages} setActivePage={handleSetActivePage} addPage={handleAddPage} deletePage={deletePage} />
        <Page page={activePage} deletePage={handleDeletePage} updatePageName={handleUpdatePageName} toggleEditMode={handleToggleEditMode} editMode={activePage.editMode} onLayoutChange={handleLayoutChange} setLocation={handleSetLocation} addSection={handleAddSection} deleteSection={handleDeleteSection} updateSectionName={handleUpdateSectionName} addCard={handleAddCard} deleteCard={handleDeleteCard} setSelectedParameters={handleSetParameters} />
      </div>
    </div>
  );
}