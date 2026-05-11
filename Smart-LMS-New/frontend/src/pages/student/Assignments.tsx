import { useEffect, useState } from "react";
import api from "../../api/axios";

interface SubmissionStatus {
  id: number;
  assignment_id: number;
  grade?: number;
  feedback?: string;
  submitted_at: string;
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, string>>({});
  const [submissionStatus, setSubmissionStatus] = useState<
    Record<number, SubmissionStatus>
  >({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/assignments")
      .then((res) => setAssignments(res.data))
      .catch(() => setMessage("Unable to load assignments."));

    api
      .get("/assignments/submissions")
      .then((res) => {
        const statusMap = res.data.reduce(
          (
            acc: Record<number, SubmissionStatus>,
            submission: SubmissionStatus,
          ) => {
            acc[submission.assignment_id] = submission;
            return acc;
          },
        );
        setSubmissionStatus(statusMap);
      })
      .catch(() => {});
  }, []);

  const handleChange = (assignmentId: number, value: string) => {
    setSubmissions((prev) => ({ ...prev, [assignmentId]: value }));
  };

  const handleSubmit = async (assignmentId: number) => {
    const content = submissions[assignmentId] || "";
    try {
      const response = await api.post("/assignments/submit", {
        assignment_id: assignmentId,
        content,
      });
      setMessage("Assignment submitted successfully.");
      setSubmissions((prev) => ({ ...prev, [assignmentId]: "" }));
      setSubmissionStatus((prev) => ({
        ...prev,
        [assignmentId]: response.data,
      }));
    } catch (error) {
      setMessage("Unable to submit assignment. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Submit assignments for your enrolled courses and track your progress.
        </p>
      </section>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const status = submissionStatus[assignment.id];
          return (
            <div
              key={assignment.id}
              className="rounded-xl bg-white p-6 shadow dark:bg-slate-900"
            >
              <h2 className="text-xl font-semibold">{assignment.title}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {assignment.description}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Course ID: {assignment.course_id} · Due:{" "}
                  {assignment.due_date ?? "No due date"}
                </p>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {status ? "Submitted" : "Not submitted"}
                </span>
              </div>
              {status && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <p>
                    <strong>Grade:</strong> {status.grade ?? "Pending review"}
                  </p>
                  <p className="mt-2">
                    <strong>Feedback:</strong>{" "}
                    {status.feedback ?? "Waiting for feedback"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Submitted at:{" "}
                    {new Date(status.submitted_at).toLocaleString()}
                  </p>
                </div>
              )}
              <textarea
                value={submissions[assignment.id] || ""}
                onChange={(e) => handleChange(assignment.id, e.target.value)}
                rows={4}
                placeholder="Write your submission notes here..."
                className="mt-4 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
              <button
                onClick={() => handleSubmit(assignment.id)}
                className="mt-4 rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
              >
                Submit assignment
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
