import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { AdminLogin } from "./pages/AdminLogin";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/signup", Component: Signup },
  { path: "/login", Component: Login },
  { path: "/admin-login", Component: AdminLogin },
  { path: "/dashboard", Component: UserDashboard },
  { path: "/admin", Component: AdminDashboard },
]);
