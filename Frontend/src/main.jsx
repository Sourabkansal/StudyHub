import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Signup from "./component/signup.jsx";
import Login from "./component/login.jsx";
import Home from "./component/home.jsx";
import ScheduleStudy from "./component/ScheduleStudy/ScheduleStudy.jsx";
import AiSchedule from "./component/AiSchedule/AiSchedule.jsx";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("user");

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signup" replace />;
};

let routerr = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
        <Route
          path=""
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/ScheduleStudy" element={
          <ProtectedRoute>
            <ScheduleStudy />
          </ProtectedRoute>
          } />
      <Route path="/AiSchedule" element={
        <ProtectedRoute>
          <AiSchedule/>
        </ProtectedRoute>
        
        }/>

      </Route>
      <Route path="/Signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={routerr} />
);
