import { Route, Routes, Navigate } from "react-router-dom"
import SignupPage from "./Pages/Auth/SignUp/SignupPage"
import LoginPage from "./Pages/Auth/Login/LoginPage"
import HomePage from "./Pages/Home/HomePage"
import NotificationPage from "./Pages/Notification/NotificationPage"
import ProfilePage from "./Pages/Profile/ProfilePage"


import Sidebar from "./Components/common/Sidebar"
import RightPanel from "./Components/common/RightPanel"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.error) {
        return null;
      }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log('authUser', data);

      return data.data;
    },
    retry: false
  }
  )

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )
  }



  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
