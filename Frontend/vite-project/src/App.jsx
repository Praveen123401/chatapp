// import Navbar from './components/Navbar.jsx'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import HomePage from './Pages/HomePage.jsx'
// import SignUpPage from './Pages/SignUpPage.jsx'
// import LoginPage from './Pages/LoginPage.jsx'
// import SettingsPage from './Pages/SettingPage.jsx'
// import ProfilePage from './Pages/ProfilePage.jsx'
// import { useEffect } from 'react'
// import { useAuthStore } from "./Store/useAuthStore";

// import { Loader } from 'lucide-react' 
// import { Toaster } from 'react-hot-toast'

// const App = () => {
//   const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);
//   console.log({ authUser });

//   if (isCheckingAuth && authUser) return (
//     <div className='flex justify-center items-center h-screen'>
//       <Loader className='size-10 animate-spin' />
//     </div>
//   )
//   return (
//     <div>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
//         <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
//         <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
//         <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
//         <Route path='/Profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
//       </Routes>  
//       <Toaster/>
//     </div>
//   )
// }

// export default App 


import Navbar from "./components/Navbar.jsx";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SettingsPage from "./Pages/SettingPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/ThemeStore.js";
import { Loader } from "lucide-react"; 
import { Toaster } from "react-hot-toast"; 
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  console.log("Online Users"); 

  useEffect(() => {
    checkAuth();
  }, []); // run once

  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("chat-theme-storage");
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        if (themeData.state && themeData.state.theme) {
          document.documentElement.setAttribute("data-theme", themeData.state.theme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        document.documentElement.setAttribute("data-theme", "light");
      }
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // Apply theme changes globally whenever theme changes
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    }
  }, [theme]);

  // ✅ CORRECT loader logic
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="app-root">
      <Navbar />

      <div className="app-shell">
        <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
};

export default App;

