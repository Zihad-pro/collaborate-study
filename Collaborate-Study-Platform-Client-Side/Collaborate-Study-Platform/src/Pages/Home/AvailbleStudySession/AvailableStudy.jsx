import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BiTime } from "react-icons/bi";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import { FaBookOpen } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Link } from "react-router";

const AvailableStudy = () => {
  const axiosSecure = useAxiosSecure();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["availableSessions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/sessions");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const filteredSessions = sessions
    .filter((s) => s.status === "approved" && s.hasMaterials === true)
    .slice(0, 6);

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="md:text-5xl text-3xl font-bold text-gray-800 inline-flex items-center gap-3 justify-center md:py-5">
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaBookOpen className=" text-4xl" />
          </motion.span>
          <span>Available Study Sessions</span>
        </h2>
      </div>

      {filteredSessions.length === 0 ? (
        <p className="text-center text-gray-500">
          No approved sessions with materials available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => {
            const isClosed = new Date(session.registrationEnd) < new Date();

            return (
              <div
                key={session._id}
                className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 overflow-hidden transition"
              >
                <div className="p-5">
                  <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-full h-48 object-cover rounded-t"
                  />

                  <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-3">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {session.description?.slice(0, 100)}...
                  </p>

                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                        isClosed
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <BiTime />
                      {isClosed ? "Closed" : "Ongoing"}
                    </span>
                    <Link to={`/availableStudyDetails/${session._id}`}>
                      <button className="text-sm bg-primary1 hover:bg-primary2 text-white px-4 py-2 rounded-md shadow cursor-pointer">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableStudy;
