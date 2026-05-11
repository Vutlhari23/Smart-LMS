import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import LecturerDashboard from "./pages/lecturer/Dashboard";
import CreateCourse from "./pages/lecturer/CreateCourse";
import CreateQuiz from "./pages/lecturer/CreateQuiz";
import CreateAssignment from "./pages/lecturer/CreateAssignment";
import GradeSubmissions from "./pages/lecturer/GradeSubmissions";
import StudentDashboard from "./pages/student/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import CourseCatalog from "./pages/student/CourseCatalog";
import QuizRoom from "./pages/student/QuizRoom";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentAssignments from "./pages/student/Assignments";
import StudentResults from "./pages/student/Results";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/lecturer/dashboard"
            element={
              <ProtectedRoute role="lecturer">
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses"
            element={
              <ProtectedRoute role="lecturer">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/quizzes"
            element={
              <ProtectedRoute role="lecturer">
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/assignments"
            element={
              <ProtectedRoute role="lecturer">
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/submissions"
            element={
              <ProtectedRoute role="lecturer">
                <GradeSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute role="student">
                <CourseCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/quizzes"
            element={
              <ProtectedRoute role="student">
                <StudentQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute role="student">
                <StudentAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <ProtectedRoute role="student">
                <StudentResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/quiz/:quizId"
            element={
              <ProtectedRoute role="student">
                <QuizRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
