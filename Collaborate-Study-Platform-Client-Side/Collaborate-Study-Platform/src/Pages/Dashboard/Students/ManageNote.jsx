import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaStickyNote } from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ManageNote = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedNote, setSelectedNote] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
  });

  // Fetch user notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["userNotes", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/notes?email=${user.email}`);
      return res.data;
    },
  });

  // Delete note
  const deleteNote = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this note!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/notes/${id}`);
      Swal.fire("Deleted!", "Your note has been deleted.", "success");
      queryClient.invalidateQueries(["userNotes", user.email]);
    }
  };

  // Update note
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/notes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Note updated!", "success");
      queryClient.invalidateQueries(["userNotes", user.email]);
      setSelectedNote(null);
    },
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: selectedNote._id, data: updatedData });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-primary1 mb-8">
        <FaStickyNote className="inline-block mr-2 text-primary1" />
        Manage Your Notes
      </h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-gray-500 italic">No notes found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-[#b6d6bb] rounded-lg shadow-xl p-5 relative"
            >
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-700 mb-4">{note.description}</p>
              <p className="text-sm text-gray-400 italic mb-2">
                Created: {new Date(note.createdAt).toLocaleString()}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    setSelectedNote(note);
                    setUpdatedData({
                      title: note.title,
                      description: note.description,
                    });
                  }}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <FaEdit /> Update
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Update */}
      <Modal
        isOpen={!!selectedNote}
        onRequestClose={() => setSelectedNote(null)}
        className="max-w-3xl mx-auto mt-32 bg-white p-15 rounded shadow-md"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50"
      >
        <h2 className="text-2xl font-bold text-center text-primary1 mb-6">
          Update Note
        </h2>
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Title</label>
            <input
              type="text"
              value={updatedData.title}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, title: e.target.value })
              }
              className="w-100 border px-10 py-2 rounded-md focus:outline-yellow-500 bg-yellow-50"
              required
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Description</label>
            <textarea
              value={updatedData.description}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, description: e.target.value })
              }
              rows={5}
              className="w-100 border px-4 py-2 rounded-md focus:outline-yellow-500 bg-yellow-50"
              required
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => setSelectedNote(null)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageNote;
