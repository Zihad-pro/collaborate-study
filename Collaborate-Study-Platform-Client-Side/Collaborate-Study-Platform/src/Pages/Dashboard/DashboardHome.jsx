import React from "react";
import DashboardTutors from "./Tutors/DashboardTutors";
import useUserRole from "../../Hooks/useUserRole";
import StudentDashboard from "./Students/StudentDashboard";
import Loading from "../../Components/Loading/Loading";
import DashboardAdminHome from "./Admin/DashboardAdminHome";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading />;
  }

  return (
    <div>
      {role === "user" && <StudentDashboard />}
      {role === "tutor" && <DashboardTutors />}
      {role === "admin" && <DashboardAdminHome />}
    </div>
  );
};

export default DashboardHome;
