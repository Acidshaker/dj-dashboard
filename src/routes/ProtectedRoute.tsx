import { useSelector } from "react-redux";
import type { RootState } from "../store/index.ts";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.session.isAuthenticated
  );
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    toast.error("Tu sesión ha expirado o no estás autenticado.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
