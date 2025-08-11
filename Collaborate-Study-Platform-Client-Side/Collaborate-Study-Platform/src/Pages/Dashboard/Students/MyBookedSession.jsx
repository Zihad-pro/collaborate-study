import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Loading from "../../../Components/Loading/Loading";
import { Link } from "react-router";

const MyBookedSession = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookedSessions = [], isLoading } = useQuery({
    queryKey: ["myBookedSessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 ">
      <h2 className="text-3xl font-bold text-primary1 mb-6">
        My Booked Sessions
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-primary1 text-white  top-0 z-20">
            <tr>
              <th className="py-4 px-6 text-sm font-semibold">#</th>
              <th className="py-4 px-6 text-sm font-semibold">Image</th>
              <th className="py-4 px-6 text-sm font-semibold">Title</th>
              <th className="py-4 px-6 text-sm font-semibold">Tutor</th>
              <th className="py-4 px-6 text-sm font-semibold">Schedule</th>
              <th className="py-4 px-6 text-sm font-semibold">Fee</th>
             
              <th className="py-4 px-6 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookedSessions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  You haven't booked any sessions yet.
                </td>
              </tr>
            ) : (
              bookedSessions.map((session, idx) => (
                <tr
                  key={session._id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-neutral-100 transition"
                >
                  <td className="py-3 px-6 align-middle text-sm font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-6 align-middle">
                    <img
                      src={session.image}
                      alt={session.sessionTitle}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-6 align-middle font-medium text-primary1 text-sm">
                    {session.sessionTitle}
                  </td>
                  <td className="py-3 px-6 align-middle text-sm">
                    {session.tutorName}
                  </td>
                  <td className="py-3 px-6 align-middle text-sm">
                    {session.classStart} → {session.classEnd}
                  </td>
                  <td className="py-3 px-6 align-middle text-sm">
                    {session.fee === "free" ? "Free" : `৳${session.fee}`}
                  </td>
                 
                  <td className="py-3 px-6 align-middle">
                    <Link to={`/dashboard/myBookedDetails/${session._id}`}>
                      <button className="btn btn-sm bg-primary1 hover:bg-primary2 text-white px-5 py-5 rounded shadow transition text-sm">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookedSession;
