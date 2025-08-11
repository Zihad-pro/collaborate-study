import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineSubject } from "react-icons/md";
import { BiCalendarAlt } from "react-icons/bi";
import { AiOutlineReload } from "react-icons/ai";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";

const MySession = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all sessions created by the tutor
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["mySessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
      return res.data;
    },
  });

  // Mutation for requesting again (changing rejected to pending)
  const requestAgainMutation = useMutation({
    mutationFn: async (sessionId) => {
      const res = await axiosSecure.patch(
        `/sessions/request-again/${sessionId}`,
        {
          status: "pending",
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mySessions", user?.email]);
      Swal.fire("Requested!", "Your session has been sent again.", "success");
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    },
  });

  const handleRequestAgain = (id) => {
    Swal.fire({
      title: "Send Request Again?",
      text: "This will change status to pending.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send",
    }).then((result) => {
      if (result.isConfirmed) {
        requestAgainMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        <FaChalkboardTeacher className="inline-block mr-2 text-primary1" />
        My Study Sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500">No sessions created yet.</p>
      ) : (
        <ul className="space-y-6">
          {sessions.map((session) => (
            <li
              key={session._id}
              className="bg-white rounded-lg p-5 shadow-md transform hover:scale-102 transition duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-primary1 mb-1">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MdOutlineSubject />
                    Subject: {session.subject}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    session.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : session.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {session.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <BiCalendarAlt className="text-lg" />
                  <span>
                    <strong>Registration Start:</strong>{" "}
                    {new Date(session.registrationStart).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BiCalendarAlt className="text-lg" />
                  <span>
                    <strong>Registration End:</strong>{" "}
                    {new Date(session.registrationEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {session.status === "rejected" && (
                <div className="mt-5">
                  <button
                    onClick={() => handleRequestAgain(session._id)}
                    className="flex items-center gap-2 bg-primary1 hover:bg-primary2 text-white px-4 py-2 rounded-md shadow cursor-pointer"
                  >
                    <AiOutlineReload className="text-lg" />
                    Request Again
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySession;
