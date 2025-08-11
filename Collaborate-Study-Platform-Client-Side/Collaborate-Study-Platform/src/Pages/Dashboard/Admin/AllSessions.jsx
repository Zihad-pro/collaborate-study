import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineSubject } from "react-icons/md";
import { BiCalendarAlt } from "react-icons/bi";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const AllSessions = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);

  // New state for reject modal and inputs
  const [rejectModalIsOpen, setRejectModalIsOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  // Fetch sessions
  const fetchSessions = async () => {
    const res = await axiosSecure.get("/sessions");
    return res.data;
  };

  const {
    data: sessions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  // Mutation for updating session (approve, update, reject)
  const updateSessionMutation = useMutation({
    mutationFn: ({
      id,
      status,
      registrationFee,
      rejectionReason,
      rejectionFeedback,
    }) =>
      axiosSecure.patch(`/sessions/${id}`, {
        status,
        registrationFee,
        rejectionReason,
        rejectionFeedback,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["sessions"]);
      closeModal();
      closeRejectModal();
      toast.success(`Session ${variables.status} successfully!`);
    },
    onError: () => {
      toast.error("Failed to update session");
    },
  });

  // Mutation for deleting session
  const deleteSessionMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);
      toast.success("Session deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete session");
    },
  });

  // Open approve/update modal
  const openModal = (session) => {
    setSelectedSession(session);
    setIsPaid(session.registrationFee > 0);
    setFeeAmount(session.registrationFee || 0);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSession(null);
    setIsPaid(false);
    setFeeAmount(0);
  };

  // Open reject modal
  const openRejectModal = (session) => {
    setSelectedSession(session);
    setRejectionReason("");
    setRejectionFeedback("");
    setRejectModalIsOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalIsOpen(false);
    setSelectedSession(null);
    setRejectionReason("");
    setRejectionFeedback("");
  };

  // Handle approve (for pending session)
  const handleApprove = () => {
    if (!selectedSession) return;
    updateSessionMutation.mutate({
      id: selectedSession._id,
      status: "approved",
      registrationFee: isPaid ? Number(feeAmount) : 0,
      rejectionReason: "",
      rejectionFeedback: "",
    });
  };

  // Handle update (for approved session)
  const handleUpdate = () => {
    if (!selectedSession) return;
    updateSessionMutation.mutate({
      id: selectedSession._id,
      status: selectedSession.status, // keep current status (approved)
      registrationFee: isPaid ? Number(feeAmount) : 0,
      rejectionReason: "",
      rejectionFeedback: "",
    });
  };

  // Handle reject: open reject modal instead of immediate action
  const handleReject = (session) => {
    openRejectModal(session);
  };

  // Submit rejection with reason and feedback
  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      Swal.fire("Error", "Please enter a rejection reason.", "error");
      return;
    }

    updateSessionMutation.mutate({
      id: selectedSession._id,
      status: "rejected",
      registrationFee: 0,
      rejectionReason,
      rejectionFeedback,
    });

    // The onSuccess of mutation closes modal and clears states
  };

  // Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSessionMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to load sessions.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        <FaChalkboardTeacher className="inline-block mr-2 text-primary1" />
        All Sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500">No sessions found.</p>
      ) : (
        <ul className="space-y-6">
          {sessions.map((session) => (
            <li
              key={session._id}
              className=" bg-white rounded-lg p-5 shadow-md hover:shadow-2xl hover:scale-101 transition"
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

              {/* Buttons */}
              {session.status === "pending" && (
                <div className="mt-5 flex gap-4">
                  <button
                    onClick={() => openModal(session)}
                    className="flex items-center gap-2 bg-primary1 hover:bg-primary2 text-white px-4 py-2 rounded-md shadow cursor-pointer"
                  >
                    <BsCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(session)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow cursor-pointer"
                  >
                    <BsXCircle /> Reject
                  </button>
                </div>
              )}

              {session.status === "approved" && (
                <div className="mt-5 flex gap-4">
                  <button
                    onClick={() => openModal(session)}
                    className="bg-primary1 hover:bg-primary2 text-white px-4 py-2 rounded-md shadow flex items-center gap-2 cursor-pointer"
                  >
                    <AiOutlineEdit /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(session._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow flex items-center gap-2 cursor-pointer"
                  >
                    <AiOutlineDelete /> Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Approve/Update Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={
          selectedSession?.status === "pending"
            ? "Approve Session"
            : "Update Session"
        }
        className="max-w-md mx-auto mt-20 bg-white p-6 md:p-15 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-primary1">
          {selectedSession?.status === "pending"
            ? "Approve Session"
            : "Update Session"}
        </h2>

        <p className="mb-2 text-center">Is this session free or paid?</p>

        <div className="flex justify-center gap-8 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={!isPaid}
              onChange={() => setIsPaid(false)}
              className="form-radio"
            />
            <span className="text-gray-800 font-medium">Free</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={isPaid}
              onChange={() => setIsPaid(true)}
              className="form-radio"
            />
            <span className="text-gray-800 font-medium">Paid</span>
          </label>
        </div>

        {isPaid && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Fee Amount:
            </label>
            <input
              type="number"
              min="0"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              className="w-full border px-4 py-2 rounded focus:ring focus:ring-primary1"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={
              selectedSession?.status === "pending"
                ? handleApprove
                : handleUpdate
            }
            className={`px-4 py-2 rounded cursor-pointer text-white ${
              updateSessionMutation.isLoading
                ? "bg-primary2 cursor-not-allowed"
                : "bg-primary1 hover:bg-primary2"
            }`}
            disabled={updateSessionMutation.isLoading}
          >
            {updateSessionMutation.isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalIsOpen}
        onRequestClose={closeRejectModal}
        contentLabel="Reject Session"
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4 text-primary1 text-center">
          Reject Session
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-primary1"
            placeholder="Enter reason for rejection"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Feedback (optional)
          </label>
          <textarea
            value={rejectionFeedback}
            onChange={(e) => setRejectionFeedback(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-primary1"
            rows={4}
            placeholder="Additional feedback"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={closeRejectModal}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={submitRejection}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit Rejection
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllSessions;
