import React from "react";
import { createBrowserRouter } from "react-router";
import MainLayouts from "../Layouts/MainLayouts";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/LogIn/Login";
import Register from "../Pages/Authentication/Register/Register";
import AuthLayouts from "../Layouts/AuthLayouts";
import Dashboard from "../Pages/Dashboard/Dashboard";
import CreateStudy from "../Pages/Dashboard/Tutors/CreateStudy";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import MySession from "../Pages/Dashboard/Tutors/MySession";
import ViewUsers from "../Pages/Dashboard/Admin/ViewUsers";
import AllSessions from "../Pages/Dashboard/Admin/AllSessions";
import UploadMaterials from "../Pages/Dashboard/Tutors/UploadMaterials";
import MyMaterials from "../Pages/Dashboard/Tutors/MyMaterials";
import AllMaterials from "../Pages/Dashboard/Admin/AllMaterials";
import AvailableStudyDetails from "../Pages/Home/AvailbleStudySession/AvailableStudyDetails";
import StudySession from "../Pages/Home/StudySession/StudySession";
import Tutor from "../Pages/Home/Tutor/Tutor";
import Error from "../Components/Error";
import MyBookedSession from "../Pages/Dashboard/Students/MyBookedSession";
import Payment from "../Pages/Home/AvailbleStudySession/Payment";
import MyBookedDetails from "../Pages/Dashboard/Students/MyBookedDetails";
import CreateNote from "../Pages/Dashboard/Students/CreateNote";
import ManageNote from "../Pages/Dashboard/Students/ManageNote";
import StudyMaterials from "../Pages/Dashboard/Students/StudyMaterials";
import ForbiddenPage from "../Components/ForbiddenPage";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayouts,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "availableStudyDetails/:id",
        element: (
          <PrivateRoute>
            <AvailableStudyDetails></AvailableStudyDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "studySession",
        Component: StudySession,
      },
      {
        path: "tutor",
        Component: Tutor,
      },
      {
        path: "/payment/:id",
        Component: Payment,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayouts,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "forbidden",
        Component: ForbiddenPage,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      // student
      {
        path: "myBooked",
        Component: MyBookedSession,
      },
      {
        path: "myBookedDetails/:id",
        Component: MyBookedDetails,
      },
      {
        path: "createNote",
        Component: CreateNote,
      },
      {
        path: "manageNotes",
        Component: ManageNote,
      },
      {
        path: "studyMaterials",
        Component: StudyMaterials,
      },
      // Tutor
      {
        path: "createStudy",
        Component: CreateStudy,
      },
      {
        path: "mySessions",
        Component: MySession,
      },
      {
        path: "uploadMaterials",
        Component: UploadMaterials,
      },
      {
        path: "myMaterials",
        Component: MyMaterials,
      },
      // admin
      {
        path: "viewUsers",
        Component: ViewUsers,
      },
      {
        path: "allSessions",
        Component: AllSessions,
      },
      {
        path: "allMaterials",
        Component: AllMaterials,
      },
    ],
  },
  {
    path: "/*",
    Component: Error,
  },
]);
export default router;
