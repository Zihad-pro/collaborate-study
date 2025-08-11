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
import UseAuth from "../../../Hooks/UseAuth";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const COLORS = ["#F59E0B", "#10B981", "#EF4444"]; // amber, emerald, red

const DashboardTutorsHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth(); // ✅ Get logged-in user

  const {
    data: sessions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tutorSessions", user?.email],
    enabled: !!user?.email, // only fetch when email exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load sessions.</p>;

  const pendingCount = sessions.filter((s) => s.status === "pending").length;
  const approvedCount = sessions.filter((s) => s.status === "approved").length;
  const rejectedCount = sessions.filter((s) => s.status === "rejected").length;
  const totalSessions = sessions.length;

  const pieData = [
    { name: "Pending", value: pendingCount },
    { name: "Approved", value: approvedCount },
    { name: "Rejected", value: rejectedCount },
  ];

  const rejectedSessions = sessions.filter((s) => s.status === "rejected");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tutor Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your session submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon={<FaHourglassHalf className="text-xl" />}
          label="Pending Sessions"
          value={pendingCount}
          total={totalSessions}
          color="bg-gradient-to-br from-amber-400 to-amber-600"
        />
        <StatCard
          icon={<FaCheckCircle className="text-xl" />}
          label="Approved Sessions"
          value={approvedCount}
          total={totalSessions}
          color="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />
        <StatCard
          icon={<FaTimesCircle className="text-xl" />}
          label="Rejected Sessions"
          value={rejectedCount}
          total={totalSessions}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Session Status Distribution
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Visual breakdown of your session approval status
          </p>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} sessions`, "Count"]}
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
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rejected Sessions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Rejected Sessions Details
        </h2>
        {rejectedSessions.length === 0 ? (
          <p className="text-gray-500">No rejected sessions found.</p>
        ) : (
          <ul className="space-y-6 max-h-96 overflow-y-auto">
            {rejectedSessions.map((session) => (
              <li
                key={session._id}
                className="border border-red-300 rounded p-4 bg-red-50"
              >
                <h3 className="text-lg font-bold text-red-700 mb-1">
                  {session.title}
                </h3>
                <p>
                  <strong>Rejection Reason:</strong>{" "}
                  <span className="italic">
                    {session.rejectionReason || "N/A"}
                  </span>
                </p>
                <p className="mt-1">
                  <strong>Feedback:</strong>{" "}
                  <span className="italic">{session.feedback || "N/A"}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, total, color }) => (
  <div className={`${color} rounded-lg overflow-hidden text-white`}>
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-opacity-20 mr-3">{icon}</div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-white bg-opacity-30 rounded-full">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(value / total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-white text-opacity-80 mt-1">
            {Math.round((value / total) * 100)}% of total sessions
          </p>
        </div>
      )}
    </div>
  </div>
);

export default DashboardTutorsHome;
