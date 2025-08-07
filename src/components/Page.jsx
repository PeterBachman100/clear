import { useState } from 'react';
import Section from "./Section";
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";



      
export default function Page({ sections, editMode }) {

    //React-Grid-Layout
    const ResponsiveReactGridLayout = WidthProvider(Responsive);
    const [layout, setLayout] = useState([]);
    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
    };

    return (
        <div>
            <ResponsiveReactGridLayout
                className="layout bg-black"
                autoSize="true"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                isResizable={editMode}
                isDraggable={editMode}
                onLayoutChange={handleLayoutChange}
                >
                {Array.from({ length: sections }, (_, i) => (
                    <div key={i}>
                    <Section />          
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
}