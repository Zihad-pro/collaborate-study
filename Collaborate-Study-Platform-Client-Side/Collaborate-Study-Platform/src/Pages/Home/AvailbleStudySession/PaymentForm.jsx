import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import paymentImage from "../../../assets/payment.jpg";
import { useNavigate } from "react-router";
import UseAuth from "../../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Components/Loading/Loading";

const PaymentForm = ({ session }) => {
  const navigate = useNavigate();
  const { user } = UseAuth();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Get booking status
  const { data: existingBooking, isLoading: bookingLoading } = useQuery({
    queryKey: ["userBooking", user?.email, session?._id],
    enabled: !!user?.email && !!session?._id,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/check?email=${user.email}&sessionId=${session._id}`
      );
      return res.data; // null or booking
    },
  });

  // ✅ Get payment client secret
  useEffect(() => {
    if (session?.registrationFee > 0) {
      axiosSecure
        .post("/create-payment-intent", { fee: session.registrationFee })
        .then((res) => setClientSecret(res.data.clientSecret));
    }
  }, [axiosSecure, session]);

  // ✅ Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // ✅ Prevent duplicate booking
    if (existingBooking) {
      Swal.fire(
        "Already Booked",
        "You have already booked this session.",
        "info"
      );
      return;
    }

    setProcessing(true);
    const card = elements.getElement(CardElement);

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: session?.userEmail || user.email,
          },
        },
      });

    if (confirmError) {
      setError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      setSuccess("Payment successful!");

      // ✅ Save booking to DB
      await axiosSecure.post("/bookings", {
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
        fee: "paid",
        status: "booked",
        transactionId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        bookedAt: new Date(),
      });

      Swal.fire("Success", "Payment completed & session booked!", "success");
      navigate("/dashboard/myBooked");
    }

    setProcessing(false);
  };

  // ✅ Loading state
  if (bookingLoading) return <Loading />;

  // ✅ Already booked
  if (existingBooking) {
    return (
      <div className="text-center my-20 text-red-600 text-xl font-semibold">
        You have already booked this session.
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="max-w-xl mx-auto my-40 px-6 py-10 bg-white rounded-2xl shadow-2xl">
        <h1 className="flex justify-center mb-4">
          <img src={paymentImage} alt="Secure Payment" className="h-32" />
        </h1>

        <h2 className="text-3xl font-extrabold text-center text-primary1 mb-6">
          Secure Payment
        </h2>

        <div className="text-center text-gray-700 mb-8">
          <p className="text-sm text-gray-500 mt-1">
            Payment for: <span className="font-medium">{session.title}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-gray-300 rounded-md p-4 shadow-sm bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#333",
                    "::placeholder": { color: "#888" },
                  },
                  invalid: { color: "#e53e3e" },
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-primary1 to-primary2 hover:brightness-110 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : `Pay ৳${session.registrationFee}`}
          </button>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {success && (
            <p className="text-sm text-green-600 text-center">{success}</p>
          )}
        </form>

        <div className="mt-6 text-xs text-gray-400 text-center">
          Your payment is secure and encrypted with Stripe.
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
