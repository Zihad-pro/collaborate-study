import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaChalkboardTeacher, FaBookOpen, FaCommentDots } from "react-icons/fa";

// Color palette
const COLORS = ["#4361ee", "#3a0ca3", "#4cc9f0"]; // Modern blue/purple scheme

const StudentDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  // Data fetching
  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["availableSessions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/sessions");
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

  // Data processing
  const tutorCount = users.filter((user) => user.role === "tutor").length;
  const approvedSessionCount = sessions.filter(
    (session) => session.status === "approved"
  ).length;
  const reviewCount = reviews.length;

  const pieData = [
    { name: "Tutors", value: tutorCount },
    { name: "Active Sessions", value: approvedSessionCount },
    { name: "Reviews", value: reviewCount },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Student Dashboard
      </h1>
      <p className="text-gray-600 mb-8">Overview of platform statistics</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<FaChalkboardTeacher className="text-2xl" />}
          label="Total Tutors"
          value={tutorCount}
          color="bg-gradient-to-br from-blue-600 to-blue-800"
        />
        <StatCard
          icon={<FaBookOpen className="text-2xl" />}
          label="Active Sessions"
          value={approvedSessionCount}
          color="bg-gradient-to-br from-purple-600 to-purple-800"
        />
        <StatCard
          icon={<FaCommentDots className="text-2xl" />}
          label="Total Reviews"
          value={reviewCount}
          color="bg-gradient-to-br from-cyan-500 to-cyan-700"
        />
      </div>

      {/* Data Visualization */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Platform Overview
            </h2>
            <p className="text-gray-500 text-sm">
              Distribution of tutors, sessions, and reviews
            </p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}`, "Count"]}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  border: "none",
                  fontWeight: 500,
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} rounded-xl shadow-sm overflow-hidden text-white`}>
    <div className="p-5 flex items-center">
      <div className="p-3 rounded-lg  bg-opacity-20 mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-white text-opacity-90">
          {label}
        </p>
        <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
      </div>
    </div>
  </div>
);

export default StudentDashboardHome;
