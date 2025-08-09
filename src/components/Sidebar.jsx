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
                    const isLastPage = pages.length === 1;
                    return (
                        <ListItem
                            key={page.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 0,
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => deletePage(page.id)}
                                sx={{ m: 1, minWidth: 'auto', p: 0.5 }}
                                disabled={isLastPage}
                            >
                                X
                            </Button>
                            <ListItemButton
                                onClick={() => setActivePageId(page.id)}
                                sx={{ flexGrow: 1 }}
                            >
                                <ListItemText primary={page.name}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <ListItem>
                    <ListItemButton onClick={addPage}>
                        <ListItemText primary='Add Page'></ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}
