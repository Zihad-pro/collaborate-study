import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdEmail, MdPhotoCamera } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link, useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

import registerAnimation from "../../../assets/register.json";
import backgroundImage from "../../../assets/138629855_4fa0df8e-8469-438b-b7ea-3c35d0ab5084.jpg";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxios from "../../../Hooks/UseAxios";
import SocialLogin from "../SocalLogin/SocialLogin";

const Register = () => {
  const axiosInstance = UseAxios();
  const { registerUser, UpdateUserProfile } = UseAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMAGEBB
    }`;
    console.log(imageUploadUrl);

    try {
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);

    registerUser(data.email, data.password)
      .then(async (res) => {
        // ✅  Update Firebase profile
        await UpdateUserProfile({
          displayName: data.displayName,
          photoURL: profilePic,
        });
        console.log(res);
        // ✅  Prepare user info
        const userInfo = {
          displayName: data.displayName,
          email: data.email,
          photoURL: profilePic,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        // ✅ Save to database
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log("Saved to DB:", userRes.data);

        // ✅  Request JWT token
        const jwtRes = await axiosInstance.post("/jwt", { email: data.email });
        const token = jwtRes.data.token;

        // ✅ Store token in localStorage
        localStorage.setItem("accessToken", token);
        // console.log("JWT token saved:", token);

        Swal.fire({
          icon: "success",
          title: "Registered successfully!",
          timer: 1500,
          showConfirmButton: false,
        });

        reset();
        navigate(from);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        Swal.fire("Error", error.message, "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <section className="w-full max-w-xl bg-white/90 dark:bg-gray-900/90 p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center">
            <div className="w-48 h-48 md:w-72 md:h-72 mx-auto">
              <Player
                autoplay
                loop
                src={registerAnimation}
                className="w-full h-full"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              Create Your Account
            </h2>
          </div>

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              {...register("displayName", { required: "Name is required" })}
              className="w-full px-11 py-3 bg-white border rounded-lg text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full Name"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.displayName.message}
              </p>
            )}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaUser className="text-xl" />
            </span>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-11 py-3 bg-white border rounded-lg text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <MdEmail className="text-xl" />
            </span>
          </div>

          {/* Photo Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              {...register("photo", { required: "photo is required" })}
              onChange={handleImageUpload}
              className="w-full px-11 py-3 bg-white file:bg-primary1 file:text-white file:px-4 file:py-2 file:rounded-md border rounded-lg text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.photo && (
              <p className="mt-1 text-sm text-red-500">
                {errors.photo.message}
              </p>
            )}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <MdPhotoCamera className="text-xl" />
            </span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).+$/,
                  message: "Must include 1 uppercase letter and 1 number",
                },
              })}
              className="w-full px-11 py-3 bg-white border rounded-lg text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <RiLockPasswordLine className="text-xl" />
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary1 hover:bg-primary2 text-white font-medium py-3 rounded-lg transition-colors duration-300 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <SocialLogin />
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary1 hover:underline">
            Log In
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
