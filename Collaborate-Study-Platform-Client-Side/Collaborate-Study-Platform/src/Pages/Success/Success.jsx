import React from "react";
import CountUp from "react-countup";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaGlobeAsia,
} from "react-icons/fa";

const Success = () => {
  const stats = [
    {
      icon: <FaUsers />,
      label: "Students Enrolled",
      value: 15000,
      suffix: "+",
    },
    {
      icon: <FaChalkboardTeacher />,
      label: "Expert Tutors",
      value: 500,
      suffix: "+",
    },
    {
      icon: <FaGraduationCap />,
      label: "Courses Completed",
      value: 35000,
      suffix: "+",
    },
    {
      icon: <FaGlobeAsia />,
      label: "Countries Reached",
      value: 42,
      suffix: "+",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-[#f3fdfb] to-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Platform Impact
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12">
          Real success shown through numbers — one learner, tutor, and course at
          a time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#1DA678]/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="text-[#1DA678] text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={50} // slow motion
                  separator=","
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Success;
