import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { Login } from "@/pages/Login";
import Events from "@/pages/Events";
import { Signin } from "@/pages/Signin";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { RecoveryPassword } from "@/pages/RecoveryPassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { User } from "@/pages/User";
import { Subscriptions } from "@/pages/Subscriptions";
import { Company } from "@/pages/Company";
import { Groups } from "@/pages/Groups";
import { EventDetails } from "@/pages/EventDetails";
import ClientLayout from "@/layouts/ClientLayout";
import { EventDetailsClient } from "@/pages/EventDetailsClient";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Events />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EventDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/event/:eventId"
          element={
            <ClientLayout>
              <EventDetailsClient />
            </ClientLayout>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Groups />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Subscriptions />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Company />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <User />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <Signin />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmail />
            </AuthLayout>
          }
        />
        <Route
          path="/recovery-password-request"
          element={
            <AuthLayout>
              <RecoveryPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="*"
          element={
            <DashboardLayout>
              <NotFoundPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
