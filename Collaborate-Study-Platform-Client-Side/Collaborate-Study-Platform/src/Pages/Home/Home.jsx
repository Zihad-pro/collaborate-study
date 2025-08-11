import React, { useRef } from "react";
import Banner from "./Banner/Banner";
import Success from "../Success/Success";
import ReviewStudents from "./ReviewStudents/ReviewStudents";
import FrequentlyAsk from "./FequantlyAsk/FrequentlyAsk";
import AvailableStudy from "./AvailbleStudySession/AvailableStudy";

const Home = () => {
  const availableStudyRef = useRef(null);

  return (
    <div className="mt-15 md:mt-10">
      <Banner scrollToRef={availableStudyRef} />
      <div ref={availableStudyRef}>
        <AvailableStudy />
      </div>
      <Success />
      <ReviewStudents />
      <FrequentlyAsk />
    </div>
  );
};

export default Home;
