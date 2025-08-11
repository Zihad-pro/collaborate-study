import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

// React Icons
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentDots,
} from "react-icons/fa";

const STATUS_COLORS = ["#FBBF24", "#10B981", "#EF4444"]; // yellow, green, red
const USER_COLORS = ["#3B82F6", "#06B6D4"]; // blue, cyan

const DashboardAdminHome = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch data
  const { data: sessions = [] } = useQuery({
    queryKey: ["allSessions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/sessions");
      return res.data;
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews");
      return res.data;
    },
  });

  // Process data
  const pendingCount = sessions.filter((s) => s.status === "pending").length;
  const approvedCount = sessions.filter((s) => s.status === "approved").length;
  const rejectedCount = sessions.filter((s) => s.status === "rejected").length;
  const totalSessions = sessions.length;
  const totalUsers = users.length;
  const tutorCount = users.filter((u) => u.role === "tutor").length;
  const reviewCount = reviews.length;

  const sessionStatusData = [
    { name: "Pending", value: pendingCount },
    { name: "Approved", value: approvedCount },
    { name: "Rejected", value: rejectedCount },
  ];

  const userRoleData = [
    { name: "Students", value: totalUsers - tutorCount },
    { name: "Tutors", value: tutorCount },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<FaUsers className="text-2xl" />}
          label="Total Users"
          value={totalUsers}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          icon={<FaChalkboardTeacher className="text-2xl" />}
          label="Tutors"
          value={tutorCount}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<FaBookOpen className="text-2xl" />}
          label="Total Sessions"
          value={totalSessions}
          color="bg-gradient-to-br from-gray-600 to-gray-700"
        />
        <StatCard
          icon={<FaCommentDots className="text-2xl" />}
          label="Reviews"
          value={reviewCount}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
      </div>

      {/* Session Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<FaHourglassHalf className="text-2xl" />}
          label="Pending Sessions"
          value={pendingCount}
          color="bg-gradient-to-br from-yellow-400 to-yellow-500"
        />
        <StatCard
          icon={<FaCheckCircle className="text-2xl" />}
          label="Approved Sessions"
          value={approvedCount}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={<FaTimesCircle className="text-2xl" />}
          label="Rejected Sessions"
          value={rejectedCount}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Data Overview
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Session Status Chart */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-600 mb-4">
              Session Status
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {sessionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} sessions`, "Count"]}
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Role Chart */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-600 mb-4">
              User Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={USER_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} users`, "Count"]}
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} rounded-xl shadow-sm overflow-hidden`}>
    <div className="p-5 flex items-center">
      <div className="p-3 rounded-lg bg-white bg-opacity-20 mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-white text-opacity-80">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  </div>
);

export default DashboardAdminHome;
