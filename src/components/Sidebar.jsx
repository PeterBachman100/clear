import { Drawer, List, Button, Typography, ListItem, ListItemButton, ListItemText } from "@mui/material";

export default function Sidebar({ pages, setActivePageId, addPage, deletePage }) {
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
                            <ListItemButton onClick={() => setActivePageId(page.id)}>
                                <ListItemText primary={page.name}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <ListItem>
                    <Button onClick={addPage} variant="outlined" color="secondary">Add Page</Button>
                </ListItem>
            </List>
                                

        </Drawer>
    );
}
