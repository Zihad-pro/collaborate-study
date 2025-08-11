import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { FaUserShield, FaUser } from "react-icons/fa";
import Loading from "../../../Components/Loading/Loading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

Modal.setAppElement("#root");

const ViewUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}`);
      return res.data;
    },
    enabled: true,
  });

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;

    if (selectedRole === selectedUser.role) {
      Swal.fire("Info", "Role is unchanged.", "info");
      closeModal();
      return;
    }

    try {
      const res = await axiosSecure.patch(`/users/role/${selectedUser.email}`, {
        role: selectedRole,
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Role updated!", "success");
        refetch();
      } else {
        Swal.fire("Error", "Role update failed.", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to update role.", "error");
    }
    closeModal();
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        Manage Users
      </h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to page 1 on new search
        }}
        className="input input-bordered w-full max-w-lg mb-6 text-gray-700 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary1 focus:border-primary1 transition"
      />

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-primary1 text-white sticky top-0">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, idx) => (
                <tr
                  key={user._id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-neutral-200 transition"
                >
                  <td className="py-3 px-4 align-middle">
                    {(currentPage - 1) * usersPerPage + idx + 1}
                  </td>
                  <td className="py-3 px-4 align-middle font-medium">
                    {user?.displayName || "N/A"}
                  </td>
                  <td className="py-3 px-4 align-middle break-all">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 align-middle capitalize">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <button
                      className="btn btn-sm bg-primary1 hover:bg-primary2 text-white px-4 py-1 rounded-md shadow-md transition"
                      onClick={() => openModal(user)}
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow-sm overflow-hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 text-sm border-t border-b border-gray-300 font-medium ${
                    currentPage === number
                      ? "bg-primary1 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {number}
                </button>
              )
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Change User Role"
        className="max-w-md mx-auto mt-24 p-8 bg-white rounded-xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-900">
          Change Role for{" "}
          <span className="font-bold">
            {selectedUser?.displayName || selectedUser?.email}
          </span>
        </h3>

        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="select select-bordered w-full mb-6 text-gray-700"
        >
          <option value="user">User</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button
            className="btn btn-outline px-6 py-2 rounded-md font-semibold"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="btn bg-primary1 hover:bg-primary2 text-white px-6 py-2 rounded-md font-semibold"
            onClick={handleUpdateRole}
          >
            Update Role
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ViewUsers;
