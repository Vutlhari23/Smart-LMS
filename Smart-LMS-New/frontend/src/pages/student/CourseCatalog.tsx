import { useEffect, useState } from "react";
import api from "../../api/api";

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch(() => setMessage("Unable to load courses."));
  }, []);

  const enroll = async (courseId: number) => {
try {
  const token = localStorage.getItem("smart_lms_token");

  const response = await fetch("http://localhost:8000/api/v1/enrollments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      course_id: courseId,
    }),
  });

  if (!response.ok) {
    throw new Error("Enrollment failed");
  }

  setMessage("Enrolled successfully!");
} catch (error) {
  setMessage("Enrollment failed. Check your login or course availability.");
}
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <h1 className="text-2xl font-semibold">Course Catalog</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Browse available courses and enroll to start learning.
        </p>
      </div>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course: any) => (
          <div
            key={course.id}
            className="rounded-xl bg-white p-5 shadow dark:bg-indigo-600"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-200">
              {course.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => enroll(course.id)}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
