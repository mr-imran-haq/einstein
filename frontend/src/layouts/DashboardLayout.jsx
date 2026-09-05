import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AiOrb from "../components/AiOrb";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-8 pb-8">
          <Outlet />
        </main>
      </div>
      <AiOrb />
    </div>
  );
}