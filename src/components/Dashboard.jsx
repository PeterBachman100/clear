import Sidebar from "./Sidebar";
import Page from "./Page";
import { AppBar, Button, Toolbar } from "@mui/material";
import { useState } from "react";

export default function Dashboard() {
    const [sections, setSections] = useState(0);
      
      const addSection = () => {
        setSections((prev) => prev + 1);
      }
    
      
    
      const [editMode, setEditMode] = useState(false);
      const toggleEditMode = () => {
        setEditMode(!editMode);
      };
    
      return (
        <div>
          <AppBar className="sticky" position="static" sx={{ mb: 2 }}>
            <Toolbar>
              <Button onClick={addSection} variant="contained" color="secondary">Add Location Section</Button>
              <Button onClick={toggleEditMode} variant="contained" color="error">
              {editMode ? "Done" : "Edit Layout"}
            </Button>
            </Toolbar>
          </AppBar>
          <Sidebar />
          <Page sections={sections} editMode={editMode} />
        </div>
      );
}