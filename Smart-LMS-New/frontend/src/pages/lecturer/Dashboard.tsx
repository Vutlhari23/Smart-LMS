import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function LecturerDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api
      .get("/courses/my")
      .then((res) => setCourses(res.data))
      .catch(() => {});
    api
      .get("/assignments/submissions")
      .then((res) => setAssignments(res.data))
      .catch(() => {});
    api
      .get("/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <h2 className="text-xl font-semibold">Lecturer Dashboard</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Create content, track student performance, and manage quizzes.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
          <h3 className="text-lg font-semibold">Courses</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            {courses.length} active course(s)
          </p>
          <Link
            to="/lecturer/courses"
            className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Manage courses
          </Link>
        </div>
        <div className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
          <h3 className="text-lg font-semibold">Assignments</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            {assignments.length} submissions waiting
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/lecturer/assignments"
              className="inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Create assignment
            </Link>
            <Link
              to="/lecturer/submissions"
              className="inline-block rounded border border-indigo-700 px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 dark:border-slate-50 dark:text-slate-50 dark:hover:bg-indigo-800"
            >
              Grade submissions
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
          <h3 className="text-lg font-semibold">Quizzes</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            {quizzes.length} quizzes published
          </p>
          <Link
            to="/lecturer/quizzes"
            className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Create a quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
