import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import ProctoringCamera from "../../components/Proctoring/ProctoringCamera";

export default function QuizRoom() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!quizId) return;
    api
      .get(`/quizzes/${quizId}`)
      .then((res) => setQuiz(res.data))
      .catch(() => setMessage("Unable to load quiz."));
  }, [quizId]);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((current) => ({ ...current, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const payload = {
      quiz_id: quiz.id,
      answers: quiz.questions.map((question: any) => ({
        question_id: question.id,
        chosen_option: answers[question.id] || "",
      })),
    };
    try {
      const result = await api.post("/quizzes/attempt", payload);
      setMessage(`Quiz submitted. Score: ${result.data.score}`);
    } catch (error) {
      setMessage("Unable to submit quiz. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Quiz Room</h1>
        {quiz && (
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {quiz.title}
          </p>
        )}
      </div>
      <ProctoringCamera quizId={quiz?.id} />
      {message && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/70">
          {message}
        </div>
      )}
      <div className="space-y-4">
        {quiz?.questions?.map((question: any) => (
          <div
            key={question.id}
            className="rounded-xl bg-white p-5 shadow dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold">{question.prompt}</h2>
            <div className="mt-3 space-y-2">
              {["option_a", "option_b", "option_c", "option_d"].map(
                (optionKey) => (
                  <label key={optionKey} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={question[optionKey]}
                      checked={answers[question.id] === question[optionKey]}
                      onChange={() =>
                        handleSelect(question.id, question[optionKey])
                      }
                    />
                    <span>{question[optionKey]}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      {quiz && (
        <button
          onClick={handleSubmit}
          className="rounded bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}
