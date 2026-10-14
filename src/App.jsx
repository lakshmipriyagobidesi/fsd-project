
import { useEffect, useState } from "react";
import "./App.css";

const questions = [
  {
    id: 1,
    subject: "React",
    question: "What is React?",
    options: [
      "A database",
      "A JavaScript library for building user interfaces",
      "An operating system",
      "A programming language"
    ],
    answer: 1,
    explanation: "React is a JavaScript library used to build user interfaces."
  },
  {
    id: 2,
    subject: "Java",
    question: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    answer: 1,
    explanation: "The extends keyword is used for class inheritance."
  },
  {
    id: 3,
    subject: "Python",
    question: "Which symbol starts a comment in Python?",
    options: ["//", "#", "/*", "--"],
    answer: 1,
    explanation: "A single-line Python comment starts with #."
  },
  {
    id: 4,
    subject: "DBMS",
    question: "What is the full form of DBMS?",
    options: [
      "Data Backup Management System",
      "Database Management System",
      "Digital Base Management Software",
      "Data Binary Management System"
    ],
    answer: 1,
    explanation: "DBMS means Database Management System."
  },
  {
    id: 5,
    subject: "Aptitude",
    question: "What is 25% of 200?",
    options: ["25", "40", "50", "75"],
    answer: 2,
    explanation: "25% of 200 = (25 / 100) × 200 = 50."
  },
  {
    id: 6,
    subject: "HR",
    question: "What should you include when answering 'Tell me about yourself'?",
    options: [
      "Only your hobbies",
      "Your introduction, skills, education, and goals",
      "Personal details about friends",
      "Nothing related to the job"
    ],
    answer: 1,
    explanation: "Give a brief introduction focused on education, skills, and career goals."
  }
];

const interviewQuestions = [
  {
    category: "HR",
    question: "Tell me about yourself.",
    hint: "Introduce yourself, your education, skills, and career goals."
  },
  {
    category: "HR",
    question: "What are your strengths?",
    hint: "Mention strengths and give a real example."
  },
  {
    category: "React",
    question: "What is the difference between props and state?",
    hint: "Explain how data is passed and how component data changes."
  },
  {
    category: "JavaScript",
    question: "What is the difference between let, const, and var?",
    hint: "Discuss scope, reassignment, and declarations."
  },
  {
    category: "DBMS",
    question: "What is the difference between a primary key and a foreign key?",
    hint: "Explain unique identification and relationships between tables."
  }
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [quiz, setQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [quizDone, setQuizDone] = useState(false);

  const [interview, setInterview] = useState(false);
  const [interviewIndex, setInterviewIndex] = useState(0);
  const [interviewType, setInterviewType] = useState("All");
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(60);
  const [interviewDone, setInterviewDone] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mockHistory") || "[]");
    } catch {
      return [];
    }
  });

  const subjects = ["All", ...new Set(questions.map(q => q.subject))];

  const filtered = questions.filter(q =>
    (subject === "All" || q.subject === subject) &&
    (q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const quizScore = questions.reduce(
    (total, q) => total + (selected[q.id] === q.answer ? 1 : 0),
    0
  );

  const activeInterviewQuestions = interviewQuestions.filter(
    q => interviewType === "All" || q.category === interviewType
  );

  const currentInterview = activeInterviewQuestions[interviewIndex];

  function saveResult(type, score, total) {
    const record = {
      id: Date.now(),
      type,
      score,
      total,
      date: new Date().toLocaleString()
    };

    setHistory(old => {
      const updated = [record, ...old];
      try {
        localStorage.setItem("mockHistory", JSON.stringify(updated));
      } catch {
        // The current session still works if storage is unavailable.
      }
      return updated;
    });
  }

  useEffect(() => {
    if (!interview || interviewDone || !currentInterview) return;

    const timer = setInterval(() => {
      setSeconds(old => {
        if (old <= 1) {
          clearInterval(timer);
          setInterviewDone(true);
          saveResult("Mock Interview", interviewIndex + 1,
            activeInterviewQuestions.length);
          return 0;
        }
        return old - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interview, interviewDone, interviewIndex, interviewType]);

  function startQuiz() {
    setSelected({});
    setQuizIndex(0);
    setQuizDone(false);
    setQuiz(true);
    setPage("quiz");
  }

  function finishQuiz() {
    setQuizDone(true);
    saveResult("Question Bank Quiz", quizScore, questions.length);
  }

  function startInterview() {
    setInterviewType("All");
    setInterviewIndex(0);
    setAnswers({});
    setSeconds(60);
    setInterviewDone(false);
    setInterview(true);
    setPage("interview");
  }

  function nextInterview() {
    if (interviewIndex + 1 < activeInterviewQuestions.length) {
      setInterviewIndex(i => i + 1);
      setSeconds(60);
    } else {
      setInterviewDone(true);
      saveResult("Mock Interview", activeInterviewQuestions.length,
        activeInterviewQuestions.length);
    }
  }

  function nav(name, label) {
    return (
      <button
        className={`nav-item ${page === name ? "active" : ""}`}
        onClick={() => setPage(name)}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">✦ InterviewPro</div>
        <p className="side-label">WORKSPACE</p>
        {nav("dashboard", "▦  Dashboard")}
        {nav("bank", "☷  Question Bank")}
        {nav("interview", "◉  Mock Interview")}
        {nav("results", "▤  My Results")}
        <div className="sidebar-bottom">
          <div className="avatar">S</div>
          <div><strong>Student</strong><small>Interview Candidate</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">YOUR CAREER STARTS HERE</span>
            <h1>Mock Interview Simulator</h1>
          </div>
          <span className="live"><span /> Practice Mode</span>
        </header>

        {page === "dashboard" && (
          <>
            <section className="welcome">
              <div>
                <span className="eyebrow">WELCOME BACK!</span>
                <h2>Ready to ace your next interview?</h2>
                <p>Practice questions, improve your confidence, and track your progress.</p>
                <button className="primary" onClick={startInterview}>
                  Start Mock Interview →
                </button>
              </div>
              <div className="welcome-icon">🎯</div>
            </section>

            <section className="stats">
              <div className="stat-card"><span>📚</span><p>Total Questions</p><h2>{questions.length}</h2></div>
              <div className="stat-card"><span>🎤</span><p>Practice Sessions</p><h2>{history.length}</h2></div>
              <div className="stat-card"><span>🏆</span><p>Quiz Attempts</p><h2>{history.filter(h => h.type === "Question Bank Quiz").length}</h2></div>
              <div className="stat-card"><span>📈</span><p>Average Score</p><h2>
                {history.length
                  ? Math.round(history.reduce((s, h) => s + (h.total ? h.score / h.total * 100 : 0), 0) / history.length)
                  : 0}%
              </h2></div>
            </section>

            <h2 className="section-title">Practice Modules</h2>
            <section className="module-grid">
              <div className="module-card">
                <div className="module-icon purple">🎙️</div>
                <h3>Mock Interview</h3>
                <p>Practice HR and technical interview questions with a timer.</p>
                <button className="secondary" onClick={startInterview}>Start Practice →</button>
              </div>
              <div className="module-card">
                <div className="module-icon blue">📖</div>
                <h3>Question Bank</h3>
                <p>Browse questions across programming, databases, and aptitude.</p>
                <button className="secondary" onClick={() => setPage("bank")}>Explore Questions →</button>
              </div>
              <div className="module-card">
                <div className="module-icon orange">⚡</div>
                <h3>Quick Quiz</h3>
                <p>Test your knowledge and check your score immediately.</p>
                <button className="secondary" onClick={startQuiz}>Start Quiz →</button>
              </div>
            </section>
          </>
        )}

        {page === "bank" && (
          <section className="panel">
            <h2>Question Bank</h2>
            <p className="muted">Search and filter questions by subject.</p>
            <input className="search" placeholder="Search questions..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <div className="filters">
              {subjects.map(s => <button key={s}
                className={subject === s ? "filter active-filter" : "filter"}
                onClick={() => setSubject(s)}>{s}</button>)}
            </div>
            <div className="question-list">
              {filtered.map((q, i) => (
                <article className="question-card" key={q.id}>
                  <span className="tag">{q.subject}</span>
                  <h3>{i + 1}. {q.question}</h3>
                  {q.options.map((o, j) => (
                    <p className="option-line" key={o}>
                      {String.fromCharCode(65 + j)}. {o}
                    </p>
                  ))}
                  <details><summary>Show answer and explanation</summary>
                    <p><strong>Correct answer:</strong> {q.options[q.answer]}</p>
                    <p>{q.explanation}</p>
                  </details>
                </article>
              ))}
              {filtered.length === 0 && <p>No questions found.</p>}
            </div>
            <button className="primary" onClick={startQuiz}>Take Quiz →</button>
          </section>
        )}

        {page === "quiz" && (
          <section className="panel quiz-panel">
            <span className="tag">QUESTION BANK QUIZ</span>
            <h2>{quizDone ? "Quiz Completed!" : `Question ${quizIndex + 1} of ${questions.length}`}</h2>
            {!quizDone ? (
              <>
                <div className="progress"><div style={{width: `${(quizIndex + 1) / questions.length * 100}%`}} /></div>
                <h3>{questions[quizIndex].question}</h3>
                {questions[quizIndex].options.map((o, i) => (
                  <button key={o} className={`answer-option ${selected[questions[quizIndex].id] === i ? "chosen" : ""}`}
                    onClick={() => setSelected(old => ({...old, [questions[quizIndex].id]: i}))}>
                    {String.fromCharCode(65 + i)}. {o}
                  </button>
                ))}
                <div className="quiz-actions">
                  <button className="secondary" disabled={quizIndex === 0}
                    onClick={() => setQuizIndex(i => i - 1)}>Previous</button>
                  {quizIndex < questions.length - 1
                    ? <button className="primary" onClick={() => setQuizIndex(i => i + 1)}>Next →</button>
                    : <button className="primary" onClick={finishQuiz}>Submit Quiz</button>}
                </div>
              </>
            ) : (
              <>
                <div className="result-circle">{Math.round(quizScore / questions.length * 100)}%</div>
                <h3>You scored {quizScore} out of {questions.length}</h3>
                {questions.map(q => (
                  <p key={q.id}>
                    {selected[q.id] === q.answer ? "✅" : "❌"} {q.question}
                    <br /><small>Correct answer: {q.options[q.answer]}</small>
                  </p>
                ))}
                <button className="primary" onClick={startQuiz}>Try Again</button>
              </>
            )}
          </section>
        )}

        {page === "interview" && (
          <section className="panel">
            <span className="tag">MOCK INTERVIEW</span>
            {!interview ? (
              <>
                <h2>Prepare for your interview</h2>
                <p className="muted">Answer each question within 60 seconds. You can type your answer and practice speaking aloud.</p>
                <label className="field-label">Choose interview type</label>
                <select className="search" value={interviewType}
                  onChange={e => setInterviewType(e.target.value)}>
                  <option value="All">Mixed Interview</option>
                  <option value="HR">HR Interview</option>
                  <option value="React">React Technical</option>
                  <option value="JavaScript">JavaScript Technical</option>
                  <option value="DBMS">DBMS Technical</option>
                </select>
                <button className="primary" onClick={() => {
                  setInterview(true);
                  setInterviewIndex(0);
                  setAnswers({});
                  setSeconds(60);
                  setInterviewDone(false);
                }}>Begin Interview →</button>
              </>
            ) : interviewDone ? (
              <>
                <h2>Interview Completed!</h2>
                <div className="result-circle">✓</div>
                <p>You visited {Math.min(interviewIndex + 1, activeInterviewQuestions.length)} of {activeInterviewQuestions.length} questions.</p>
                <p className="muted">Your answers are saved for this session only. Review them below.</p>
                {activeInterviewQuestions.map((q, i) => (
                  <article className="question-card" key={q.question}>
                    <span className="tag">{q.category}</span>
                    <h3>{q.question}</h3>
                    <p>{answers[i] || "No answer entered."}</p>
                    <p><strong>Practice tip:</strong> {q.hint}</p>
                  </article>
                ))}
                <button className="primary" onClick={() => {
                  setInterview(false);
                  setPage("results");
                }}>View Results</button>
              </>
            ) : currentInterview ? (
              <>
                <div className="interview-meta">
                  <span>Question {interviewIndex + 1} / {activeInterviewQuestions.length}</span>
                  <span className={seconds <= 10 ? "timer warning" : "timer"}>⏱ {seconds}s</span>
                </div>
                <div className="progress"><div style={{width: `${(interviewIndex + 1) / activeInterviewQuestions.length * 100}%`}} /></div>
                <span className="tag">{currentInterview.category}</span>
                <h2>{currentInterview.question}</h2>
                <p className="muted">Tip: {currentInterview.hint}</p>
                <textarea className="answer-box" rows="7"
                  placeholder="Type your answer here..."
                  value={answers[interviewIndex] || ""}
                  onChange={e => setAnswers(old => ({...old, [interviewIndex]: e.target.value}))} />
                <div className="quiz-actions">
                  <button className="secondary" onClick={() => {
                    setInterview(false);
                    setPage("dashboard");
                  }}>Exit</button>
                  <button className="primary" onClick={nextInterview}>
                    {interviewIndex === activeInterviewQuestions.length - 1 ? "Finish Interview" : "Next Question →"}
                  </button>
                </div>
              </>
            ) : null}
          </section>
        )}

        {page === "results" && (
          <section className="panel">
            <h2>My Results</h2>
            <p className="muted">Your practice session history on this device.</p>
            {history.length === 0 ? <p>No results yet. Complete a quiz or interview to see your results.</p> :
              history.map(h => (
                <article className="result-row" key={h.id}>
                  <div><strong>{h.type}</strong><p className="muted">{h.date}</p></div>
                  <strong>{h.score}/{h.total} ({h.total ? Math.round(h.score / h.total * 100) : 0}%)</strong>
                </article>
              ))}
            {history.length > 0 && <button className="secondary" onClick={() => {
              setHistory([]);
              localStorage.removeItem("mockHistory");
            }}>Clear History</button>}
          </section>
        )}

        <footer>InterviewPro · Mock Interview Simulator & Question Bank</footer>
      </main>
    </div>
  );
}
