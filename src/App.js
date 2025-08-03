import React, { useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUser } from "./context/UserContext";
import FaultsPage from "./pages/FaultsPage";
import AllFaults from "./pages/AllFaults";
import DoneFaults from "./pages/DoneFaults";
import OpenFaults from "./pages/OpenFaults";
import UserManagement from "./pages/UserManagement";
function App() {
  const { user, setUser } = useUser();

  useEffect(() => {
    const expiration = localStorage.getItem("authExpiration");
    const currentTime = new Date().getTime();

    if (expiration && currentTime > Number(expiration)) {
      // Auth expired: log the user out
      setUser(null);
    }
  }, [setUser]);
  useEffect(() => {
    const resetExpiration = () => {
      if (user) {
        const newExpiration = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours
        localStorage.setItem("authExpiration", newExpiration.toString());
      }
    };

    // Listen for user activity
    window.addEventListener("click", resetExpiration);
    window.addEventListener("keypress", resetExpiration);

    return () => {
      window.removeEventListener("click", resetExpiration);
      window.removeEventListener("keypress", resetExpiration);
    };
  }, [user]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/MainPage"
          element={
            <ProtectedRoute>
              <MainPage></MainPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Faults"
          element={
            <ProtectedRoute>
              <FaultsPage></FaultsPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unresolved"
          element={
            <ProtectedRoute>
              <OpenFaults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resolved"
          element={
            <ProtectedRoute>
              <DoneFaults />
            </ProtectedRoute>
          }
        />
        <Route
  path="/users"
  element={
    <ProtectedRoute>
      <UserManagement />
    </ProtectedRoute>
  }
/>
        <Route
          path="/all"
          element={
            <ProtectedRoute>
              <AllFaults />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
