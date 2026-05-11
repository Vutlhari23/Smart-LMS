import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

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
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Lecturer Dashboard</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Create content, track student performance, and manage quizzes.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Courses</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {courses.length} active course(s)
          </p>
          <Link
            to="/lecturer/courses"
            className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Manage courses
          </Link>
        </div>
        <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Assignments</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {assignments.length} submissions waiting
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/lecturer/assignments"
              className="inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              Create assignment
            </Link>
            <Link
              to="/lecturer/submissions"
              className="inline-block rounded border border-slate-900 px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 dark:border-slate-50 dark:text-slate-50 dark:hover:bg-slate-800"
            >
              Grade submissions
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Quizzes</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {quizzes.length} quizzes published
          </p>
          <Link
            to="/lecturer/quizzes"
            className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Create a quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
