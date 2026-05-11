import { useEffect, useState } from "react";
import api from "../../api/axios";

interface SubmissionItem {
  id: number;
  assignment_id: number;
  student_id: number;
  content?: string;
  grade?: number;
  feedback?: string;
  submitted_at: string;
}

export default function GradeSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const [formState, setFormState] = useState<
    Record<number, { grade: string; feedback: string }>
  >({});

  useEffect(() => {
    api
      .get("/assignments/submissions")
      .then((res) => {
        setSubmissions(res.data);
        const initial = res.data.reduce(
          (
            acc: Record<number, { grade: string; feedback: string }>,
            item: SubmissionItem,
          ) => {
            acc[item.id] = {
              grade: item.grade?.toString() ?? "",
              feedback: item.feedback ?? "",
            };
            return acc;
          },
          {},
        );
        setFormState(initial);
      })
      .catch(() => setMessage("Unable to load submissions."));
  }, []);

  const handleChange = (
    submissionId: number,
    field: "grade" | "feedback",
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (submissionId: number) => {
    const current = formState[submissionId] || { grade: "", feedback: "" };
    const payload = {
      grade: current.grade ? Number(current.grade) : null,
      feedback: current.feedback,
    };

    try {
      const response = await api.put(
        `/assignments/submissions/${submissionId}`,
        payload,
      );
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === submissionId ? response.data : submission,
        ),
      );
      setMessage("Submission grade updated successfully.");
    } catch (error) {
      setMessage("Unable to update submission. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Grade Submissions</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Review student assignment work, assign grades, and provide feedback.
        </p>
      </section>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="rounded-xl bg-white p-6 shadow dark:bg-slate-900"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Submission #{submission.id}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Assignment ID: {submission.assignment_id} · Student ID:{" "}
                  {submission.student_id}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Submitted:{" "}
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                Current grade: {submission.grade ?? "Not graded"}
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Submission content
                </label>
                <p className="mt-2 rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  {submission.content || "No content submitted."}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Grade
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formState[submission.id]?.grade ?? ""}
                    onChange={(e) =>
                      handleChange(submission.id, "grade", e.target.value)
                    }
                    className="mt-2 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Feedback
                  </span>
                  <textarea
                    rows={3}
                    value={formState[submission.id]?.feedback ?? ""}
                    onChange={(e) =>
                      handleChange(submission.id, "feedback", e.target.value)
                    }
                    className="mt-2 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                    placeholder="Add feedback for the student"
                  />
                </label>
              </div>
              <button
                onClick={() => handleSave(submission.id)}
                className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
              >
                Save grade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
