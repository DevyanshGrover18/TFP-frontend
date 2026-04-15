"use client";

import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { logoutAdmin } from "@/app/services/adminAuthService";
import { useRouter } from "next/navigation";

const TopNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutAdmin()
    if(response.success){
      router.push('admin/login')
    }
  };

  return (
    <div className="h-16 bg-white flex items-center justify-between px-4 md:px-6 border-b border-gray-100">

      {/* Left — Page title */}
      <h1 className="text-sm font-semibold text-gray-800">Dashboard</h1>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">

        {/* Search */}
        {/* <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition">
          <Search size={16} />
        </button>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button> */}

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center select-none">
              AD
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute  right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              
              <button
                onClick={handleLogout}
                className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default TopNav;