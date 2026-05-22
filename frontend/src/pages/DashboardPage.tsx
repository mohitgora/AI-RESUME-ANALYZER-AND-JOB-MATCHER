import React, { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Brain,
  History,
  Settings,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Resume Analysis",
    icon: FileText,
    path: "/resume-analysis",
  },
  {
    name: "ATS Report",
    icon: Brain,
    path: "/ats-report",
  },
  {
    name: "Semantic Match",
    icon: Brain,
    path: "/semantic-match",
  },
  {
    name: "Upload Resume",
    icon: Upload,
    path: "/upload",
  },
  {
    name: "History",
    icon: History,
    path: "/history",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-screen w-72
          bg-white/5 backdrop-blur-xl border-r border-white/10
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ResumAI
            </h1>

            <p className="text-xs text-gray-400 mt-1">
              AI Resume Platform
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-2xl
                  transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                      : "hover:bg-white/10 text-gray-300"
                  }
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* USER CARD */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                M
              </div>

              <div>
                <h3 className="font-semibold">Mohit</h3>
                <p className="text-xs text-gray-400">
                  AI Engineer
                </p>
              </div>
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 transition rounded-xl py-2 text-sm">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <h2 className="text-xl font-bold">
                AI Resume Analyzer
              </h2>

              <p className="text-sm text-gray-400">
                Production AI SaaS Dashboard
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <input
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm"
                />
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                M
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;