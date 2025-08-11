import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import {
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MyMaterials = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [materialsPerPage] = useState(6); // Number of materials per page

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["materials", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?tutorEmail=${user.email}`);
      return res.data;
    },
  });

  // Pagination logic
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterials = materials.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );
  const totalPages = Math.ceil(materials.length / materialsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/materials/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Material deleted.", "success");
      queryClient.invalidateQueries(["materials", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete material.", "error");
    },
  });

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

  const updateMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = editingMaterial.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const updated = {
        title,
        driveLink: link,
        imageUrl,
      };

      const res = await axiosSecure.patch(
        `/materials/${editingMaterial._id}`,
        updated
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Updated!", "Material updated successfully.", "success");
      queryClient.invalidateQueries(["materials", user?.email]);
      handleCloseModal();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update material.", "error");
    },
  });

  const handleOpenModal = (material) => {
    setEditingMaterial(material);
    setTitle(material.title);
    setLink(material.driveLink);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setEditingMaterial(null);
    setTitle("");
    setLink("");
    setImageFile(null);
    setModalIsOpen(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this material?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Uploaded Materials
      </h2>

      {materials.length === 0 ? (
        <p className="text-center text-gray-500">No materials uploaded yet.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMaterials.map((mat) => (
              <div
                key={mat._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={mat.imageUrl}
                    alt="Material"
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <h3 className="text-lg font-semibold text-primary1 mb-1 truncate">
                    {mat.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Session ID:</span>{" "}
                    {mat.sessionId}
                  </p>
                  <a
                    href={mat.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <FiExternalLink className="mr-1" />
                    View Google Drive Link
                  </a>
                </div>

                <div className="flex justify-between items-center mt-4 space-x-2">
                  <button
                    onClick={() => handleOpenModal(mat)}
                    className="flex-1 bg-primary1 hover:bg-primary2 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <FiEdit /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(mat._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {materials.length > materialsPerPage && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === number
                          ? "bg-primary1 text-white"
                          : "border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-primary1">
          Update Material
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
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
              />
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
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Update Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full border px-3 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary1 file:text-white hover:file:bg-primary2"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if you don't want to change the image.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded border hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className={`px-4 py-2 rounded text-white ${
                updateMutation.isLoading
                  ? "bg-primary2 cursor-not-allowed"
                  : "bg-primary1 hover:bg-primary2 cursor-pointer"
              }`}
            >
              {updateMutation.isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyMaterials;
