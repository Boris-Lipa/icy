"use client";

import { useEffect, useMemo, useState } from "react";

type View = "home" | "lesson" | "phrasebook";
type AnswerState = "idle" | "correct" | "wrong";

const lessonSteps = [
  "Your goal",
  "Three greetings",
  "A sound to notice",
  "Choose the phrase",
  "Build a sentence",
  "Mini conversation",
];

const phrases = [
  {
    latin: "Zdravo!",
    cyrillic: "Здраво!",
    english: "Hello!",
    note: "Friendly and useful at any time of day.",
  },
  {
    latin: "Dobar dan!",
    cyrillic: "Добар дан!",
    english: "Good day!",
    note: "A polite greeting from late morning to early evening.",
  },
  {
    latin: "Ćao!",
    cyrillic: "Ћао!",
    english: "Hi! / Bye!",
    note: "Casual. Use it with friends and people you know.",
  },
];

const phrasebook = [
  ["Zdravo!", "Здраво!", "Hello!"],
  ["Dobro jutro!", "Добро јутро!", "Good morning!"],
  ["Dobar dan!", "Добар дан!", "Good day!"],
  ["Dobro veče!", "Добро вече!", "Good evening!"],
  ["Kako si?", "Како си?", "How are you? (informal)"],
  ["Dobro sam, hvala.", "Добро сам, хвала.", "I’m well, thank you."],
  ["Zovem se…", "Зовем се…", "My name is…"],
  ["Drago mi je.", "Драго ми је.", "Nice to meet you."],
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "sr-RS";
  utterance.rate = 0.78;
  const voice = window.speechSynthesis
    .getVoices()
    .find((candidate) => candidate.lang.toLowerCase().startsWith("sr"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
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
    chat: "◌",
    chart: "↗",
    sound: "♪",
    check: "✓",
    lock: "•",
  };
  return <span className={`icon icon-${name}`} aria-hidden="true">{icons[name]}</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [step, setStep] = useState(0);
  const [showCyrillic, setShowCyrillic] = useState(true);
  const [answer, setAnswer] = useState<AnswerState>("idle");
  const [sentence, setSentence] = useState<string[]>([]);
  const [sentenceChecked, setSentenceChecked] = useState<AnswerState>("idle");
  const [dialogueAnswer, setDialogueAnswer] = useState<AnswerState>("idle");
  const [lessonComplete, setLessonComplete] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLessonComplete(window.localStorage.getItem("samo-polako-lesson-1") === "complete");
  }, []);

  const filteredPhrases = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return phrasebook;
    return phrasebook.filter((item) => item.some((value) => value.toLowerCase().includes(needle)));
  }, [query]);

  function beginLesson(startStep = 0) {
    setStep(startStep);
    setAnswer("idle");
    setSentence([]);
    setSentenceChecked("idle");
    setDialogueAnswer("idle");
    setView("lesson");
  }

  function completeLesson() {
    window.localStorage.setItem("samo-polako-lesson-1", "complete");
    setLessonComplete(true);
  }

  function goToStep(nextStep: number) {
    setStep(Math.max(0, Math.min(nextStep, lessonSteps.length - 1)));
    setAnswer("idle");
    setSentenceChecked("idle");
    setDialogueAnswer("idle");
  }

  function toggleSentenceWord(word: string) {
    setSentenceChecked("idle");
    setSentence((current) =>
      current.includes(word) ? current.filter((item) => item !== word) : [...current, word],
    );
  }

  const navItems: { id: View; label: string; icon: "home" | "book" | "chat" }[] = [
    { id: "home", label: "Home", icon: "home" },
    { id: "lesson", label: "Lessons", icon: "book" },
    { id: "phrasebook", label: "Phrasebook", icon: "chat" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("home")} aria-label="Samo polako home">
          <BrandMark />
          <span className="brand-copy">
            <strong>Samo polako</strong>
            <small>Serbian, step by step</small>
          </span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "nav-item active" : "nav-item"}
              onClick={() => (item.id === "lesson" ? beginLesson(lessonComplete ? 0 : step) : setView(item.id))}
            >
              <Icon name={item.icon} />
              {item.label}
              {item.id === "lesson" && <span className="nav-count">1</span>}
            </button>
          ))}
          <button className="nav-item" onClick={() => setView("home")}>
            <Icon name="chart" />
            Progress
          </button>
        </nav>

        <div className="sidebar-course">
          <div className="course-label">
            <span>Current course</span>
            <span>{lessonComplete ? "18" : "8"}%</span>
          </div>
          <strong>Serbian foundations</strong>
          <div className="mini-progress" aria-label={`${lessonComplete ? 18 : 8}% complete`}>
            <span style={{ width: lessonComplete ? "18%" : "8%" }} />
          </div>
          <small>A1 • Absolute beginner</small>
        </div>

        <div className="learner-card">
          <div className="avatar">E</div>
          <div>
            <strong>Ćao, learner!</strong>
            <small>Day 1 of your journey</small>
          </div>
          <span className="streak" title="Learning streak">1</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <button className="brand compact" onClick={() => setView("home")} aria-label="Samo polako home">
            <BrandMark />
            <strong>Samo polako</strong>
          </button>
          <span className="streak">1</span>
        </header>

        {view === "home" && (
          <div className="page home-page">
            <div className="page-heading home-heading">
              <div>
                <span className="eyebrow">DANAS • TODAY</span>
                <h1>Let’s get you speaking.</h1>
                <p>One useful conversation at a time—clear, practical, and never rushed.</p>
              </div>
              <div className="day-streak">
                <span>1</span>
                <div><strong>day streak</strong><small>A great start</small></div>
              </div>
            </div>

            <section className="continue-card">
              <div className="continue-art" aria-hidden="true">
                <div className="sun-shape" />
                <span className="speech-chip first">Zdravo!</span>
                <span className="speech-chip second">Hello!</span>
                <div className="art-letter">Ž</div>
              </div>
              <div className="continue-copy">
                <div className="lesson-meta"><span>UNIT 1</span><span>7 MIN</span></div>
                <h2>{lessonComplete ? "Ready for a quick review?" : "Your first Serbian conversation"}</h2>
                <p>Learn to greet someone, introduce yourself, and hear one of Serbian’s most important sounds.</p>
                <div className="progress-row">
                  <div className="progress-track"><span style={{ width: lessonComplete ? "100%" : "16%" }} /></div>
                  <small>{lessonComplete ? "Lesson complete" : "1 of 6 steps"}</small>
                </div>
                <button className="primary-button" onClick={() => beginLesson(lessonComplete ? 0 : step)}>
                  {lessonComplete ? "Review lesson" : "Continue lesson"}<span>→</span>
                </button>
              </div>
            </section>

            <section className="section-block">
              <div className="section-title">
                <div><span className="eyebrow">YOUR PATH</span><h2>From first words to real conversations</h2></div>
                <span className="path-duration">12 bite-sized lessons</span>
              </div>
              <div className="learning-path">
                <article className="path-card current" onClick={() => beginLesson(0)}>
                  <div className="path-top"><span className="unit-number">01</span><span className="status-pill">IN PROGRESS</span></div>
                  <div className="path-icon coral"><Icon name="chat" /></div>
                  <h3>First conversations</h3>
                  <p>Greetings, names, polite phrases, and the sounds that make Serbian feel readable.</p>
                  <div className="lesson-dots"><span className="done" /><span /><span /><span /></div>
                  <strong className="path-link">Open unit <span>→</span></strong>
                </article>
                <article className="path-card locked">
                  <div className="path-top"><span className="unit-number">02</span><span className="status-pill muted"><Icon name="lock" /> NEXT</span></div>
                  <div className="path-icon gold">A</div>
                  <h3>People & everyday life</h3>
                  <p>Talk about family, where you live, what you like, and the things around you.</p>
                  <div className="lesson-dots"><span /><span /><span /><span /></div>
                  <strong className="path-link muted-text">Complete Unit 1 to unlock</strong>
                </article>
                <article className="path-card locked">
                  <div className="path-top"><span className="unit-number">03</span><span className="status-pill muted"><Icon name="lock" /> LATER</span></div>
                  <div className="path-icon blue">?</div>
                  <h3>Build useful sentences</h3>
                  <p>Ask questions, use present-tense verbs, and get comfortable with word endings.</p>
                  <div className="lesson-dots"><span /><span /><span /><span /></div>
                  <strong className="path-link muted-text">Locked for now</strong>
                </article>
              </div>
            </section>

            <section className="daily-practice">
              <div>
                <span className="eyebrow">A LITTLE EXTRA</span>
                <h2>Train your Serbian ear</h2>
                <p>Five sound pairs English speakers often need a moment to hear.</p>
              </div>
              <div className="sound-pair"><span>Č</span><i>or</i><span>Ć</span></div>
              <button className="secondary-button" onClick={() => beginLesson(2)}>Try a sound sample <span>→</span></button>
            </section>
            <footer className="accuracy-note">Built around practical A1 skills • Serbian Latin first, Cyrillic always available</footer>
          </div>
        )}

        {view === "lesson" && (
          <div className="lesson-layout">
            <div className="lesson-topbar">
              <button className="text-button" onClick={() => setView("home")}><span>←</span> Exit lesson</button>
              <div className="lesson-progress" aria-label={`Step ${step + 1} of ${lessonSteps.length}`}>
                <div className="progress-track"><span style={{ width: `${((step + 1) / lessonSteps.length) * 100}%` }} /></div>
                <small>{step + 1} / {lessonSteps.length}</small>
              </div>
              <button className="script-toggle" onClick={() => setShowCyrillic((value) => !value)} aria-pressed={showCyrillic}>
                <span className={!showCyrillic ? "selected" : ""}>Latin</span>
                <span className={showCyrillic ? "selected" : ""}>Ћир.</span>
              </button>
            </div>

            <div className="lesson-stage">
              {step === 0 && (
                <section className="lesson-card intro-step">
                  <span className="lesson-kicker">LESSON 1 • MEET & GREET</span>
                  <div className="intro-symbol"><span>Z</span><span>З</span></div>
                  <h1>Your first Serbian conversation</h1>
                  <p className="lead">By the end of this seven-minute lesson, you’ll know exactly what to say when you meet someone.</p>
                  <div className="goal-list">
                    <div><span><Icon name="check" /></span><p><strong>Greet someone</strong><small>Casually or politely</small></p></div>
                    <div><span><Icon name="check" /></span><p><strong>Say your name</strong><small>With a natural Serbian phrase</small></p></div>
                    <div><span><Icon name="sound" /></span><p><strong>Hear the difference</strong><small>Between c and ć</small></p></div>
                  </div>
                  <div className="coach-note"><div className="mini-avatar">M</div><p><strong>A note from Milena</strong><span>Don’t aim for perfection. Listen, repeat, and keep moving—samo polako means “take it easy.”</span></p></div>
                  <button className="primary-button wide" onClick={() => goToStep(1)}>Start learning <span>→</span></button>
                </section>
              )}

              {step === 1 && (
                <section className="lesson-card phrase-step">
                  <span className="lesson-kicker">LISTEN & REPEAT</span>
                  <h1>Three ways to say hello</h1>
                  <p className="lead">Tap the sound button, then say each phrase aloud.</p>
                  <div className="phrase-list">
                    {phrases.map((phrase, index) => (
                      <article className="phrase-card" key={phrase.latin}>
                        <button className="sound-button" onClick={() => speak(phrase.latin)} aria-label={`Play ${phrase.latin}`}><Icon name="sound" /></button>
                        <div className="phrase-copy">
                          <div className="serbian-line"><strong>{phrase.latin}</strong>{showCyrillic && <span>{phrase.cyrillic}</span>}</div>
                          <span className="translation">{phrase.english}</span>
                          <p>{phrase.note}</p>
                        </div>
                        <span className="phrase-number">0{index + 1}</span>
                      </article>
                    ))}
                  </div>
                  <div className="culture-tip"><span>GOOD TO KNOW</span><p><strong>Ćao</strong> is borrowed from Italian <em>ciao</em>. In Serbian, it works for both “hi” and “bye.”</p></div>
                  <button className="primary-button wide" onClick={() => goToStep(2)}>Continue <span>→</span></button>
                </section>
              )}

              {step === 2 && (
                <section className="lesson-card sound-step">
                  <span className="lesson-kicker">PRONUNCIATION</span>
                  <h1>Meet the soft <em>ć</em> sound</h1>
                  <p className="lead">Serbian spelling is pleasantly consistent: once you know a letter’s sound, you can read unfamiliar words aloud.</p>
                  <div className="sound-focus">
                    <button className="giant-sound" onClick={() => speak("ćao")} aria-label="Play ćao"><span>Ć</span><small>tap to hear</small></button>
                    <div className="sound-explanation">
                      <span className="eyebrow">A GENTLE TIP</span>
                      <h2>Like “t” and “y” meeting</h2>
                      <p>Start with the <strong>t</strong> in “tune” as many British English speakers say it. Keep your tongue relaxed and make the sound light.</p>
                      <div className="mouth-cue"><span>t</span><i>+</i><span>y</span><i>≈</i><strong>ć</strong></div>
                    </div>
                  </div>
                  <div className="compare-sounds">
                    <button onClick={() => speak("cao")}><span>C</span><div><strong>cao</strong><small>“whole” • like <b>ts</b> in cats</small></div><Icon name="sound" /></button>
                    <button onClick={() => speak("ćao")}><span>Ć</span><div><strong>ćao</strong><small>“hi” • a soft <b>ty</b> sound</small></div><Icon name="sound" /></button>
                  </div>
                  <p className="fine-print">English comparisons are only approximations. Listening and imitation will get you closer than spelling tricks.</p>
                  <button className="primary-button wide" onClick={() => goToStep(3)}>Got it <span>→</span></button>
                </section>
              )}

              {step === 3 && (
                <section className="lesson-card question-step">
                  <span className="lesson-kicker">QUICK CHECK</span>
                  <div className="question-count">1 of 3</div>
                  <h1>It’s 2 p.m. You enter a bakery. What do you say?</h1>
                  <p className="lead">Choose the most natural polite greeting.</p>
                  <div className="answer-grid">
                    {["Ćao!", "Dobar dan!", "Laku noć!"].map((option, index) => {
                      const isCorrect = option === "Dobar dan!";
                      const selectedClass = answer !== "idle" && isCorrect ? "correct" : answer === "wrong" && index === 0 ? "wrong" : "";
                      return (
                        <button key={option} className={`answer-option ${selectedClass}`} onClick={() => setAnswer(isCorrect ? "correct" : "wrong")}>
                          <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                          <strong>{option}</strong>
                          {showCyrillic && <small>{["Ћао!", "Добар дан!", "Лаку ноћ!"][index]}</small>}
                          {answer !== "idle" && isCorrect && <Icon name="check" />}
                        </button>
                      );
                    })}
                  </div>
                  {answer !== "idle" && (
                    <div className={`feedback ${answer}`}>
                      <strong>{answer === "correct" ? "Odlično! Excellent." : "Almost—save Ćao for a casual hello."}</strong>
                      <p><em>Dobar dan</em> is the safe, polite choice during the day.</p>
                    </div>
                  )}
                  <button className="primary-button wide" disabled={answer !== "correct"} onClick={() => goToStep(4)}>Continue <span>→</span></button>
                </section>
              )}

              {step === 4 && (
                <section className="lesson-card sentence-step">
                  <span className="lesson-kicker">BUILD THE SENTENCE</span>
                  <div className="question-count">2 of 3</div>
                  <h1>How do you say “My name is Emma”?</h1>
                  <p className="lead">Tap the words in the right order.</p>
                  <div className={`sentence-dropzone ${sentenceChecked}`}>
                    {sentence.length === 0 && <span>Build your Serbian sentence here</span>}
                    {sentence.map((word) => <button key={word} onClick={() => toggleSentenceWord(word)}>{word}</button>)}
                  </div>
                  {showCyrillic && sentence.length > 0 && <div className="cyrillic-preview">{sentence.map((word) => ({ Zovem: "Зовем", se: "се", Emma: "Ема" })[word]).join(" ")}</div>}
                  <div className="word-bank">
                    {["Emma", "se", "Zovem"].map((word) => (
                      <button key={word} disabled={sentence.includes(word)} onClick={() => toggleSentenceWord(word)}>{word}</button>
                    ))}
                  </div>
                  <div className="grammar-note"><span>WHY THIS WORKS</span><p><strong>Zovem se</strong> literally means “I call myself.” Serbian often leaves out <em>ja</em> (“I”) because the verb ending already tells us who is speaking.</p></div>
                  {sentenceChecked !== "idle" && (
                    <div className={`feedback ${sentenceChecked}`}>
                      <strong>{sentenceChecked === "correct" ? "Tako je! That’s right." : "Not quite. Start with Zovem, then se."}</strong>
                    </div>
                  )}
                  <button
                    className="primary-button wide"
                    disabled={sentence.length !== 3}
                    onClick={() => {
                      if (sentence.join(" ") === "Zovem se Emma") {
                        if (sentenceChecked === "correct") goToStep(5);
                        else setSentenceChecked("correct");
                      } else setSentenceChecked("wrong");
                    }}
                  >
                    {sentenceChecked === "correct" ? "Continue" : "Check answer"}<span>→</span>
                  </button>
                </section>
              )}

              {step === 5 && !lessonComplete && (
                <section className="lesson-card dialogue-step">
                  <span className="lesson-kicker">PUT IT TOGETHER</span>
                  <div className="question-count">3 of 3</div>
                  <h1>Your first mini conversation</h1>
                  <p className="lead">Nikola has just introduced himself. Choose your reply.</p>
                  <div className="dialogue">
                    <div className="dialogue-avatar">N</div>
                    <div className="dialogue-bubble">
                      <button onClick={() => speak("Zdravo! Ja sam Nikola. Kako se zoveš?")} aria-label="Play dialogue"><Icon name="sound" /></button>
                      <strong>Zdravo! Ja sam Nikola.</strong>
                      <strong>Kako se zoveš?</strong>
                      {showCyrillic && <small>Здраво! Ја сам Никола. Како се зовеш?</small>}
                      <span>Hello! I’m Nikola. What’s your name?</span>
                    </div>
                  </div>
                  <div className="dialogue-options">
                    <button className={dialogueAnswer === "wrong" ? "wrong" : ""} onClick={() => setDialogueAnswer("wrong")}>Dobro veče. <small>Good evening.</small></button>
                    <button className={dialogueAnswer === "correct" ? "correct" : ""} onClick={() => setDialogueAnswer("correct")}><span>Zovem se Emma. Drago mi je.</span><small>My name is Emma. Nice to meet you.</small>{dialogueAnswer === "correct" && <Icon name="check" />}</button>
                    <button onClick={() => setDialogueAnswer("wrong")}>Hvala, dobro sam. <small>Thanks, I’m well.</small></button>
                  </div>
                  {dialogueAnswer !== "idle" && (
                    <div className={`feedback ${dialogueAnswer}`}>
                      <strong>{dialogueAnswer === "correct" ? "Savršeno! Perfect." : "That phrase doesn’t answer Nikola’s question."}</strong>
                      <p>{dialogueAnswer === "correct" ? "You’ve introduced yourself and added a natural “nice to meet you.”" : "He asked “What’s your name?” Look for Zovem se…"}</p>
                    </div>
                  )}
                  <button className="primary-button wide" disabled={dialogueAnswer !== "correct"} onClick={completeLesson}>Finish lesson <span>→</span></button>
                </section>
              )}

              {step === 5 && lessonComplete && (
                <section className="lesson-card completion-step">
                  <div className="completion-badge"><Icon name="check" /></div>
                  <span className="lesson-kicker">LEKCIJA ZAVRŠENA • LESSON COMPLETE</span>
                  <h1>Bravo—you can meet someone in Serbian.</h1>
                  <p className="lead">You learned three greetings, introduced yourself, and heard the soft ć sound.</p>
                  <div className="earned-row">
                    <div><span>+20</span><small>POINTS</small></div>
                    <div><span>6/6</span><small>STEPS</small></div>
                    <div><span>1</span><small>DAY STREAK</small></div>
                  </div>
                  <div className="you-can-say">
                    <span>YOU CAN NOW SAY</span>
                    <button onClick={() => speak("Zdravo! Zovem se Emma. Drago mi je.")}><Icon name="sound" /></button>
                    <strong>“Zdravo! Zovem se Emma. Drago mi je.”</strong>
                    {showCyrillic && <small>„Здраво! Зовем се Ема. Драго ми је.“</small>}
                  </div>
                  <button className="primary-button wide" onClick={() => setView("home")}>Back to your path <span>→</span></button>
                  <button className="text-button centered" onClick={() => { setLessonComplete(false); window.localStorage.removeItem("samo-polako-lesson-1"); goToStep(0); }}>Restart lesson</button>
                </section>
              )}

              {step > 0 && !(step === 5 && lessonComplete) && <button className="back-step" onClick={() => goToStep(step - 1)}>← Previous step</button>}
            </div>
          </div>
        )}

        {view === "phrasebook" && (
          <div className="page phrasebook-page">
            <div className="page-heading">
              <div><span className="eyebrow">QUICK REFERENCE</span><h1>Your phrasebook</h1><p>Useful Serbian you can reach for in real life.</p></div>
              <button className="script-toggle" onClick={() => setShowCyrillic((value) => !value)} aria-pressed={showCyrillic}><span className={!showCyrillic ? "selected" : ""}>Latin</span><span className={showCyrillic ? "selected" : ""}>Ћир.</span></button>
            </div>
            <div className="phrasebook-toolbar">
              <label><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search in English or Serbian…" /></label>
              <span>{filteredPhrases.length} saved phrases</span>
            </div>
            <section className="phrasebook-list">
              <header><span>SERBIAN</span><span>ENGLISH</span><span>LISTEN</span></header>
              {filteredPhrases.map(([latin, cyrillic, english]) => (
                <article key={latin}>
                  <div><strong>{latin}</strong>{showCyrillic && <small>{cyrillic}</small>}</div>
                  <p>{english}</p>
                  <button className="sound-button" onClick={() => speak(latin)} aria-label={`Play ${latin}`}><Icon name="sound" /></button>
                </article>
              ))}
              {filteredPhrases.length === 0 && <div className="empty-state">No phrases match that search yet.</div>}
            </section>
            <div className="prototype-note"><strong>This phrasebook grows with each lesson.</strong><span>Complete lessons to add words you’ve actually learned, instead of collecting phrases without context.</span></div>
          </div>
        )}

        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => item.id === "lesson" ? beginLesson(step) : setView(item.id)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
        </nav>
      </main>
    </div>
  );
}
