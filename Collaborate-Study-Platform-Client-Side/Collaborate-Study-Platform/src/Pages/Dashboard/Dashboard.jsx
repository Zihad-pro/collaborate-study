import React from "react";
import { Link, NavLink, Outlet } from "react-router"; // Use 'react-router-dom' not 'react-router'
import {
  FaBookOpen,
  FaPlus,
  FaStickyNote,
  FaUsers,
  FaChalkboardTeacher,
  FaFileUpload,
  FaLayerGroup,
  FaHome,
} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/presentation_5494117.png";
import useUserRole from "../../Hooks/useUserRole";
import Loading from "../../Components/Loading/Loading";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  console.log(role);
  if (roleLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        <div className="navbar px-4 gap-4 bg-gray-800 text-white lg:hidden md:p-4">
          <div className="flex items-center gap-3 w-full ">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-square"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-lg">Collaborate Study</span>
            </Link>
          </div>
        </div>

        {/* Outlet Content */}
        <main className=" pt-5 flex-1">
          <ToastContainer position="top-right" />
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="min-h-full w-72 bg-[#111827] text-white p-6 space-y-8">
          <Link to="/" className=" flex items-center gap-2 mb-4">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold">Collaborate Study</span>
          </Link>

          {/* student */}
          {(role === "user") && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center gap-2">
                <RxDashboard />
                Dashboard
              </h3>
              <nav className="space-y-3 text-sm">
                <NavLink
                  to="myBooked"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaBookOpen /> My Booked Sessions
                </NavLink>
                <NavLink
                  to="createNote"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaPlus /> Create Note
                </NavLink>
                <NavLink
                  to="manageNotes"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaStickyNote /> Manage Notes
                </NavLink>
                <NavLink
                  to="studyMaterials"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaLayerGroup /> Study Materials
                </NavLink>
              </nav>
            </div>
          )}
          {/* tutor */}
          {role === "tutor" && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center gap-2">
                <RxDashboard />
                Tutor Dashboard
              </h3>
              <nav className="space-y-3 text-sm">
                <NavLink
                  to="createStudy"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaPlus /> Create Study Session
                </NavLink>
                <NavLink
                  to="mySessions"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaChalkboardTeacher /> My Sessions
                </NavLink>
                <NavLink
                  to="uploadMaterials"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaFileUpload /> Upload Materials
                </NavLink>
                <NavLink
                  to="myMaterials"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaLayerGroup /> My Materials
                </NavLink>
              </nav>
            </div>
          )}
          {/* admin */}
          {role === "admin" && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center gap-2 ">
                <RxDashboard />
                Admin Dashboard
              </h3>

              <nav className="space-y-3 text-sm">
                <NavLink
                  to="viewUsers"
                  className="flex items-center gap-2 hover:text-yellow-300"
                >
                  <FaUsers /> View Users
                </NavLink>
                <NavLink
                  to="allSessions"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaChalkboardTeacher /> All Sessions
                </NavLink>
                <NavLink
                  to="allMaterials"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    }`
                  }
                >
                  <FaLayerGroup /> All Materials
                </NavLink>
              </nav>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
