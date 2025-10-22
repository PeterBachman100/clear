import Sidebar from "./Sidebar";
import Page from "./Page";
import { useState } from "react";
import TopBar from "./TopBar";
import { Drawer, Box } from "@mui/material";

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <div className="bg-black">
      <div className='flex flex-col min-h-screen min-w-screen bg-transparent'>
        <TopBar onMenuClick={toggleDrawer(true)} />
        <div className='mt-20 bg-transparent'>
          <Page />
        </div>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Sidebar closeDrawer={() => setIsDrawerOpen(false)} />
        </Drawer>
      </div>
    </div>
  );
}