"use client";

import { useEffect, useMemo, useState } from "react";
import { foundationLessons, nextCourseStage, type FoundationLesson } from "../src/course/foundations";
import { playSerbianAudio } from "../src/audio/playSerbianAudio";

type View = "home" | "lessons" | "lesson" | "phrasebook";
type AnswerState = "idle" | "correct" | "wrong";

const learnerNameKey = "samo-polako-learner-name";
const completedLessonsKey = "samo-polako-completed-lessons";
const startedLessonKey = "samo-polako-started-lesson";
const lessonStepKey = "samo-polako-lesson-step";
const legacyLessonCompleteKey = "samo-polako-lesson-1";

const firstLesson: FoundationLesson = {
  id: "lesson-1",
  unit: 1,
  duration: "7 MIN",
  title: "Your first Serbian conversation",
  pathTitle: "First conversations",
  description: "Greetings, names, polite phrases, and the sounds that make Serbian feel readable.",
  icon: "Ć",
  color: "coral",
  goals: [
    { title: "Greet someone", detail: "Casually or politely" },
    { title: "Say your name", detail: "With a natural Serbian phrase" },
    { title: "Hear an important sound", detail: "Tell c and ć apart" },
  ],
  teacherNote:
    "Don’t aim for perfection. Listen, repeat, and keep moving — samo polako means “take it easy.”",
  phrases: [
    { serbian: "Zdravo!", english: "Hello!", note: "Friendly and useful at any time of day." },
    { serbian: "Dobar dan!", english: "Good day!", note: "A polite greeting from late morning to early evening." },
    { serbian: "Ćao!", english: "Hi! / Bye!", note: "Casual. Use it with friends and people you know." },
  ],
  grammar: {
    title: "WHY THIS WORKS",
    focus: "Zovem se",
    explanation:
      "literally means “I call myself.” Serbian often leaves out ja (“I”) because the verb ending already tells us who is speaking.",
    practiceNote:
      "Repeat it with a real name. The aim is to make the two-word introduction feel familiar before you start changing the name at the end.",
  },
  check: {
    prompt: "It’s 2 p.m. You enter a bakery. What do you say?",
    lead: "Choose the most natural polite greeting.",
    options: ["Ćao!", "Dobar dan!", "Laku noć!"],
    answer: "Dobar dan!",
    explanation: "Dobar dan is the safe, polite choice during the day.",
    wrongFeedback: "Think about the time of day and choose the polite daytime greeting.",
  },
  builder: {
    prompt: "How do you say “My name is Emma”?",
    words: ["Emma.", "se", "Zovem"],
    answer: "Zovem se Emma.",
    hint: "Your name is the final piece. Use the two Serbian words you have just practised to introduce it.",
  },
  dialogue: {
    speaker: "Nikola",
    avatar: "N",
    line: "Zdravo, ja sam Nikola. Kako se ti zoveš?",
    translation: "Hello, I’m Nikola. What’s your name?",
    options: [
      { serbian: "Dobro veče.", english: "Good evening." },
      { serbian: "Zovem se Emma. Drago mi je.", english: "My name is Emma. Nice to meet you." },
      { serbian: "Hvala, dobro sam.", english: "Thanks, I’m well." },
    ],
    answer: "Zovem se Emma. Drago mi je.",
    feedback: "Perfect. You introduced yourself and added a natural “nice to meet you.”",
  },
  recap: "Zdravo! Zovem se Emma. Drago mi je.",
  pronunciation: {
    character: "Ć",
    word: "Ćao!",
    title: "Meet the soft ć sound",
    description:
      "Serbian spelling is pleasantly consistent: once you know a letter’s sound, you can read unfamiliar words aloud.",
    comparison:
      "It is close to the light “ty” sound many English speakers use in “tune.” English comparisons are only approximations, so let the recording be your guide.",
  },
};

const courseLessons = [firstLesson, ...foundationLessons];

function speak(text: string) {
  playSerbianAudio(text);
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span>Š</span>
    </div>
  );
}

function Icon({ name }: { name: "home" | "book" | "chat" | "chart" | "sound" | "check" | "lock" }) {
  const icons = {
    home: "⌂",
    book: "▤",
    chat: "○",
    chart: "↗",
    sound: "♪",
    check: "✓",
    lock: "•",
  };
  return <span className={`icon icon-${name}`} aria-hidden="true">{icons[name]}</span>;
}

function readCompletedLessons() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(completedLessonsKey) ?? "[]");
    if (Array.isArray(saved) && saved.every((value) => typeof value === "string")) return saved;
  } catch {
    // A malformed local value should not prevent the course from opening.
  }
  return [] as string[];
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [activeLessonId, setActiveLessonId] = useState(firstLesson.id);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<AnswerState>("idle");
  const [sentence, setSentence] = useState<string[]>([]);
  const [sentenceChecked, setSentenceChecked] = useState<AnswerState>("idle");
  const [dialogueAnswer, setDialogueAnswer] = useState<AnswerState>("idle");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [startedLessonId, setStartedLessonId] = useState<string | null>(null);
  const [learnerName, setLearnerName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const savedName = window.localStorage.getItem(learnerNameKey)?.trim() ?? "";
    const completed = readCompletedLessons();
    const legacyComplete = window.localStorage.getItem(legacyLessonCompleteKey) === "complete";
    const migratedCompleted = legacyComplete && !completed.includes(firstLesson.id) ? [firstLesson.id, ...completed] : completed;
    const savedLesson = window.localStorage.getItem(startedLessonKey);
    const savedStep = Number(window.localStorage.getItem(lessonStepKey));

    setLearnerName(savedName);
    setNameDraft(savedName);
    setNamePromptOpen(!savedName);
    setCompletedLessonIds(migratedCompleted);
    setStartedLessonId(courseLessons.some((lesson) => lesson.id === savedLesson) ? savedLesson : null);
    if (courseLessons.some((lesson) => lesson.id === savedLesson)) setActiveLessonId(savedLesson as string);
    if (Number.isInteger(savedStep)) setStep(Math.max(0, Math.min(savedStep, 5)));

    if (migratedCompleted !== completed) {
      window.localStorage.setItem(completedLessonsKey, JSON.stringify(migratedCompleted));
    }
  }, []);

  const activeLesson = courseLessons.find((lesson) => lesson.id === activeLessonId) ?? firstLesson;
  const activeLessonComplete = completedLessonIds.includes(activeLesson.id);
  const completedCount = courseLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const courseProgress = Math.round((completedCount / courseLessons.length) * 100);
  const lastCompletedLesson = [...courseLessons].reverse().find((lesson) => completedLessonIds.includes(lesson.id));
  const startedLesson = courseLessons.find((lesson) => lesson.id === startedLessonId);
  const homeLesson = startedLesson && !completedLessonIds.includes(startedLesson.id)
    ? startedLesson
    : lastCompletedLesson ?? firstLesson;

  const filteredPhrases = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const phrases = courseLessons.flatMap((lesson) => lesson.phrases.map((phrase) => ({ ...phrase, unit: lesson.unit })));
    if (!needle) return phrases;
    return phrases.filter((phrase) => `${phrase.serbian} ${phrase.english}`.toLowerCase().includes(needle));
  }, [query]);

  function resetStepState() {
    setAnswer("idle");
    setSentence([]);
    setSentenceChecked("idle");
    setDialogueAnswer("idle");
  }

  function canOpenLesson(lesson: FoundationLesson) {
    const index = courseLessons.findIndex((candidate) => candidate.id === lesson.id);
    return index === 0 || completedLessonIds.includes(courseLessons[index - 1].id);
  }

  function beginLesson(lesson: FoundationLesson, startStep = 0) {
    if (!canOpenLesson(lesson)) return;
    const safeStep = Math.max(0, Math.min(startStep, 5));
    window.localStorage.setItem(startedLessonKey, lesson.id);
    window.localStorage.setItem(lessonStepKey, String(safeStep));
    setStartedLessonId(lesson.id);
    setActiveLessonId(lesson.id);
    setStep(safeStep);
    resetStepState();
    setView("lesson");
  }

  function goToStep(nextStep: number) {
    const safeStep = Math.max(0, Math.min(nextStep, 5));
    window.localStorage.setItem(lessonStepKey, String(safeStep));
    setStep(safeStep);
    resetStepState();
  }

  function completeLesson() {
    const nextCompleted = completedLessonIds.includes(activeLesson.id)
      ? completedLessonIds
      : [...completedLessonIds, activeLesson.id];
    window.localStorage.setItem(completedLessonsKey, JSON.stringify(nextCompleted));
    if (activeLesson.id === firstLesson.id) window.localStorage.setItem(legacyLessonCompleteKey, "complete");
    setCompletedLessonIds(nextCompleted);
    setStartedLessonId(activeLesson.id);
  }

  function restartLesson() {
    const nextCompleted = completedLessonIds.filter((lessonId) => lessonId !== activeLesson.id);
    window.localStorage.setItem(completedLessonsKey, JSON.stringify(nextCompleted));
    if (activeLesson.id === firstLesson.id) window.localStorage.removeItem(legacyLessonCompleteKey);
    setCompletedLessonIds(nextCompleted);
    beginLesson(activeLesson, 0);
  }

  function toggleSentenceWord(word: string) {
    setSentenceChecked("idle");
    setSentence((current) => (current.includes(word) ? current.filter((item) => item !== word) : [...current, word]));
  }

  function saveLearnerName() {
    const cleanName = nameDraft.trim();
    if (!cleanName) return;
    window.localStorage.setItem(learnerNameKey, cleanName);
    setLearnerName(cleanName);
    setNameDraft(cleanName);
    setNamePromptOpen(false);
  }

  const displayName = learnerName || "there";
  const avatarLetter = learnerName.charAt(0).toUpperCase() || "S";
  const homeLessonStarted = startedLessonId === homeLesson.id;
  const homeLessonComplete = completedLessonIds.includes(homeLesson.id);
  const homeLessonProgress = homeLessonComplete ? 100 : homeLessonStarted ? ((step + 1) / 6) * 100 : 0;
  const homeLessonAction = homeLessonComplete ? "Review lesson" : homeLessonStarted ? "Continue lesson" : "Start lesson";

  const navItems: { id: "home" | "lessons" | "phrasebook"; label: string; icon: "home" | "book" | "chat" }[] = [
    { id: "home", label: "Home", icon: "home" },
    { id: "lessons", label: "Lessons", icon: "book" },
    { id: "phrasebook", label: "Phrasebook", icon: "chat" },
  ];

  function handleNavigation(item: "home" | "lessons" | "phrasebook") {
    setView(item);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("home")} aria-label="Samo polako home">
          <BrandMark />
          <span className="brand-copy"><strong>Samo polako</strong><small>Serbian, step by step</small></span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id || (item.id === "lessons" && view === "lesson") ? "nav-item active" : "nav-item"} onClick={() => handleNavigation(item.id)}>
              <Icon name={item.icon} />
              {item.label}
              {item.id === "lessons" && <span className="nav-count">{courseLessons.length}</span>}
            </button>
          ))}
          <button className="nav-item" onClick={() => setView("home")}><Icon name="chart" />Progress</button>
        </nav>

        <div className="sidebar-course">
          <div className="course-label"><span>Current course</span><span>{courseProgress}%</span></div>
          <strong>Serbian foundations</strong>
          <div className="mini-progress" aria-label={`${courseProgress}% complete`}><span style={{ width: `${courseProgress}%` }} /></div>
          <small>A1 • Absolute beginner</small>
        </div>

        <button className="learner-card" onClick={() => setNamePromptOpen(true)} aria-label="Change learner name">
          <div className="avatar">{avatarLetter}</div>
          <div><strong>Ćao, {displayName}!</strong><small>Day 1 of your journey</small></div>
          <span className="streak" title="Learning streak">1</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <button className="brand compact" onClick={() => setView("home")} aria-label="Samo polako home"><BrandMark /><strong>Samo polako</strong></button>
          <span className="streak">1</span>
        </header>

        {view === "home" && (
          <div className="page home-page">
            <div className="page-heading home-heading">
              <div><span className="eyebrow">DANAS • TODAY</span><h1>Let’s get you speaking.</h1><p>One useful conversation at a time — clear, practical, and never rushed.</p></div>
              <div className="day-streak"><span>1</span><div><strong>day streak</strong><small>A great start</small></div></div>
            </div>

            <section className="continue-card">
              <div className="continue-art" aria-hidden="true"><div className="sun-shape" /><span className="speech-chip first">Zdravo!</span><span className="speech-chip second">Hello!</span><div className="art-letter">Ž</div></div>
              <div className="continue-copy">
                <div className="lesson-meta"><span>UNIT {homeLesson.unit}</span><span>{homeLesson.duration}</span></div>
                <h2>{homeLessonComplete ? `Ready to review: ${homeLesson.pathTitle}` : homeLesson.title}</h2>
                <p>{homeLesson.description}</p>
                <div className="progress-row"><div className="progress-track"><span style={{ width: `${homeLessonProgress}%` }} /></div><small>{homeLessonComplete ? "Lesson complete" : homeLessonStarted ? `${step + 1} of 6 steps` : "Not started"}</small></div>
                <button className="primary-button" onClick={() => beginLesson(homeLesson, homeLessonStarted ? step : 0)}>{homeLessonAction}<span>→</span></button>
              </div>
            </section>

            <section className="course-roadmap current-stage" aria-labelledby="current-stage-title">
              <div><span className="eyebrow">CURRENT STAGE</span><h2 id="current-stage-title">Serbian foundations</h2><p>Six connected units build the language needed for a calm first conversation: who you are, what you need, the people around you, and practical personal details.</p></div>
              <div className="roadmap-list">
                {courseLessons.map((lesson) => <div key={lesson.id}><span>{String(lesson.unit).padStart(2, "0")}</span><p><strong>{lesson.pathTitle}</strong><small>{lesson.description}</small></p></div>)}
              </div>
            </section>

            <section className="course-roadmap" aria-labelledby="next-stage-title">
              <div><span className="eyebrow">NEXT STAGE</span><h2 id="next-stage-title">Where this foundation leads</h2><p>These are deliberately planned next, so the course keeps building on what has been practised instead of jumping between random topics.</p></div>
              <div className="roadmap-list">
                {nextCourseStage.map((lesson) => <div key={lesson.unit}><span>{String(lesson.unit).padStart(2, "0")}</span><p><strong>{lesson.title}</strong><small>{lesson.description}</small></p></div>)}
              </div>
            </section>

            <section className="daily-practice">
              <div><span className="eyebrow">A LITTLE EXTRA</span><h2>Train your Serbian ear</h2><p>Two letters English speakers often need a moment to hear.</p></div>
              <div className="sound-pair"><span>Č</span><i>or</i><span>Ć</span></div>
              <button className="secondary-button" onClick={() => beginLesson(firstLesson, 2)}>Try a sound sample <span>→</span></button>
            </section>
            <footer className="accuracy-note">Practical A1 skills • Serbian Latin alphabet throughout</footer>
          </div>
        )}

        {view === "lessons" && (
          <div className="page lessons-page">
            <div className="page-heading">
              <div><span className="eyebrow">YOUR PATH</span><h1>From first words to real conversations</h1><p>Complete each unit in order. Every lesson prepares the language you need for the next one.</p></div>
              <span className="path-duration">6 foundation lessons</span>
            </div>
            <div className="learning-path">
              {courseLessons.map((lesson) => {
                const complete = completedLessonIds.includes(lesson.id);
                const started = startedLessonId === lesson.id;
                const unlocked = canOpenLesson(lesson);
                const status = complete ? "COMPLETE" : started ? "IN PROGRESS" : unlocked ? "READY" : "NEXT";
                return (
                  <article key={lesson.id} className={`path-card ${unlocked ? "current" : "locked"}`} onClick={() => unlocked && beginLesson(lesson, started ? step : 0)}>
                    <div className="path-top"><span className="unit-number">{String(lesson.unit).padStart(2, "0")}</span><span className={unlocked ? "status-pill" : "status-pill muted"}>{!unlocked && <Icon name="lock" />}{status}</span></div>
                    <div className={`path-icon ${lesson.color}`}>{lesson.icon}</div>
                    <h3>{lesson.pathTitle}</h3>
                    <p>{lesson.description}</p>
                    <div className="lesson-dots"><span className={complete || started ? "done" : ""} /><span className={complete ? "done" : ""} /><span className={complete ? "done" : ""} /><span className={complete ? "done" : ""} /></div>
                    <strong className={unlocked ? "path-link" : "path-link muted-text"}>{complete ? "Review unit" : started ? "Continue unit" : unlocked ? "Start unit" : "Complete the previous unit"}<span>{unlocked && "→"}</span></strong>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {view === "lesson" && (
          <div className="lesson-layout">
            <div className="lesson-topbar">
              <button className="text-button" onClick={() => setView("home")}><span>←</span> Exit lesson</button>
              <div className="lesson-progress" aria-label={`Step ${step + 1} of 6`}><div className="progress-track"><span style={{ width: `${((step + 1) / 6) * 100}%` }} /></div><small>{step + 1} / 6</small></div>
              <span className="alphabet-label">Serbian Latin</span>
            </div>

            <div className="lesson-stage">
              {step === 0 && (
                <section className="lesson-card intro-step">
                  <span className="lesson-kicker">LESSON {activeLesson.unit} • {activeLesson.pathTitle.toUpperCase()}</span>
                  <div className="intro-symbol"><span>{activeLesson.icon.slice(0, 1)}</span><span>{activeLesson.unit}</span></div>
                  <h1>{activeLesson.title}</h1>
                  <p className="lead">By the end of this {activeLesson.duration.toLowerCase()} lesson, you will be able to use these phrases in a small, real exchange.</p>
                  <div className="goal-list">
                    {activeLesson.goals.map((goal, index) => <div key={goal.title}><span><Icon name={index === 2 ? "sound" : "check"} /></span><p><strong>{goal.title}</strong><small>{goal.detail}</small></p></div>)}
                  </div>
                  <div className="coach-note"><div className="mini-avatar">T</div><p><strong>A note from the teacher</strong><span>{activeLesson.teacherNote}</span></p></div>
                  <button className="primary-button wide" onClick={() => goToStep(1)}>Start learning <span>→</span></button>
                </section>
              )}

              {step === 1 && (
                <section className="lesson-card phrase-step">
                  <span className="lesson-kicker">LISTEN & REPEAT</span>
                  <h1>Useful phrases first</h1>
                  <p className="lead">Tap each sound button, listen once, then repeat without trying to sound perfect.</p>
                  <div className="phrase-list">
                    {activeLesson.phrases.map((phrase, index) => (
                      <article className="phrase-card" key={phrase.serbian}>
                        <button className="sound-button" onClick={() => speak(phrase.serbian)} aria-label={`Play ${phrase.serbian}`}><Icon name="sound" /></button>
                        <div className="phrase-copy"><div className="serbian-line"><strong>{phrase.serbian}</strong></div><span className="translation">{phrase.english}</span><p>{phrase.note}</p></div>
                        <span className="phrase-number">{String(index + 1).padStart(2, "0")}</span>
                      </article>
                    ))}
                  </div>
                  <button className="primary-button wide" onClick={() => goToStep(2)}>Continue <span>→</span></button>
                </section>
              )}

              {step === 2 && activeLesson.pronunciation && (
                <section className="lesson-card sound-step">
                  <span className="lesson-kicker">PRONUNCIATION</span>
                  <h1>{activeLesson.pronunciation.title}</h1>
                  <p className="lead">{activeLesson.pronunciation.description}</p>
                  <div className="sound-focus">
                    <button className="giant-sound" onClick={() => speak(activeLesson.pronunciation?.word ?? "Ćao!")} aria-label={`Play ${activeLesson.pronunciation.word}`}><span>{activeLesson.pronunciation.character}</span><small>tap to hear</small></button>
                    <div className="sound-explanation"><span className="eyebrow">A GENTLE TIP</span><h2>Keep it light</h2><p>{activeLesson.pronunciation.comparison}</p><div className="mouth-cue"><span>t</span><i>+</i><span>y</span><i>≈</i><strong>ć</strong></div></div>
                  </div>
                  <div className="compare-sounds">
                    <button onClick={() => speak("cena")}><span>C</span><div><strong>cena</strong><small>“price” • like <b>ts</b> in cats</small></div><Icon name="sound" /></button>
                    <button onClick={() => speak("Ćao!")}><span>Ć</span><div><strong>Ćao</strong><small>“hi” • a soft <b>ty</b> sound</small></div><Icon name="sound" /></button>
                  </div>
                  <button className="primary-button wide" onClick={() => goToStep(3)}>Got it <span>→</span></button>
                </section>
              )}

              {step === 2 && !activeLesson.pronunciation && (
                <section className="lesson-card grammar-step">
                  <span className="lesson-kicker">MAKE THE PATTERN YOURS</span>
                  <h1>{activeLesson.grammar.title}</h1>
                  <p className="lead">A small explanation now makes the phrases easier to reuse later.</p>
                  <div className="grammar-pattern"><strong>{activeLesson.grammar.focus}</strong><span>{activeLesson.grammar.explanation}</span></div>
                  {activeLesson.numberReference && <div className="number-grid" aria-label="Serbian numbers zero to ten">{activeLesson.numberReference.map((item) => <div key={item.number}><strong>{item.number}</strong><span>{item.word}</span></div>)}</div>}
                  <div className="grammar-note"><span>PRACTISE IT</span><p>{activeLesson.grammar.practiceNote}</p></div>
                  <button className="primary-button wide" onClick={() => goToStep(3)}>Continue <span>→</span></button>
                </section>
              )}

              {step === 3 && (
                <section className="lesson-card question-step">
                  <span className="lesson-kicker">QUICK CHECK</span><div className="question-count">1 of 3</div>
                  <h1>{activeLesson.check.prompt}</h1><p className="lead">{activeLesson.check.lead}</p>
                  <div className="answer-grid">
                    {activeLesson.check.options.map((option, index) => {
                      const isCorrect = option === activeLesson.check.answer;
                      const selectedClass = answer !== "idle" && isCorrect ? "correct" : answer === "wrong" && !isCorrect ? "wrong" : "";
                      return <button key={option} className={`answer-option ${selectedClass}`} onClick={() => setAnswer(isCorrect ? "correct" : "wrong")}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><strong>{option}</strong>{answer !== "idle" && isCorrect && <Icon name="check" />}</button>;
                    })}
                  </div>
                  {answer !== "idle" && <div className={`feedback ${answer}`}><strong>{answer === "correct" ? "Odlično! Excellent." : "Almost — take another look at the phrase."}</strong><p>{answer === "correct" ? activeLesson.check.explanation : activeLesson.check.wrongFeedback}</p></div>}
                  <button className="primary-button wide" disabled={answer !== "correct"} onClick={() => goToStep(4)}>Continue <span>→</span></button>
                </section>
              )}

              {step === 4 && (
                <section className="lesson-card sentence-step">
                  <span className="lesson-kicker">BUILD THE SENTENCE</span><div className="question-count">2 of 3</div>
                  <h1>{activeLesson.builder.prompt}</h1><p className="lead">Tap the words in the order you would say them.</p>
                  <div className={`sentence-dropzone ${sentenceChecked}`}>{sentence.length === 0 && <span>Build your Serbian sentence here</span>}{sentence.map((word) => <button key={word} onClick={() => toggleSentenceWord(word)}>{word}</button>)}</div>
                  <div className="word-bank">{activeLesson.builder.words.map((word) => <button key={word} disabled={sentence.includes(word)} onClick={() => toggleSentenceWord(word)}>{word}</button>)}</div>
                  <div className="grammar-note"><span>A GENTLE HINT</span><p>{activeLesson.builder.hint}</p></div>
                  {sentenceChecked !== "idle" && <div className={`feedback ${sentenceChecked}`}><strong>{sentenceChecked === "correct" ? "Tako je! That’s right." : "Not quite — rearrange the words and try again."}</strong></div>}
                  {activeLesson.pronunciation && sentenceChecked === "correct" && <div className="grammar-note"><span>WHY THIS WORKS</span><p><strong>{activeLesson.grammar.focus}</strong> {activeLesson.grammar.explanation}</p></div>}
                  <button className="primary-button wide" disabled={sentence.length !== activeLesson.builder.words.length} onClick={() => { if (sentence.join(" ") === activeLesson.builder.answer) { if (sentenceChecked === "correct") goToStep(5); else setSentenceChecked("correct"); } else setSentenceChecked("wrong"); }}>{sentenceChecked === "correct" ? "Continue" : "Check answer"}<span>→</span></button>
                </section>
              )}

              {step === 5 && !activeLessonComplete && (
                <section className="lesson-card dialogue-step">
                  <span className="lesson-kicker">PUT IT TOGETHER</span><div className="question-count">3 of 3</div>
                  <h1>Use it in a short conversation</h1><p className="lead">{activeLesson.dialogue.speaker} says the line below. Choose the response that fits.</p>
                  <div className="dialogue"><div className="dialogue-avatar">{activeLesson.dialogue.avatar}</div><div className="dialogue-bubble"><button onClick={() => speak(activeLesson.dialogue.line)} aria-label="Play dialogue"><Icon name="sound" /></button><strong>{activeLesson.dialogue.line}</strong><span>{activeLesson.dialogue.translation}</span></div></div>
                  <div className="dialogue-options">
                    {activeLesson.dialogue.options.map((option) => { const correct = option.serbian === activeLesson.dialogue.answer; const state = dialogueAnswer !== "idle" && correct ? "correct" : dialogueAnswer === "wrong" && !correct ? "wrong" : ""; return <button key={option.serbian} className={state} onClick={() => setDialogueAnswer(correct ? "correct" : "wrong")}><span>{option.serbian}</span><small>{option.english}</small>{dialogueAnswer !== "idle" && correct && <Icon name="check" />}</button>; })}
                  </div>
                  {dialogueAnswer !== "idle" && <div className={`feedback ${dialogueAnswer}`}><strong>{dialogueAnswer === "correct" ? "Savršeno! Perfect." : "That phrase does not answer the question yet."}</strong><p>{dialogueAnswer === "correct" ? activeLesson.dialogue.feedback : "Listen to the prompt once more, then choose a reply that directly fits it."}</p></div>}
                  <button className="primary-button wide" disabled={dialogueAnswer !== "correct"} onClick={completeLesson}>Finish lesson <span>→</span></button>
                </section>
              )}

              {step === 5 && activeLessonComplete && (
                <section className="lesson-card completion-step">
                  <div className="completion-badge"><Icon name="check" /></div><span className="lesson-kicker">LEKCIJA ZAVRŠENA • LESSON COMPLETE</span>
                  <h1>Bravo — you completed Unit {activeLesson.unit}.</h1><p className="lead">You can now use a small but practical piece of Serbian in a real conversation.</p>
                  <div className="earned-row"><div><span>+20</span><small>POINTS</small></div><div><span>6/6</span><small>STEPS</small></div><div><span>{completedCount}</span><small>UNITS</small></div></div>
                  <div className="you-can-say"><span>YOU CAN NOW SAY</span><button onClick={() => speak(activeLesson.recap)} aria-label={`Play ${activeLesson.recap}`}><Icon name="sound" /></button><strong>“{activeLesson.recap}”</strong></div>
                  <button className="primary-button wide" onClick={() => setView("home")}>Back to your path <span>→</span></button><button className="text-button centered" onClick={restartLesson}>Restart lesson</button>
                </section>
              )}

              {step > 0 && !(step === 5 && activeLessonComplete) && <button className="back-step" onClick={() => goToStep(step - 1)}>← Previous step</button>}
            </div>
          </div>
        )}

        {view === "phrasebook" && (
          <div className="page phrasebook-page">
            <div className="page-heading"><div><span className="eyebrow">QUICK REFERENCE</span><h1>Your phrasebook</h1><p>Useful Serbian in the same order it appears in the course.</p></div><span className="alphabet-label">Serbian Latin</span></div>
            <div className="phrasebook-toolbar"><label><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search in English or Serbian…" /></label><span>{filteredPhrases.length} phrases</span></div>
            <section className="phrasebook-list"><header><span>SERBIAN</span><span>ENGLISH</span><span>LISTEN</span></header>
              {filteredPhrases.map((phrase) => <article key={`${phrase.unit}-${phrase.serbian}`}><div><strong>{phrase.serbian}</strong><small>Unit {phrase.unit}</small></div><p>{phrase.english}</p><button className="sound-button" onClick={() => speak(phrase.serbian)} aria-label={`Play ${phrase.serbian}`}><Icon name="sound" /></button></article>)}
              {filteredPhrases.length === 0 && <div className="empty-state">No phrases match that search yet.</div>}
            </section>
            <div className="prototype-note"><strong>This phrasebook grows with the course.</strong><span>Every phrase here is taught in context first, so it is easier to remember when to use it.</span></div>
          </div>
        )}

        <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map((item) => <button key={item.id} className={view === item.id || (item.id === "lessons" && view === "lesson") ? "active" : ""} onClick={() => handleNavigation(item.id)}><Icon name={item.icon} /><span>{item.label}</span></button>)}</nav>
      </main>

      {namePromptOpen && <div className="welcome-overlay"><section className="welcome-dialog" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><BrandMark /><span className="eyebrow">DOBRO DOŠLA • WELCOME</span><h2 id="welcome-title">What should your Serbian course call you?</h2><p>Enter your first name or a nickname. It stays only in this browser and can be changed later.</p><form onSubmit={(event) => { event.preventDefault(); saveLearnerName(); }}><label htmlFor="learner-name">Your name</label><input id="learner-name" autoFocus maxLength={30} value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} placeholder="e.g. Emma" autoComplete="given-name" /><button className="primary-button" type="submit" disabled={!nameDraft.trim()}>Start learning <span>→</span></button></form></section></div>}
    </div>
  );
}
