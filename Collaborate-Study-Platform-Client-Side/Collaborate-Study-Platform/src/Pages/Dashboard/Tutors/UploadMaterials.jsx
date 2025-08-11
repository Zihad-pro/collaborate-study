import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import { BiCalendar } from "react-icons/bi";
import { BsClock } from "react-icons/bs";

Modal.setAppElement("#root");

const UploadMaterials = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedSession, setSelectedSession] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  // Fetch approved sessions without materials
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["uploadableSessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/sessions?tutorEmail=${user.email}&status=approved&hasMaterials=false`
      );
      return res.data;
    },
  });

  const handleOpenModal = (session) => {
    setSelectedSession(session);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
    setModalIsOpen(false);
    setImageFile(null);
    setLink("");
    setTitle("");
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data?.data?.url;
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const imageUrl = await uploadImageToImgBB(imageFile);
      const material = {
        title,
        sessionId: selectedSession._id,
        tutorEmail: user.email,
        imageUrl,
        driveLink: link,
        createdAt: new Date().toISOString(),
      };
      const res = await axiosSecure.post("/materials", material);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Material uploaded successfully!", "success");

      // Invalidate and refetch 'uploadableSessions' to remove the uploaded session
      queryClient.invalidateQueries(["uploadableSessions", user?.email]);
      queryClient.invalidateQueries(["materials"]); // If you have a separate query for all materials

      handleCloseModal();
    },
    onError: (err) => {
      Swal.fire("Error", err.message, "error");
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 max-w-4xl mx-auto  min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Upload Materials for Approved Sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500">
          {user
            ? "No sessions available for material upload, or all sessions already have materials."
            : "Please login to view sessions."}
        </p>
      ) : (
        <ul className="space-y-8">
          {sessions.map((session) => (
            <li
              key={session._id}
              className="p-5 rounded-lg bg-white shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-primary1 mb-1">
                    {session.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Subject: {session.subject}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <BiCalendar />
                      Class Start:{" "}
                      {new Date(session.classStart).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <BiCalendar />
                      Class End:{" "}
                      {new Date(session.classEnd).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <BsClock />
                      Duration: {session.duration} hours
                    </div>
                  </div>
                </div>

                {session.hasMaterials ? (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full mt-4">
                    Already Uploaded
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenModal(session)}
                    className="bg-primary1 hover:bg-primary2 text-white px-4 py-2 rounded shadow mt-4 cursor-pointer transition-colors"
                    disabled={uploadMutation.isLoading}
                  >
                    Upload Material
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Upload Material Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        shouldCloseOnOverlayClick={!uploadMutation.isLoading}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-primary1">
          Upload Material for {selectedSession?.title}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadMutation.mutate();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Title*</label>
              <input
                type="text"
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Material title"
                disabled={uploadMutation.isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Session ID</label>
                <input
                  type="text"
                  readOnly
                  className="w-full bg-gray-100 border px-3 py-2 rounded"
                  value={selectedSession?._id || ""}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tutor Email</label>
                <input
                  type="email"
                  readOnly
                  className="w-full bg-gray-100 border px-3 py-2 rounded"
                  value={user?.email || ""}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Thumbnail Image*</label>
              <input
                type="file"
                accept="image/*"
                required
                className="w-full border px-3 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary1 file:text-white hover:file:bg-primary2"
                onChange={(e) => setImageFile(e.target.files[0])}
                disabled={uploadMutation.isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 5MB. Recommended: 800x450px
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Google Drive Link*
              </label>
              <input
                type="url"
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary1"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                disabled={uploadMutation.isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded border hover:bg-gray-100 transition-colors"
              disabled={uploadMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadMutation.isLoading}
              className={`px-4 py-2 rounded text-white transition-colors ${
                uploadMutation.isLoading
                  ? "bg-primary2 cursor-not-allowed"
                  : "bg-primary1 hover:bg-primary2 cursor-pointer"
              }`}
            >
              {uploadMutation.isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UploadMaterials;
