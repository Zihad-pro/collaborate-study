import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import { FaUserGraduate } from "react-icons/fa";
import UseAxios from "../../../Hooks/UseAxios";

const Tutor = () => {
  const axiosInstance=UseAxios();

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/tutors"); // Backend filters by role=tutor
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-190  mt-20">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary1">
        All Tutors
      </h2>

      {tutors.length === 0 ? (
        <p className="text-center text-gray-500">No tutors found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary1 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tutors.map((tutor, index) => (
                <tr key={tutor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tutor.photoURL ? (
                      <img
                        src={tutor.photoURL}
                        alt={tutor.displayName}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary1 text-white flex items-center justify-center text-xl">
                        <FaUserGraduate />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {tutor.displayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {tutor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {new Date(tutor.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tutor;
