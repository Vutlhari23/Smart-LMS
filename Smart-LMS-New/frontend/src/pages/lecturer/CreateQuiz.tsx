import { FormEvent, useEffect, useState } from "react";
import api from "../../api/axios";

interface QuestionShape {
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  marks: number;
}

export default function CreateQuiz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState<QuestionShape[]>([
    {
      prompt: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "option_a",
      marks: 1,
    },
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/courses/my")
      .then((res) => setCourses(res.data))
      .catch(() => setMessage("Unable to load courses."));
  }, []);

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionShape,
    value: string | number,
  ) => {
    const cloned = [...questions];
    cloned[index] = { ...cloned[index], [field]: value } as QuestionShape;
    setQuestions(cloned);
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        prompt: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "option_a",
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedCourse) {
      setMessage("Select a course before creating a quiz.");
      return;
    }

    try {
      await api.post("/quizzes", {
        course_id: selectedCourse,
        title,
        description,
        duration_minutes: duration,
        questions,
      });
      setMessage("Quiz published successfully.");
      setTitle("");
      setDescription("");
      setDuration(10);
      setQuestions([
        {
          prompt: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_option: "option_a",
          marks: 1,
        },
      ]);
    } catch (error) {
      setMessage("Unable to publish quiz. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Create Quiz</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Build quiz questions and assign them to one of your courses.
        </p>
      </section>
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl bg-white p-6 shadow dark:bg-slate-900"
      >
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Course
          </span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Quiz title
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
            rows={3}
            className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Duration (minutes)
          </span>
          <input
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            type="number"
            min={1}
            className="mt-1 w-24 rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          />
        </label>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Question {index + 1}</h2>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <label className="block mt-3">
                <span className="text-sm">Prompt</span>
                <textarea
                  value={question.prompt}
                  onChange={(e) =>
                    handleQuestionChange(index, "prompt", e.target.value)
                  }
                  rows={2}
                  required
                  className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                {(
                  ["option_a", "option_b", "option_c", "option_d"] as const
                ).map((option) => (
                  <label key={option} className="block">
                    <span className="text-sm">
                      {option.replace("option_", "Option ")}
                    </span>
                    <input
                      value={question[option]}
                      onChange={(e) =>
                        handleQuestionChange(index, option, e.target.value)
                      }
                      required
                      className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                    />
                  </label>
                ))}
              </div>
              <label className="block mt-3">
                <span className="text-sm">Correct Option</span>
                <select
                  value={question.correct_option}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "correct_option",
                      e.target.value,
                    )
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                >
                  <option value="option_a">Option A</option>
                  <option value="option_b">Option B</option>
                  <option value="option_c">Option C</option>
                  <option value="option_d">Option D</option>
                </select>
              </label>
              <label className="block mt-3">
                <span className="text-sm">Marks</span>
                <input
                  value={question.marks}
                  onChange={(e) =>
                    handleQuestionChange(index, "marks", Number(e.target.value))
                  }
                  type="number"
                  min={1}
                  className="mt-1 w-24 rounded border px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            className="rounded bg-slate-200 px-4 py-2 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            onClick={addQuestion}
          >
            Add question
          </button>
          <button
            className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            type="submit"
          >
            Publish quiz
          </button>
        </div>
      </form>
    </div>
  );
}
