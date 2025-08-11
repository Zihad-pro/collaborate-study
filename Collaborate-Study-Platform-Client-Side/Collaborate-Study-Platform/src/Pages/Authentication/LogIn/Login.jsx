import React from "react";
import backgroundImage from "../../../assets/138629855_4fa0df8e-8469-438b-b7ea-3c35d0ab5084.jpg";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import loginAnimation from "../../../assets/login.json";
import { Player } from "@lottiefiles/react-lottie-player";
import SocialLogin from "../SocalLogin/SocialLogin";
import { Link, useLocation, useNavigate } from "react-router";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxios from "../../../Hooks/UseAxios";
import Swal from "sweetalert2";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/";
  const { logInUser } = UseAuth();
  const axiosInstance = UseAxios();

 const handleLogin = async (e) => {
   e.preventDefault();
   const form = e.target;
   const email = form.email.value;
   const password = form.password.value;

   try {
     // Firebase login
     const res = await logInUser(email, password);
     console.log("User logged in:", res.user);

     // ✅  Get JWT token from your backend
     const jwtRes = await axiosInstance.post("/jwt", { email });
     const token = jwtRes.data.token;

     // ✅ Save token to localStorage
     localStorage.setItem("accessToken", token);
    //  console.log("JWT Token saved:", token);

     // ✅  Update last login time
     await axiosInstance.patch(`/users/${email}`, {
       last_log_in: new Date().toISOString(),
     });

     Swal.fire({
       icon: "success",
       title: "Login Successful!",
       timer: 1500,
       showConfirmButton: false,
     });
     navigate(redirectTo, { replace: true });
   } catch (error) {
     console.error("Login error:", error);
     Swal.fire("Login Failed", error.message, "error");
   }
 };
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <section className="w-full max-w-xl bg-white/90 dark:bg-gray-900/90 p-8 rounded-xl shadow-lg">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="text-center">
            <div className="w-48 h-48 md:w-72 md:h-72 mx-auto">
              <Player
                autoplay
                loop
                src={loginAnimation}
                className="w-full h-full"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              Sign In to Your Account
            </h2>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="w-full px-11 py-3 bg-white border rounded-lg text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email address"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <MdEmail className="text-xl" />
            </span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full px-11 py-3 bg-white border rounded-lg text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <RiLockPasswordLine className="text-xl" />
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-primary1 hover:bg-primary2 cursor-pointer text-white font-medium py-3 rounded-lg transition-colors duration-300"
          >
            Log In
          </button>

          <SocialLogin />

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary1 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
