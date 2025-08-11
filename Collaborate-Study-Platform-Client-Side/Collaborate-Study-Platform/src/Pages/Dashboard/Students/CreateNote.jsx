import React from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import note from "../../../assets/note.jpg";

// Icons
import { FaEnvelope, FaStickyNote, FaPenFancy } from "react-icons/fa";

const CreateNote = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const noteData = {
      email: user.email,
      title: data.title,
      description: data.description,
      createdAt: new Date(),
    };

    try {
      await axiosSecure.post("/notes", noteData);
      Swal.fire("Success", "Note created successfully!", "success");
      reset();
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Failed to create note", "error");
    }
  };

  return (
    <div
      className="
    min-h-screen 
    bg-center 
    bg-no-repeat 
    bg-cover sm:bg-cover md:bg-
    flex items-center justify-center 
    px-4 lg:w-9/12 lg:mx-auto 
  "
      style={{
        backgroundImage: `url(${note})`,
      }}
    >
      <div className=" rounded-xl p-8 md:p-12 max-w-2xl w-full ">
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-8 flex items-center justify-center gap-2">
          <FaStickyNote /> Create a New Note
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              <FaEnvelope className="inline-block mr-1" /> Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full border-amber-500 border px-4 py-2 rounded-md bg-yellow-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              <FaPenFancy className="inline-block mr-1" /> Title
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="Enter note title"
              className="w-full  border-amber-500 border px-4 py-2 rounded-md bg-yellow-100 focus:outline-yellow-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              <FaStickyNote className="inline-block mr-1" /> Description
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Write your note here..."
              rows={5}
              className="w-full border-amber-500 border px-4 py-2 rounded-md bg-yellow-100 focus:outline-yellow-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-md hover:bg-yellow-600 transition cursor-pointer"
          >
            Save Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
