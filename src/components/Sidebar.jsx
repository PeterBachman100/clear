import { Box, List, Button, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'
import { addPage, setActivePage } from "./DashboardSlice";

export default function Sidebar({ closeDrawer }) {

    const dispatch = useDispatch();
    const pages = useSelector(state => state.dashboard.pages);
    const activePage = useSelector(state => state.dashboard.activePageId);

    const handleAddPage = () => {
        closeDrawer();
        dispatch(addPage());
    }
    const handleSetActivePage = (pageId) => {
        closeDrawer();
        dispatch(setActivePage({pageId}));
    }

    return (
        <Box
            sx={{
                width: 200, flexShrink: 0, '& .MuiDrawer-paper': {
                    width: 200,
                    boxSizing: 'border-box',
                },
            }}
        >
            <List className="w-full h-full">
                {Object.values(pages).map((page) => {
                    return (
                    <ListItem key={page.id}>
                        <ListItemButton selected={page.id === activePage} onClick={() => {
                            handleSetActivePage(page.id);
                        }}>
                            <ListItemText primary={page.name}></ListItemText>
                        </ListItemButton>
                    </ListItem>
                    );
                })}
                <ListItem>
                    <Button onClick={handleAddPage} variant="outlined" color="secondary">Add Page</Button>
                </ListItem>
            </List>               
        </Box>
    );
}
