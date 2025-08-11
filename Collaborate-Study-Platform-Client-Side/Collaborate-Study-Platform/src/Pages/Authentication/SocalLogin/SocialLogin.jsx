import React from "react";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import UseAxios from "../../../Hooks/UseAxios";
import { useLocation, useNavigate } from "react-router";

const SocialLogin = () => {
  const axiosInstance = UseAxios();
  const { SignInGoogle } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/";
 const handleGoogle = () => {
   SignInGoogle()
     .then(async (res) => {
       const user = res.user;
       const userInfo = {

         displayName: user.displayName || "No Name",
         photoURL:user.photoURL || "No Photo",
         email: user.email,
         role: "user",
         created_at: new Date().toISOString(),
         last_log_in: new Date().toISOString(),
       };

       // ✅ Send to server
       const userRes = await axiosInstance.post("/users", userInfo);

       // ✅ If already exists, update last_log_in
       if (userRes?.data?.inserted === false) {
         await axiosInstance.patch(`/users/${user.email}`, {
           last_log_in: new Date().toISOString(),
         });
       }

       // ✅ Get JWT token from backend
       const jwtRes = await axiosInstance.post("/jwt", { email: user.email });
       const token = jwtRes.data.token;

       // ✅ Save token to localStorage
       localStorage.setItem("accessToken", token);

       Swal.fire({
         icon: "success",
         title: "Login Successful",
         text: "You are logged in successfully!",
         timer: 1500,
         showConfirmButton: false,
       });

       navigate(redirectTo);
     })
     .catch((error) => {
       console.log(error);
       Swal.fire({
         icon: "error",
         title: "Oops...",
         text: "Login failed. Please try again!",
       });
     });
 };

  return (
    <div>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-5">or</p>
      <button
        onClick={handleGoogle}
        className="btn bg-white text-black border-[#e5e5e5] w-full"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
