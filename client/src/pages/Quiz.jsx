import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(res => setQuiz(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!quiz) return <div className="text-center py-16 text-gray-400">Quiz not found.</div>;

  const questions = quiz.questions;
  const q = questions[current];
  const progress = (current / questions.length) * 100;

  function selectOption(idx) {
    if (revealed) return;
    setSelected(idx);
  }

  function checkAnswer() {
    if (selected === null) return;
    setRevealed(true);
    setAnswers(a => ({ ...a, [q.id]: selected }));
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      submitQuiz();
    }
  }

  async function submitQuiz() {
    setSubmitting(true);
    setSubmitError('');
    try {
      const finalAnswers = { ...answers, [q.id]: selected };
      const { data } = await api.post(`/quizzes/${id}/attempt`, { answers: finalAnswers });
      setResult(data);
    } catch (e) {
      if (e.response?.status === 401) {
        setSubmitError('Your session has expired. Please sign out and log back in.');
      } else {
        setSubmitError('Could not submit quiz. The server may be waking up — please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Result screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="card text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl ${result.passed ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            {result.passed ? '🎉' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-navy">{result.passed ? 'Well Done!' : 'Keep Studying!'}</h2>
          <p className="text-gray-400 text-sm mt-1">{quiz.title}</p>

          <div className="flex justify-center gap-10 my-8">
            <div>
              <div className={`text-4xl font-bold ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                {result.score}%
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Your Score</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <div className="text-4xl font-bold text-gray-700">{result.correct}/{result.total}</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Correct</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <div className="text-4xl font-bold text-navy">{quiz.pass_score}%</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Pass Mark</div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm mb-6 ${
            result.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {result.passed ? '✓ PASSED' : '✗ FAILED — Review the module and try again'}
          </div>

          {/* Per-question review */}
          <div className="text-left mt-4 space-y-3">
            {result.results.map((r, i) => (
              <div key={r.question_id} className={`rounded-xl p-4 border ${r.is_correct ? 'bg-emerald-50/60 border-emerald-100' : 'bg-red-50/60 border-red-100'}`}>
                <div className="flex gap-3 items-start">
                  <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${r.is_correct ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      {r.is_correct
                        ? <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        : <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      }
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{i + 1}. {r.question_text}</p>
                    {!r.is_correct && (
                      <p className="text-xs text-red-600 mt-1">
                        Your answer: <em>{r.options[r.selected]}</em>
                        {' · '}Correct: <strong>{r.options[r.correct_answer]}</strong>
                      </p>
                    )}
                    {r.explanation && (
                      <p className="text-xs text-gray-400 mt-1">{r.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 justify-center">
            <button
              onClick={() => { setResult(null); setCurrent(0); setAnswers({}); setSelected(null); setRevealed(false); }}
              className="btn-outline"
            >
              Retake Quiz
            </button>
            <Link to="/" className="btn-secondary">Back to Hub</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold text-navy text-base">{quiz.title}</h1>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {current + 1} / {questions.length}
          </span>
        </div>
        <div className="bg-gray-100 rounded-full h-1">
          <div
            className="bg-gold h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <p className="text-base font-semibold text-gray-800 mb-6 leading-snug">{q.question_text}</p>

        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            let cls = 'border-gray-100 bg-gray-50 text-gray-600 hover:border-navy/30 hover:bg-navy/5 cursor-pointer';
            if (revealed) {
              if (idx === q.correct_answer) cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 cursor-default';
              else if (idx === selected && idx !== q.correct_answer) cls = 'border-red-300 bg-red-50 text-red-700 cursor-default';
              else cls = 'border-gray-100 bg-gray-50 text-gray-300 cursor-default';
            } else if (idx === selected) {
              cls = 'border-gold bg-[#2CC4BD]/10 text-navy cursor-pointer';
            }

            return (
              <button
                key={idx}
                onClick={() => selectOption(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all duration-150 text-sm ${cls}`}
              >
                <span className="mr-3 text-xs font-bold opacity-40">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && q.explanation && (
          <div className="mt-4 p-4 bg-navy/5 border border-navy/10 rounded-xl text-sm text-navy/70">
            <span className="font-semibold text-navy">Explanation: </span>{q.explanation}
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
            <span>⚠️</span>
            <div>
              <p>{submitError}</p>
              <button
                onClick={() => { setSubmitError(''); submitQuiz(); }}
                className="mt-2 text-xs font-semibold text-red-700 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-xs text-gray-300">Pass mark: {quiz.pass_score}%</span>
          {!revealed ? (
            <button onClick={checkAnswer} disabled={selected === null} className="btn-primary">
              Check Answer
            </button>
          ) : (
            <button onClick={next} disabled={submitting} className="btn-secondary">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : current < questions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
