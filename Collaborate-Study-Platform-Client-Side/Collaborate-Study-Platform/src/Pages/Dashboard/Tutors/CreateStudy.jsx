import React from "react";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaEnvelope,
  FaChalkboardTeacher,
  FaClock,
  FaInfoCircle,
  FaBookOpen,
} from "react-icons/fa";

import { toast } from "react-toastify";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxios from "../../../Hooks/UseAxios";

const CreateStudy = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user } = UseAuth();
  const axiosInstance = UseAxios();

  const onSubmit = async (data) => {
    const sessionData = {
      ...data,
      tutorName: user?.displayName,
      tutorEmail: user?.email,
      registrationFee: 0,
      status: "pending",
    };
    try {
      const res = await axiosInstance.post("/sessions", sessionData);
      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("Session saved successfully!");
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save session");
    }
    console.log(sessionData);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#e2f0ec] to-[#ffffff] px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#1DA678]">
          Create Study Session
        </h2>

        <div>
          <label className="font-semibold">Session Title</label>
          <div className="relative">
            <input
              {...register("title", { required: true })}
              type="text"
              placeholder="Enter session title"
              className="input input-bordered w-full pl-10"
            />
            <FaChalkboardTeacher className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="font-semibold">Subject Name</label>
          <div className="relative">
            <input
              {...register("subject", { required: true })}
              type="text"
              placeholder="Enter subject name"
              className="input input-bordered w-full pl-10"
            />
            <FaBookOpen className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Tutor Name</label>
            <div className="relative">
              <input
                type="text"
                defaultValue={user?.displayName}
                readOnly
                className="input input-bordered w-full pl-10 bg-gray-100"
              />
              <FaUser className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="font-semibold">Tutor Email</label>
            <div className="relative">
              <input
                type="email"
                defaultValue={user?.email}
                readOnly
                className="input input-bordered w-full pl-10 bg-gray-100"
              />
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="font-semibold">Session Description</label>
          <textarea
            {...register("description", { required: true })}
            rows={3}
            placeholder="Write about this session"
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Registration Start Date</label>
            <input
              {...register("registrationStart")}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Registration End Date</label>
            <input
              {...register("registrationEnd")}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Class Start Date</label>
            <input
              {...register("classStart")}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Class End Date</label>
            <input
              {...register("classEnd")}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold">Session Duration</label>
          <div className="relative">
            <input
              {...register("duration", { required: true })}
              type="text"
              placeholder="e.g., 3 months, 12 weeks"
              className="input input-bordered w-full pl-10"
            />
            <FaClock className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Registration Fee</label>
            <input
              type="number"
              defaultValue={0}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Status</label>
            <input
              type="text"
              defaultValue="pending"
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold">Extra Info (optional)</label>
          <div className="relative">
            <input
              {...register("extraInfo")}
              type="text"
              placeholder="Any additional notes..."
              className="input input-bordered w-full pl-10"
            />
            <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full bg-primary1 text-white border-none"
        >
          Submit Session
        </button>
      </form>
    </div>
  );
};

export default CreateStudy;
