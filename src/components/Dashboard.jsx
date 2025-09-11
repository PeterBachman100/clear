import Sidebar from "./Sidebar";
import Page from "./Page";

export default function Dashboard() {

  return (
    <div>
      <div className='flex min-h-screen min-w-screen'>
        <Sidebar />
        <Page />
      </div>
    </div>
  );
}