import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    api
      .get("/enrollments/me")
      .then((res) => setEnrollments(res.data))
      .catch(() => {});
    api
      .get("/quizzes/attempts")
      .then((res) => setAttempts(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <h2 className="text-xl font-semibold">Student Dashboard</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Access courses, quizzes, and progress information here.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
          <h3 className="text-lg font-semibold">Enrolled courses</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            {enrollments.length} course(s) enrolled
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/student/courses"
              className="inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Browse courses
            </Link>
            <Link
              to="/student/assignments"
              className="inline-block rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              Submit assignments
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
          <h3 className="text-lg font-semibold">Quiz progress</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            {attempts.length} attempt(s) recorded
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/student/quizzes"
              className="inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              View quizzes
            </Link>
            <Link
              to="/student/results"
              className="inline-block rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              See results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
