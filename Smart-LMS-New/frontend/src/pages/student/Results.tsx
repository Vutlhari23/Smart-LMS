import { useEffect, useState } from "react";
import api from "../../api/api";

export default function StudentResults() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/quizzes/attempts")
      .then((res) => setAttempts(res.data))
      .catch(() => setMessage("Unable to load results."));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600">
        <h1 className="text-2xl font-semibold">Quiz Results</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Review your quiz performance and track your marks over time.
        </p>
      </section>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className="rounded-xl bg-white p-6 shadow dark:bg-indigo-600"
          >
            <h2 className="text-xl font-semibold">Quiz ID {attempt.quiz_id}</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-200">
              Score: {attempt.score}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Completed: {attempt.completed ? "Yes" : "Pending"}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Submitted at: {new Date(attempt.submitted_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
