import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from "~/components/layout/AppLayout";

const Dashboard = lazy(() => import("~/pages/DashboardPage"));
const Attendance = lazy(() => import("~/pages/AttendancePage"));
const Leave = lazy(() => import("~/pages/LeavePage"));
const Team = lazy(() => import("~/pages/TeamPage"));
const Announcements = lazy(() => import("~/pages/AnnouncementsPage"));
const Calendar = lazy(() => import("~/pages/CalendarPage"));
const Profile = lazy(() => import("~/pages/ProfilePage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "leave",
        element: <Leave />,
      },
      {
        path: "team",
        element: <Team />,
      },
      {
        path: "announcements",
        element: <Announcements />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} useTransitions />;
};

export default AppRoutes;
