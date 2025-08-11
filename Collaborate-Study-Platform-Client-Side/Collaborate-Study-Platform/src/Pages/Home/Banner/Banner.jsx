import React, { useRef } from "react";
import { motion } from "framer-motion";
import bannerImage from "../../../assets/138629855_4fa0df8e-8469-438b-b7ea-3c35d0ab5084.jpg";
import bannerImage2 from "../../../assets/young-colleagues-studying-from-notebook-laptop-study-session.jpg";
import bannerImage1 from "../../../assets/medium-shot-colleagues-having-meeting.jpg";

const Banner = ({ scrollToRef }) => {
  // Enhanced text animation variants
  const sentenceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.03,
      },
    },
  };

  const characterVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotate: 5,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
        mass: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: {},
    visible: {},
  };

  const headingText = "Change is the end result of all true Learning";

  // Floating animation for image containers
  const floatingContainer = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.8,
      },
    },
    float: {
      y: [-10, 10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
  };

  const handleStartLearningClick = () => {
    scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-6 md:p-12 min-h-screen">
        {/* Text Section */}
        <div className="text-white md:w-2/3 space-y-6 text-center md:text-left">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold leading-tight"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
          >
            {headingText.split(" ").map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className="inline-block mr-2 mb-2"
                variants={wordVariants}
              >
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`${wordIndex}-${charIndex}`}
                    className="inline-block"
                    variants={characterVariants}
                    whileHover={{
                      y: -5,
                      scale: 1.1,
                      color: "#10b981",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-lg md:text-2xl font-light max-w-3xl"
          >
            <span className="text-emerald-300 font-medium">
              "The roots of education are bitter, but the fruit is sweet."
            </span>{" "}
            Education is not preparation for life; education is life itself. The
            mind is not a vessel to be filled, but a fire to be kindled.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2 }}
            className="pt-4"
          >
            <button
              onClick={handleStartLearningClick}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30 cursor-pointer"
            >
              Start Learning
            </button>
          </motion.div>
        </div>

        {/* Image Gallery Section */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-center gap-6"
          initial="hidden"
          animate={["visible", "float"]}
          variants={floatingContainer}
        >
          {/* Main Image (bannerImage2) */}
          <motion.div className="relative w-full">
            <motion.div
              className="overflow-hidden rounded-2xl"
              animate={{
                borderRadius: [
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "60% 40% 40% 60% / 60% 60% 40% 40%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                ],
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 10px 4px rgba(16, 185, 129, 0.3)",
                  "0 0 25px 10px rgba(16, 185, 129, 0.7)",
                  "0 0 10px 4px rgba(16, 185, 129, 0.3)",
                ],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <img
                src={bannerImage2}
                alt="Students learning"
                className="w-full h-auto max-h-64 md:max-h-80 object-cover border-4 border-emerald-400/30"
              />
            </motion.div>

            <motion.div
              className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-400 rounded-full blur-md opacity-70"
              animate={{
                y: [0, -10, 0],
                x: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Secondary Image (bannerImage1) */}
          <motion.div
            className="relative w-3/4 self-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="overflow-hidden rounded-xl"
              animate={{
                borderRadius: [
                  "70% 30% 30% 70% / 70% 70% 30% 30%",
                  "40% 60% 60% 40% / 40% 40% 60% 60%",
                  "70% 30% 30% 70% / 70% 70% 30% 30%",
                ],
                scale: [1, 1.04, 1],
                boxShadow: [
                  "0 0 8px 3px rgba(20, 184, 166, 0.3)",
                  "0 0 20px 7px rgba(20, 184, 166, 0.7)",
                  "0 0 8px 3px rgba(20, 184, 166, 0.3)",
                ],
                rotate: [0, -2, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <img
                src={bannerImage1}
                alt="Colleagues meeting"
                className="w-full h-auto max-h-48 object-cover border-4 border-teal-400/30"
              />
            </motion.div>

            <motion.div
              className="absolute -bottom-3 -right-3 w-8 h-8 bg-teal-400 rounded-full blur-md opacity-50"
              animate={{
                y: [0, 8, 0],
                x: [0, 8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
