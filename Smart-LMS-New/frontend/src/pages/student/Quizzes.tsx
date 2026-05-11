import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch(() => setMessage("Unable to load quizzes."));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Available Quizzes</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Browse quizzes for your enrolled courses and start the next test.
        </p>
      </section>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-xl bg-white p-5 shadow dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {quiz.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/student/quiz/${quiz.id}`}
                className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
              >
                Attempt quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
