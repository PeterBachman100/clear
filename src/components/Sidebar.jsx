import { Drawer, List, Button, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'
import { addPage, setActivePage } from "./DashboardSlice";

export default function Sidebar() {

    const dispatch = useDispatch();
    const pages = useSelector(state => state.dashboard.pages);

    const handleAddPage = () => {
        dispatch(addPage());
    }
    const handleSetActivePage = (pageId) => {
        dispatch(setActivePage({pageId}));
    }

    return (
        <Drawer
            sx={{
                width: 200, flexShrink: 0, '& .MuiDrawer-paper': {
                    width: 200,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
        >
            <List className="w-full h-full">
                {pages.map((page) => {
                    return (
                        <ListItem key={page.id} >
                            <ListItemButton onClick={() => handleSetActivePage(page.id)}>
                                <ListItemText primary={page.name}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <ListItem>
                    <Button onClick={handleAddPage} variant="outlined" color="secondary">Add Page</Button>
                </ListItem>
            </List>
                                

        </Drawer>
    );
}
