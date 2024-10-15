// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext";
import Render from "./pages/Render";
import Login from "./pages/SignIn";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<Render />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
