import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Loading from "../../../Components/Loading/Loading";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";

const StudyMaterials = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  // Fetch bookings for logged-in user
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myBookedSessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
      return res.data;
    },
  });

  // Function to download image directly
  const handleDownload = async (url, filename = "material.jpg") => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">
        Failed to load your study materials.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary1 mb-8 text-center">
        My Study Materials
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600 text-center">No study materials found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden mt-5"
            >
              <img
                src={booking.image}
                alt={booking.sessionTitle}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 space-y-2 flex justify-between items-center">
                <button
                  onClick={() =>
                    handleDownload(booking.image, `${booking.sessionTitle}.jpg`)
                  }
                  className="text-sm text-white bg-primary1 px-3 py-1 rounded hover:bg-primary2 flex items-center gap-1 cursor-pointer"
                >
                  <FaDownload /> Download
                </button>

                <a
                  href={booking.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary1 underline flex items-center gap-1"
                >
                  <FaExternalLinkAlt /> View Drive Link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
