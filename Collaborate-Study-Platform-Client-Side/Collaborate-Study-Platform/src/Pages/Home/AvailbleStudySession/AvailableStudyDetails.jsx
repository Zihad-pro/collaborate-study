import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import { FaUserGraduate, FaRegCalendarAlt } from "react-icons/fa";
import { BiTimeFive, BiMoney, BiSolidStar } from "react-icons/bi";
import UseAuth from "../../../Hooks/UseAuth";
import { motion } from "framer-motion";
import useUserRole from "../../../Hooks/useUserRole";
import Swal from "sweetalert2";
import { useState } from "react";

const AvailableStudyDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [isJustBooked, setIsJustBooked] = useState(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ["sessionDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["sessionReviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    data: existingBooking,
    isLoading: bookingLoading,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["userBooking", user?.email, id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/check?email=${user.email}&sessionId=${id}`
      );
      return res.data;
    },
    enabled: !!user?.email && !!id,
  });

  const isRegistrationClosed = new Date(session?.registrationEnd) < new Date();
  const isBooked = !!existingBooking || isJustBooked;

  const isBookDisabled =
    !user ||
    role === "admin" ||
    role === "tutor" ||
    isRegistrationClosed ||
    isBooked;

  const getBookButtonText = () => {
    if (isBooking) return "Processing...";
    if (!user) return "Login to Book";
    if (isBooked)
      return session.registrationFee > 0 ? "Already Paid" : "Already Booked";
    if (isRegistrationClosed) return "Registration Closed";
    if (role === "admin" || role === "tutor") return "Not Available";
    return "Book Now";
  };

  const onBookNow = async () => {
    if (isBookDisabled) return;

    setIsBooking(true);
    try {
      const bookingData = {
        sessionId: session._id,
        sessionTitle: session.title,
        subject: session.subject,
        description: session.description,
        image: session.imageUrl,
        driveLink: session.driveLink,
        tutorName: session.tutorName,
        tutorEmail: session.tutorEmail,
        userEmail: user.email,
        classStart: session.classStart,
        classEnd: session.classEnd,
        extraInfo: session.extraInfo,
        status: "booked",
        fee: session.registrationFee > 0 ? "pending" : "paid",
        bookedAt: new Date(),
      };
     

      if (session.registrationFee > 0) {
        navigate(`/payment/${session._id}`);
      } else {
        await axiosSecure.post("/bookings", bookingData);
        setIsJustBooked(true);
        refetchBooking();
        Swal.fire("Success!", "Session booked successfully!", "success");
        navigate("/dashboard/myBooked");
      }
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Booking failed",
        "error"
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading || roleLoading || bookingLoading) return <Loading />;
  if (!session)
    return <p className="text-center text-red-500">Session not found</p>;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="bg-gradient-to-b from-white via-[#f3fdfb] to-white">
      <div className="max-w-6xl text-gray-800 mx-auto px-4 shadow-md py-12 mt-23 rounded-xl my-20 md:px-10">
        {/* Image */}
        <div className="overflow-hidden rounded-lg shadow mb-10">
          <img
            src={session.imageUrl}
            alt={session.title}
            className="w-full max-h-150 object-cover"
          />
        </div>

        {/* Title & Meta */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary1">
            {session.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-2">
              <FaUserGraduate className="text-primary1" />
              <span className="font-medium">Tutor:</span> {session.tutorName}
            </div>
            <div className="flex items-center gap-2">
              <BiSolidStar className="text-yellow-500" />
              <span className="font-medium">Rating:</span> {avgRating}
            </div>
            <div className="flex items-center gap-2">
              <BiMoney className="text-green-600" />
              <span className="font-medium">Fee:</span>{" "}
              {session.registrationFee === 0
                ? "Free"
                : `৳${session.registrationFee}`}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            About This Session
          </h3>
          <p className="text-gray-700 leading-relaxed">{session.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="flex items-start gap-3">
            <FaRegCalendarAlt className="text-primary1 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Registration</p>
              <p className="text-sm text-gray-600">
                {session.registrationStart} → {session.registrationEnd}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BiTimeFive className="text-primary1 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Duration</p>
              <p className="text-sm text-gray-600">{session.duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaRegCalendarAlt className="text-primary1 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Class Schedule</p>
              <p className="text-sm text-gray-600">
                {session.classStart} → {session.classEnd}
              </p>
            </div>
          </div>
        </div>

        {/* Book Now Section */}
        <div className="mb-12">
          <motion.button
            onClick={onBookNow}
            disabled={isBookDisabled}
            whileTap={!isBookDisabled ? { scale: 0.95 } : {}}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors shadow-md ${
              isBookDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary1 hover:bg-primary2 cursor-pointer"
            }`}
          >
            {getBookButtonText()}
          </motion.button>

          {/* Status messages */}
          {!user && (
            <p className="text-sm text-red-500 mt-2">
              Please log in to register.
            </p>
          )}
          {(role === "admin" || role === "tutor") && user && (
            <p className="text-sm text-red-500 mt-2">
              {role.toUpperCase()} cannot book sessions.
            </p>
          )}
          {isRegistrationClosed && !isBooked && (
            <p className="text-sm text-red-500 mt-2">
              Registration period has ended.
            </p>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Student Reviews
          </h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">
              No reviews yet for this session.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      {review.reviewerImage ? (
                        <img
                          src={review.reviewerImage}
                          alt={review.reviewerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUserGraduate className="text-gray-500" />
                        </div>
                      )}
                      <h4 className="font-semibold text-gray-800">
                        {review.reviewerName}
                      </h4>
                    </div>
                    <span className="text-yellow-500 font-medium text-sm">
                      ⭐ {review.rating}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableStudyDetails;
