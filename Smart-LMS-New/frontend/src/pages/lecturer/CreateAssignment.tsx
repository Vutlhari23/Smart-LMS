import { FormEvent, useEffect, useState } from "react";
import api from "../../api/api";

export default function CreateAssignment() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/courses/my")
      .then((res) => setCourses(res.data))
      .catch(() => setMessage("Unable to load courses."));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!courseId) {
      setMessage("Please select a course first.");
      return;
    }
try {
  const token = localStorage.getItem("smart_lms_token");

  const response = await fetch("http://localhost:8000/api/v1/assignments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      course_id: courseId,
      title,
      description,
      due_date: dueDate || null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create assignment");
  }

  setMessage("Assignment created successfully.");
  setTitle("");
  setDescription("");
  setDueDate("");
} catch (error) {
  setMessage("Unable to create assignment. Please try again.");
}
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <h1 className="text-2xl font-semibold">Create Assignment</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Add assignments to your course, set deadlines, and track student
          submissions.
        </p>
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
            Course
          </span>
          <select
            value={courseId}
            onChange={(e) => setCourseId(Number(e.target.value))}
            required
            className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Title
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
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Due date
          </span>
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            type="datetime-local"
            className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          />
        </label>
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          type="submit"
        >
          Create assignment
        </button>
      </form>
    </div>
  );
}
