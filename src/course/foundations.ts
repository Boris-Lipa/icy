export type LessonPhrase = {
  serbian: string;
  english: string;
  note: string;
};

export type FoundationLesson = {
  id: string;
  unit: number;
  duration: string;
  title: string;
  pathTitle: string;
  description: string;
  icon: string;
  color: "gold" | "blue" | "coral" | "green";
  goals: Array<{ title: string; detail: string }>;
  teacherNote: string;
  phrases: LessonPhrase[];
  grammar: {
    title: string;
    focus: string;
    explanation: string;
  };
  check: {
    prompt: string;
    lead: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  builder: {
    prompt: string;
    words: string[];
    answer: string;
    explanation: string;
  };
  dialogue: {
    speaker: string;
    avatar: string;
    line: string;
    translation: string;
    options: Array<{ serbian: string; english: string }>;
    answer: string;
    feedback: string;
  };
  recap: string;
  numberReference?: Array<{ number: string; word: string }>;
  pronunciation?: {
    character: string;
    word: string;
    title: string;
    description: string;
    comparison: string;
  };
};

export const foundationLessons: FoundationLesson[] = [
  {
    id: "lesson-2",
    unit: 2,
    duration: "9 MIN",
    title: "Tell someone who you are",
    pathTitle: "Where you are from",
    description: "Ask and answer where someone is from, then keep a first conversation moving.",
    icon: "Ja",
    color: "gold",
    goals: [
      { title: "Ask where someone is from", detail: "Use a friendly everyday question" },
      { title: "Say where you are from", detail: "Answer with ja sam iz..." },
      { title: "Keep the exchange going", detail: "Add A ti? — and you?" },
    ],
    teacherNote:
      "Do not try to memorise every country ending today. Learn ja sam iz + your country as one useful spoken chunk, then notice the pattern as you meet more places.",
    phrases: [
      { serbian: "Odakle si?", english: "Where are you from?", note: "Informal: use it with one person you would call ti." },
      { serbian: "Ja sam iz Engleske.", english: "I am from England.", note: "Swap Engleske for your own country." },
      { serbian: "Ja sam iz Srbije.", english: "I am from Serbia.", note: "A natural short answer to Odakle si?" },
      { serbian: "A ti?", english: "And you?", note: "A tiny phrase that politely returns the question." },
    ],
    grammar: {
      title: "THE USEFUL PATTERN",
      focus: "Ja sam",
      explanation:
        "means “I am.” Serbian often leaves ja out because sam already tells the listener who is speaking, but keeping it at the start makes this early pattern especially clear.",
    },
    check: {
      prompt: "Nikola asks: Odakle si? What does he want to know?",
      lead: "Choose the meaning before you answer in Serbian.",
      options: ["Where are you from?", "What is your name?", "How old are you?"],
      answer: "Where are you from?",
      explanation: "Odakle asks about origin: where someone comes from.",
    },
    builder: {
      prompt: "Build: “I am from England.”",
      words: ["Engleske.", "iz", "sam", "Ja"],
      answer: "Ja sam iz Engleske.",
      explanation: "Put the speaker first, then sam, then the useful chunk iz + place.",
    },
    dialogue: {
      speaker: "Nikola",
      avatar: "N",
      line: "Odakle si?",
      translation: "Where are you from?",
      options: [
        { serbian: "Ja sam iz Engleske. A ti?", english: "I am from England. And you?" },
        { serbian: "Zovem se Emma.", english: "My name is Emma." },
        { serbian: "Hvala, dobro sam.", english: "Thanks, I am well." },
      ],
      answer: "Ja sam iz Engleske. A ti?",
      feedback: "Exactly. You answered the question and invited Nikola to answer too.",
    },
    recap: "Ja sam iz Engleske. A ti?",
  },
  {
    id: "lesson-3",
    unit: 3,
    duration: "10 MIN",
    title: "Be polite and ask for help",
    pathTitle: "Polite essentials",
    description: "Thank someone, say please, and recover gracefully when you do not understand.",
    icon: "♥",
    color: "blue",
    goals: [
      { title: "Use polite basics", detail: "Say hvala and molim naturally" },
      { title: "Say you do not understand", detail: "Keep a conversation from stopping" },
      { title: "Ask for slower speech", detail: "A useful real-life rescue phrase" },
    ],
    teacherNote:
      "A beginner does not need to understand every word. A calm Ne razumem followed by Sporije, molim is far more useful than pretending you followed the conversation.",
    phrases: [
      { serbian: "Hvala.", english: "Thank you.", note: "The everyday way to thank someone." },
      { serbian: "Molim.", english: "Please. / Here you are.", note: "Context gives this short word its polite job." },
      { serbian: "Ne razumem.", english: "I do not understand.", note: "Useful when a sentence goes by too quickly." },
      { serbian: "Sporije, molim.", english: "More slowly, please.", note: "Use this after Ne razumem when someone is speaking fast." },
    ],
    grammar: {
      title: "THE USEFUL PATTERN",
      focus: "Ne razumem",
      explanation:
        "puts ne directly before the verb razumem (“I understand”). This is the core pattern for a simple Serbian negative: ne + verb.",
    },
    check: {
      prompt: "A friend explains something in Serbian and you miss it. What is the most useful first reply?",
      lead: "Choose the phrase that honestly keeps the conversation open.",
      options: ["Ne razumem.", "Dobar dan!", "Ja sam iz Srbije."],
      answer: "Ne razumem.",
      explanation: "Ne razumem tells the other person what happened without ending the exchange.",
    },
    builder: {
      prompt: "Build: “More slowly, please.”",
      words: ["molim.", "Sporije,"],
      answer: "Sporije, molim.",
      explanation: "Put the request first, then soften it with molim.",
    },
    dialogue: {
      speaker: "Nikola",
      avatar: "N",
      line: "Kako se ti zoveš?",
      translation: "What is your name?",
      options: [
        { serbian: "Ne razumem. Sporije, molim.", english: "I do not understand. More slowly, please." },
        { serbian: "Dobro veče.", english: "Good evening." },
        { serbian: "Ovo je knjiga.", english: "This is a book." },
      ],
      answer: "Ne razumem. Sporije, molim.",
      feedback: "Perfect. You have asked for help politely and clearly.",
    },
    recap: "Ne razumem. Sporije, molim.",
  },
  {
    id: "lesson-4",
    unit: 4,
    duration: "11 MIN",
    title: "Name the things around you",
    pathTitle: "Things around you",
    description: "Point to everyday objects and take your first gentle look at Serbian noun gender.",
    icon: "O",
    color: "coral",
    goals: [
      { title: "Point and name objects", detail: "Use ovo je — this is" },
      { title: "Recognise three noun groups", detail: "Masculine, feminine, and neuter" },
      { title: "Use one correctly", detail: "Match jedan, jedna, or jedno" },
    ],
    teacherNote:
      "Treat the gender as part of a noun’s identity, like learning a word together with its meaning. You only need to notice the pattern today; accuracy will grow through repetition.",
    phrases: [
      { serbian: "Ovo je knjiga.", english: "This is a book.", note: "Knjiga is feminine." },
      { serbian: "Ovo je sto.", english: "This is a table.", note: "Sto is masculine." },
      { serbian: "Ovo je pitanje.", english: "This is a question.", note: "Pitanje is neuter." },
      { serbian: "Jedan sto, jedna knjiga, jedno pitanje.", english: "One table, one book, one question.", note: "The word for one changes to match the noun." },
    ],
    grammar: {
      title: "A FIRST LOOK AT GENDER",
      focus: "jedan / jedna / jedno",
      explanation:
        "all mean “one.” Serbian nouns belong to a grammatical gender, so nearby words often change to agree. The ending -a is often feminine, but learn each noun with its own form.",
    },
    check: {
      prompt: "Which phrase means “one book”?",
      lead: "Listen for the feminine word paired with knjiga.",
      options: ["Jedan knjiga", "Jedna knjiga", "Jedno knjiga"],
      answer: "Jedna knjiga",
      explanation: "Knjiga is feminine, so it takes jedna.",
    },
    builder: {
      prompt: "Build: “This is a book.”",
      words: ["knjiga.", "je", "Ovo"],
      answer: "Ovo je knjiga.",
      explanation: "Ovo je is a handy fixed frame: point, then name the thing.",
    },
    dialogue: {
      speaker: "Nikola",
      avatar: "N",
      line: "Šta je to?",
      translation: "What is that?",
      options: [
        { serbian: "Ovo je knjiga.", english: "This is a book." },
        { serbian: "Imam dvadeset pet godina.", english: "I am twenty-five years old." },
        { serbian: "Hvala, dobro sam.", english: "Thanks, I am well." },
      ],
      answer: "Ovo je knjiga.",
      feedback: "That is the right frame: ovo je + the object you are pointing to.",
    },
    recap: "Ovo je jedna knjiga.",
  },
  {
    id: "lesson-5",
    unit: 5,
    duration: "11 MIN",
    title: "Talk about your family",
    pathTitle: "People close to you",
    description: "Introduce family members and notice how “my” changes with the person you mean.",
    icon: "M",
    color: "green",
    goals: [
      { title: "Introduce family members", detail: "Use ovo je moj / moja..." },
      { title: "Say what family you have", detail: "Use imam — I have" },
      { title: "Notice possessive forms", detail: "Match moj and moja to the noun" },
    ],
    teacherNote:
      "You will hear word endings change often in Serbian. That is normal, not a trap. For now, practise a few complete phrases aloud so the natural combinations start to feel familiar.",
    phrases: [
      { serbian: "Ovo je moja porodica.", english: "This is my family.", note: "Porodica is family." },
      { serbian: "Ovo je moj brat.", english: "This is my brother.", note: "Moj goes with brat." },
      { serbian: "Ovo je moja sestra.", english: "This is my sister.", note: "Moja goes with sestra." },
      { serbian: "Imam brata.", english: "I have a brother.", note: "Learn the whole phrase as a useful family statement." },
    ],
    grammar: {
      title: "THE USEFUL PATTERN",
      focus: "moj / moja",
      explanation:
        "both mean “my.” Moj pairs with brat, while moja pairs with sestra. Serbian asks possessive words to agree with the noun, so keep the pair together as you learn it.",
    },
    check: {
      prompt: "Which sentence says “This is my sister”?",
      lead: "Choose the phrase with sestra and the matching form of “my.”",
      options: ["Ovo je moj sestra.", "Ovo je moja sestra.", "Ovo je moja brat."],
      answer: "Ovo je moja sestra.",
      explanation: "Sestra is feminine, so the matching form is moja.",
    },
    builder: {
      prompt: "Build: “I have a brother.”",
      words: ["brata.", "Imam"],
      answer: "Imam brata.",
      explanation: "Imam is the everyday form for “I have.” Keep brata with it as a complete family phrase.",
    },
    dialogue: {
      speaker: "Emma",
      avatar: "E",
      line: "Imaš li brata?",
      translation: "Do you have a brother?",
      options: [
        { serbian: "Da, imam brata.", english: "Yes, I have a brother." },
        { serbian: "Ovo je pitanje.", english: "This is a question." },
        { serbian: "Sporije, molim.", english: "More slowly, please." },
      ],
      answer: "Da, imam brata.",
      feedback: "Exactly. Da begins the yes answer, then you use the complete family phrase.",
    },
    recap: "Ovo je moja porodica.",
  },
  {
    id: "lesson-6",
    unit: 6,
    duration: "12 MIN",
    title: "Use numbers in real life",
    pathTitle: "Numbers and age",
    description: "Recognise the first ten numbers, say your age, and practise a practical question-and-answer.",
    icon: "6",
    color: "gold",
    goals: [
      { title: "Recognise 0–10", detail: "Build a base for prices, times, and phone numbers" },
      { title: "Ask someone’s age", detail: "Use koliko imaš godina?" },
      { title: "Say your age", detail: "Use imam ... godina as one pattern" },
    ],
    teacherNote:
      "Numbers are worth revisiting in small bursts. Say each one aloud, then try reading a clock, a bus number, or a price when you see it. Recognition comes before speed.",
    phrases: [
      { serbian: "Koliko imaš godina?", english: "How old are you?", note: "Use this informal question with someone you call ti." },
      { serbian: "Imam dvadeset pet godina.", english: "I am twenty-five years old.", note: "Serbian literally says “I have twenty-five years.”" },
      { serbian: "Moj broj je...", english: "My number is...", note: "A useful start for giving a phone number." },
      { serbian: "Nula, jedan, dva, tri, četiri, pet.", english: "Zero, one, two, three, four, five.", note: "Practise slowly, then use the number guide below." },
    ],
    grammar: {
      title: "THE USEFUL PATTERN",
      focus: "Imam ... godina",
      explanation:
        "literally means “I have ... years.” English uses “I am” for age; Serbian uses imam, the same verb you met in imam brata (“I have a brother”).",
    },
    check: {
      prompt: "How would you answer: Koliko imaš godina?",
      lead: "Choose the sentence that gives an age.",
      options: ["Imam dvadeset pet godina.", "Ja sam iz Engleske.", "Ovo je moja sestra."],
      answer: "Imam dvadeset pet godina.",
      explanation: "For age in Serbian, use imam + number + godina.",
    },
    builder: {
      prompt: "Build: “I am twenty-five years old.”",
      words: ["godina.", "pet", "dvadeset", "Imam"],
      answer: "Imam dvadeset pet godina.",
      explanation: "Start with imam, then say the number before godina.",
    },
    dialogue: {
      speaker: "Nikola",
      avatar: "N",
      line: "Koliko imaš godina?",
      translation: "How old are you?",
      options: [
        { serbian: "Imam dvadeset pet godina.", english: "I am twenty-five years old." },
        { serbian: "Ovo je moja porodica.", english: "This is my family." },
        { serbian: "Dobar dan!", english: "Good day!" },
      ],
      answer: "Imam dvadeset pet godina.",
      feedback: "Exactly. This age pattern is different from English, so it is useful to learn it as one complete sentence.",
    },
    recap: "Imam dvadeset pet godina.",
    numberReference: [
      { number: "0", word: "nula" },
      { number: "1", word: "jedan" },
      { number: "2", word: "dva" },
      { number: "3", word: "tri" },
      { number: "4", word: "četiri" },
      { number: "5", word: "pet" },
      { number: "6", word: "šest" },
      { number: "7", word: "sedam" },
      { number: "8", word: "osam" },
      { number: "9", word: "devet" },
      { number: "10", word: "deset" },
    ],
  },
];

export const nextCourseStage = [
  { unit: 7, title: "Daily life", description: "Present-tense verbs for living, working, studying, and liking." },
  { unit: 8, title: "Time and routines", description: "Days, times, and simple plans for your day." },
  { unit: 9, title: "Food and ordering", description: "Useful café and restaurant language, taught as practical chunks." },
  { unit: 10, title: "Places and directions", description: "Find places, ask where something is, and follow simple directions." },
  { unit: 11, title: "Likes and invitations", description: "Talk about preferences and make low-pressure social plans." },
  { unit: 12, title: "Conversation lab", description: "Combine introductions, everyday needs, and small talk in guided scenarios." },
];
