import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BiTime } from "react-icons/bi";
import Loading from "../../../Components/Loading/Loading";
import { Link } from "react-router";
import UseAxios from "../../../Hooks/UseAxios";

const StudySession = () => {
  const axiosInstance = UseAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 6;

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["availableSessions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/sessions");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const filteredSessions = sessions.filter(
    (s) => s.status === "approved" && s.hasMaterials === true
  );

  const indexOfLast = currentPage * sessionsPerPage;
  const indexOfFirst = indexOfLast - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const paginate = (page) => setCurrentPage(page);

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto mt-20 min-h-screen">
      <h1 className="text-center text-5xl font-bold mb-10 text-gray-800">
        Study All Sessions
      </h1>

      {filteredSessions.length === 0 ? (
        <p className="text-center text-gray-500">
          No approved sessions with materials available.
        </p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentSessions.map((session) => {
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
                    <h3 className="text-xl font-semibold text-gray-800 mt-3 mb-2">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-300">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100 border-r disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-4 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "bg-primary1 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } border-r last:border-r-0`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudySession;
