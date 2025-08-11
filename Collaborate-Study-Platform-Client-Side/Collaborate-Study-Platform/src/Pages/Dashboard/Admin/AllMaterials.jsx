import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import { FiTrash2, FiExternalLink } from "react-icons/fi";

const AllMaterials = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["allMaterials"],
    queryFn: async () => {
      const res = await axiosSecure.get("/materials");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/materials/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Material has been removed.", "success");
      queryClient.invalidateQueries(["allMaterials"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete material.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this material?",
      text: "This action cannot be undone!",
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
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        All Uploaded Materials (Admin View)
      </h2>

      {materials.length === 0 ? (
        <p className="text-center text-gray-500">No materials available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
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
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Uploaded by:</span>{" "}
                  {mat.tutorEmail}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Created Date :</span>{" "}
                  {mat.createdAt}
                </p>
                <a
                  href={mat.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  <FiExternalLink className="mr-1" />
                  View Google Drive
                </a>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleDelete(mat._id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <FiTrash2 />
                  Delete Material
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMaterials;
