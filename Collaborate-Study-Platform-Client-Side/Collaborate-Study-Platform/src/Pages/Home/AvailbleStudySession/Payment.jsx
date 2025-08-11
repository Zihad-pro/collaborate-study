import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PaymentForm from "./PaymentForm";
import Loading from "../../../Components/Loading/Loading";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

const Payment = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm session={session} />
    </Elements>
  );
};

export default Payment;
