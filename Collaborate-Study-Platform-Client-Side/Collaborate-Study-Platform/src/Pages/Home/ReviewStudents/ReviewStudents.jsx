import React, { useEffect, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    text: "The platform's live classes made Algebra and Geometry fun. Mr. Kabir explains every step so clearly! I used to fear solving equations, but now I feel confident and even enjoy the challenge. My understanding improved within weeks, and my test scores reflect the change.",
    image: "https://i.pravatar.cc/100?img=8",
    name: "Amena Khatun",
    profession: "Class 9 Student",
    subject: "Math",
    teacher: "Mr. Kabir",
  },
  {
    id: 2,
    text: "English lessons with Miss Fatima improved my writing and speaking. Now I feel confident in class discussions. She gives practical examples, assigns creative tasks, and encourages us to express ourselves. It's the most engaging class I've ever had!",
    image: "https://i.pravatar.cc/100?img=9",
    name: "Jubayer Rahman",
    profession: "College Student",
    subject: "English",
    teacher: "Miss Fatima",
  },
  {
    id: 3,
    text: "Studying Physics with Mr. Salman was eye-opening. He uses real-life examples that make learning exciting. Concepts that seemed difficult before now feel accessible and interesting.",
    image: "https://i.pravatar.cc/100?img=10",
    name: "Farhana Ahmed",
    profession: "SSC Candidate",
    subject: "Physics",
    teacher: "Mr. Salman",
  },
  {
    id: 4,
    text: "Miss Nila's Biology classes helped me score an A+. Her visuals and explanations were super helpful and made memorization easier.",
    image: "https://i.pravatar.cc/100?img=11",
    name: "Tanvir Hossain",
    profession: "HSC Student",
    subject: "Biology",
    teacher: "Miss Nila",
  },
  {
    id: 5,
    text: "I struggled with Chemistry until I joined Mr. Habib's class. He made complex formulas easy to understand and gave lots of practice questions.",
    image: "https://i.pravatar.cc/100?img=12",
    name: "Rima Sultana",
    profession: "Class 10 Student",
    subject: "Chemistry",
    teacher: "Mr. Habib",
  },
  {
    id: 6,
    text: "Thanks to Mr. Tanvir's ICT classes, I built my first website! Learning coding has been a blast and opened new doors for me.",
    image: "https://i.pravatar.cc/100?img=13",
    name: "Sakib Hasan",
    profession: "College Student",
    subject: "ICT",
    teacher: "Mr. Tanvir",
  },
  {
    id: 7,
    text: "I passed HSC Economics because of Miss Rupa's easy-to-follow lectures and practice tests. She made tough topics clear and understandable.",
    image: "https://i.pravatar.cc/100?img=14",
    name: "Mim Akter",
    profession: "HSC Candidate",
    subject: "Economics",
    teacher: "Miss Rupa",
  },
  {
    id: 8,
    text: "Miss Farhana's Bangla literature classes sparked my interest in poetry and prose like never before! She encourages creativity and critical thinking.",
    image: "https://i.pravatar.cc/100?img=15",
    name: "Rakibul Islam",
    profession: "SSC Student",
    subject: "Bangla",
    teacher: "Miss Farhana",
  },
  {
    id: 9,
    text: "General Math with Sir Anwar boosted my problem-solving skills. I now enjoy solving tricky math questions and feel more prepared for exams.",
    image: "https://i.pravatar.cc/100?img=16",
    name: "Nilufa Yasmin",
    profession: "Class 8 Student",
    subject: "Math",
    teacher: "Sir Anwar",
  },
  {
    id: 10,
    text: "Mr. Reza’s Accounting sessions made everything easy. His examples are practical and very clear, helping me understand complicated concepts.",
    image: "https://i.pravatar.cc/100?img=17",
    name: "Tarek Aziz",
    profession: "Business Studies Student",
    subject: "Accounting",
    teacher: "Mr. Reza",
  },
];

const ReviewStudents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return; // No reviews, skip

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentReview = reviews[currentIndex];

  if (!currentReview) return null; // If no review, don't render

  const { text, image, name, profession, subject, teacher } = currentReview;

  return (
    <div className="bg-gradient-to-b from-white via-[#f3fdfb] py-10  to-white  px-4  md:px-0">
      <div className="max-w-3xl mx-auto text-center ">
        <h2 className="text-3xl font-bold mb-6">Student Reviews</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col gap-6 items-center h-auto"
          >
            <FaQuoteLeft className="text-3xl text-gray-300" />
            <p className="italic text-gray-800 max-w-xl">“{text}”</p>
            <div className="flex items-center gap-4">
              <img
                src={image}
                alt={name}
                className="w-14 h-14 rounded-full border-2 border-primary1"
              />
              <div className="text-left">
                <h4 className="font-semibold text-lg">{name}</h4>
                <p className="text-sm text-gray-500">{profession}</p>
                <p className="text-sm text-gray-500">
                  Subject: {subject} | Teacher: {teacher}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewStudents;
