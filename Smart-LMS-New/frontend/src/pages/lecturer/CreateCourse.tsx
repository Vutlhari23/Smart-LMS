import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses/my");
      setCourses(response.data);
    } catch (error) {
      setMessage("Unable to load your courses.");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
try {
  const token = localStorage.getItem("smart_lms_token");

  const response = await fetch("http://localhost:8000/api/v1/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create course");
  }

  setMessage("Course created successfully.");
  setTitle("");
  setDescription("");
  loadCourses();
} catch (error) {
  setMessage("Unable to create course. Please try again.");
}
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Create Course</h1>
            <p className="mt-2 text-slate-700 dark:text-slate-200">
              Add a new module for your students and publish learning materials
              quickly.
            </p>
          </div>
          <Link
            to="/lecturer/quizzes"
            className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Create Quiz
          </Link>
        </div>
      </section>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow dark:bg-indigo-600"
      >
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Course title
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            required
            className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          />
        </label>
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          type="submit"
        >
          Save course
        </button>
      </form>
      <section className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <h2 className="text-xl font-semibold">My Courses</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="mt-2 text-slate-700 dark:text-slate-200">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
