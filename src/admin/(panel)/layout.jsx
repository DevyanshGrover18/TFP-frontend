import Sidebar from "@/components/common/Sidebar";
import TopNav from "@/components/common/TopNav";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <main className="flex flex-col flex-1">
        <div className="top-0 sticky">
          <TopNav />
        </div>
        <div className="flex-1 overflow-y-auto bg-[#f8f8f8] p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;