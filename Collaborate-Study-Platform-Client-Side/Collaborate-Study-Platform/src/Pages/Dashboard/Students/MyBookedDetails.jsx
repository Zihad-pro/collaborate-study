import React, { useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import {
  FaChalkboardTeacher,
  FaStar,
  FaRegClock,
  FaCalendarAlt,
  FaBookOpen,
} from "react-icons/fa";

const MyBookedDetails = () => {
  const { id } = useParams(); // Booking _id
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  // Get booking info by booking _id
  const { data: booking, isLoading } = useQuery({
    queryKey: ["bookingDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/${id}`);
      return res.data;
    },
  });

  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await axiosSecure.post("/reviews", reviewData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Review submitted!", "success");
      reset();
      setRating(0);
      queryClient.invalidateQueries(["sessionReviews", booking?.sessionId]);
    },
  });

  const onSubmit = (data) => {
    if (!rating) {
      Swal.fire("Error", "Please select a star rating", "error");
      return;
    }

    const reviewData = {
      sessionId: booking.sessionId,
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      comment: data.comment,
      rating,
      createdAt: new Date(),
    };

    reviewMutation.mutate(reviewData);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Session Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h2 className="text-2xl font-bold text-primary1 mb-4">
          {booking.sessionTitle}
        </h2>
        <div className="grid md:grid-cols-2  gap-6">
          <img
            src={booking.image}
            alt={booking.sessionTitle}
            className="w-full h-full object-cover rounded-lg shadow"
          />
          <div className="text-gray-800 space-y-3">
            <p className="flex items-center gap-2">
              <FaChalkboardTeacher className="text-primary1" />
              <strong className="w-28">Tutor:</strong> {booking.tutorName}
            </p>
            <p className="flex items-center gap-2">
              <FaBookOpen className="text-primary1" />
              <strong className="w-28">Subject:</strong> {booking.subject}
            </p>
            <p className="flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              <strong className="w-28">Fee:</strong>{" "}
              {booking.fee === "free" ? "Free" : `৳${booking.fee}`}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary1" />
              <strong className="w-28">Schedule:</strong> {booking.classStart} →{" "}
              {booking.classEnd}
            </p>
            <p className="flex items-center gap-2">
              <FaRegClock className="text-primary1" />
              <strong className="w-28">Status:</strong> {booking.status}
            </p>

            {/* New fields */}
            <p className="mt-4">
              <strong className="block text-primary1 text-lg mb-1">
                Description:
              </strong>
              <span className="text-gray-700">{booking.description}</span>
            </p>
            {booking.extraInfo && (
              <p className="mt-3">
                <strong className="block text-primary1 text-lg mb-1">
                  Extra Info:
                </strong>
                <span className="text-gray-700">{booking.extraInfo}</span>
              </p>
            )}
            <p className="mt-3 text-sm text-gray-500">
              <strong>Session ID:</strong> {booking.sessionId}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              <strong>Booked At:</strong>{" "}
              {new Date(booking.bookedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Review Submission Section Only */}
      <div className="bg-white rounded-lg shadow p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-primary1 mb-4">
          Leave a Review
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <label key={starValue}>
                  <input
                    type="radio"
                    value={starValue}
                    className="hidden"
                    onClick={() => setRating(starValue)}
                  />
                  <FaStar
                    size={30}
                    className={`cursor-pointer transition-colors ${
                      starValue <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>

          {/* Comment Field */}
          <textarea
            {...register("comment", { required: true })}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-primary1"
            placeholder="Write your review here..."
            rows={4}
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-primary1 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-primary2 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyBookedDetails;
