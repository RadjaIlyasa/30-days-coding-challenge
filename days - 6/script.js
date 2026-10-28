const copy = {
    id: {
        eyebrow: "JEDA SEBENTAR, ASAH PIKIRAN",
        title: "Seberapa luas<br>rasa ingin tahumu",
        intro: "Lima belas pertanyaan ringan tentang dunia di sekitar kita. Santai saja—yang penting coba dulu.",
        edition: "Edisi pengetahuan umum<br>15 pertanyaan · pilihan ganda",
        ready: "SIAP-SIAP",
        welcomeLabel: "KUIS PENGETAHUAN UMUM",
        welcomeTitle: "Siap uji ingatan?",
        welcomeCopy: "Pilih jawaban yang paling tepat. Kamu akan langsung tahu apakah tebakanmu benar.",
        start: "Mulai kuis",
        smallNote: "15 soal <span>·</span> tanpa batas waktu",
        footnote: "Nggak ada tekanan. Nikmati saja prosesnya.",
        score: (value) => `${value} benar sejauh ini`,
        correct: "Betul! Jawabanmu tepat.",
        incorrect: (answer) => `Belum tepat. Jawabannya: ${answer}`,
        next: "Pertanyaan berikutnya",
        finish: "Lihat hasil",
        resultLabel: "SELESAI",
        resultTitle: "Kuis selesai!",
        resultCopy: (score, total) => {
            if (score === total) return "Luar biasa—semua jawabanmu tepat. Pengetahuanmu luas juga!";
            if (score >= total * 0.6) return "Hasil yang bagus. Kamu tahu lebih banyak dari yang kamu kira.";
            return "Awal yang bagus. Selalu ada hal baru untuk dipelajari—coba sekali lagi?";
        },
        restart: "Coba lagi",
        footer: "Sedikit tahu, banyak seru.",
        loadError: "Pertanyaan belum bisa dimuat. Coba buka halaman ini lewat server lokal, lalu muat ulang."
    },
    en: {
        eyebrow: "TAKE A BREATHER, GIVE YOUR BRAIN A WORKOUT",
        title: "How curious<br>are you",
        intro: "Fifteen easygoing questions about the world around us. No pressure—just give it a go.",
        edition: "General knowledge edition<br>15 questions · multiple choice",
        ready: "WHEN YOU'RE READY",
        welcomeLabel: "GENERAL KNOWLEDGE QUIZ",
        welcomeTitle: "Ready to test yourself?",
        welcomeCopy: "Pick the best answer. You'll find out right away if you got it right.",
        start: "Start the quiz",
        smallNote: "15 questions <span>·</span> no time limit",
        footnote: "No pressure. Just enjoy the process.",
        score: (value) => `${value} correct so far`,
        correct: "That's right! Nice one.",
        incorrect: (answer) => `Not quite. The answer is: ${answer}`,
        next: "Next question",
        finish: "See my score",
        resultLabel: "ALL DONE",
        resultTitle: "Quiz complete!",
        resultCopy: (score, total) => {
            if (score === total) return "Brilliant—you got every answer right. You really know your stuff!";
            if (score >= total * 0.6) return "Nice work. You know more than you might think.";
            return "A good start. There's always something new to learn—want another go?";
        },
        restart: "Play again",
        footer: "A little knowledge goes a long way.",
        loadError: "Questions couldn't be loaded. Open this page through a local server, then reload."
    }
};

const elements = {
    eyebrow: document.querySelector("#eyebrow"),
    title: document.querySelector("#page-title"),
    intro: document.querySelector("#intro-copy"),
    edition: document.querySelector("#edition-copy"),
    kicker: document.querySelector("#card-kicker"),
    index: document.querySelector("#card-index"),
    progressTrack: document.querySelector("#progress-track"),
    progress: document.querySelector("#progress-fill"),
    welcome: document.querySelector("#welcome-panel"),
    welcomeLabel: document.querySelector("#welcome-label"),
    welcomeTitle: document.querySelector("#welcome-title"),
    welcomeCopy: document.querySelector("#welcome-copy"),
    startLabel: document.querySelector("#start-label"),
    smallNote: document.querySelector("#small-note"),
    question: document.querySelector("#question-panel"),
    category: document.querySelector("#category-pill"),
    score: document.querySelector("#score-note"),
    questionTitle: document.querySelector("#question-title"),
    answers: document.querySelector("#answer-list"),
    feedback: document.querySelector("#answer-feedback"),
    next: document.querySelector("#next-button"),
    nextLabel: document.querySelector("#next-label"),
    result: document.querySelector("#result-panel"),
    resultLabel: document.querySelector("#result-label"),
    resultTitle: document.querySelector("#result-title"),
    finalScore: document.querySelector("#final-score"),
    scoreTotal: document.querySelector("#score-total"),
    resultCopy: document.querySelector("#result-copy"),
    restartLabel: document.querySelector("#restart-label"),
    footnote: document.querySelector("#footnote"),
    footer: document.querySelector("#footer-copy"),
    startButton: document.querySelector("#start-button"),
    restartButton: document.querySelector("#restart-button"),
    languageButtons: [...document.querySelectorAll(".language-button")]
};

let questions = null;
let language = "id";
let currentQuestion = 0;
let correctAnswers = 0;
let selectedAnswer = null;
let gameStarted = false;
let loadFailure = false;

function setLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language;

    for (const button of elements.languageButtons) {
        const active = button.dataset.language === language;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    }

    const text = copy[language];
    elements.eyebrow.textContent = text.eyebrow;
    elements.title.innerHTML = `${text.title}<span class="title-period">?</span>`;
    elements.intro.textContent = text.intro;
    elements.edition.innerHTML = text.edition;
    elements.kicker.textContent = !elements.result.hidden
        ? text.resultLabel
        : gameStarted
            ? (language === "id" ? "PERTANYAAN" : "QUESTION")
            : text.ready;
    elements.welcomeLabel.textContent = text.welcomeLabel;
    elements.welcomeTitle.textContent = text.welcomeTitle;
    elements.welcomeCopy.textContent = text.welcomeCopy;
    elements.startLabel.textContent = text.start;
    elements.smallNote.innerHTML = text.smallNote;
    elements.footnote.textContent = text.footnote;
    elements.nextLabel.textContent = text.next;
    elements.resultLabel.textContent = text.resultLabel;
    elements.resultTitle.textContent = text.resultTitle;
    elements.restartLabel.textContent = text.restart;
    elements.footer.textContent = text.footer;
    elements.scoreTotal.textContent = ` / ${questions ? questions[language].length : 15}`;
    if (!elements.result.hidden && questions) {
        elements.resultCopy.textContent = text.resultCopy(correctAnswers, questions[language].length);
    }
    if (loadFailure) {
        elements.welcomeTitle.textContent = language === "id" ? "Kuis belum tersedia" : "Quiz unavailable";
        elements.welcomeCopy.textContent = text.loadError;
    }
}

function updateProgress() {
    const total = questions[language].length;
    elements.index.innerHTML = `${String(Math.min(currentQuestion + 1, total)).padStart(2, "0")} <span>/ ${total}</span>`;
    elements.progress.style.width = `${(currentQuestion / total) * 100}%`;
    elements.progressTrack.setAttribute("aria-valuemax", String(total));
    elements.progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
}

function renderQuestion() {
    const question = questions[language][currentQuestion];
    const text = copy[language];

    elements.kicker.textContent = language === "id" ? "PERTANYAAN" : "QUESTION";
    elements.category.textContent = question.cat;
    elements.score.textContent = text.score(correctAnswers);
    elements.questionTitle.textContent = question.q;
    elements.answers.replaceChildren();
    elements.feedback.textContent = "";
    elements.feedback.className = "answer-feedback";
    elements.next.hidden = true;
    updateProgress();

    question.opts.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";
        button.dataset.answer = String(index);

        const letter = document.createElement("span");
        letter.className = "answer-letter";
        letter.setAttribute("aria-hidden", "true");
        letter.textContent = String.fromCharCode(65 + index);

        const label = document.createElement("span");
        label.textContent = option;
        button.append(letter, label);
        button.addEventListener("click", () => selectAnswer(index));
        elements.answers.append(button);
    });

    elements.welcome.hidden = true;
    elements.result.hidden = true;
    elements.question.hidden = false;
}

function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return;

    selectedAnswer = answerIndex;
    const question = questions[language][currentQuestion];
    const isCorrect = answerIndex === question.ans;
    const buttons = [...elements.answers.querySelectorAll(".answer-option")];

    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.ans) button.classList.add("is-correct");
        if (index === answerIndex && !isCorrect) button.classList.add("is-incorrect");
    });

    if (isCorrect) correctAnswers += 1;
    elements.score.textContent = copy[language].score(correctAnswers);
    elements.feedback.textContent = isCorrect
        ? copy[language].correct
        : copy[language].incorrect(question.opts[question.ans]);
    elements.feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");

    const isLastQuestion = currentQuestion === questions[language].length - 1;
    elements.nextLabel.textContent = isLastQuestion ? copy[language].finish : copy[language].next;
    elements.next.hidden = false;
}

function showResults() {
    const total = questions[language].length;
    elements.progress.style.width = "100%";
    elements.progressTrack.setAttribute("aria-valuenow", String(total));
    elements.index.innerHTML = `${String(total).padStart(2, "0")} <span>/ ${total}</span>`;
    elements.finalScore.textContent = String(correctAnswers);
    elements.scoreTotal.textContent = ` / ${total}`;
    elements.resultCopy.textContent = copy[language].resultCopy(correctAnswers, total);
    elements.question.hidden = true;
    elements.result.hidden = false;
    elements.kicker.textContent = copy[language].resultLabel;
    elements.languageButtons.forEach((button) => {
        button.disabled = false;
    });
}

function startGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    selectedAnswer = null;
    gameStarted = true;
    elements.languageButtons.forEach((button) => {
        button.disabled = true;
    });
    renderQuestion();
}

function finishGame() {
    currentQuestion += 1;
    selectedAnswer = null;

    if (currentQuestion >= questions[language].length) {
        showResults();
        return;
    }

    renderQuestion();
}

async function loadQuestions() {
    try {
        const response = await fetch("./question.json");
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        for (const key of ["id", "en"]) {
            const validQuestions = Array.isArray(data[key]) && data[key].length > 0
                && data[key].every((item) => (
                    typeof item.cat === "string"
                    && typeof item.q === "string"
                    && Array.isArray(item.opts)
                    && item.opts.length > 1
                    && item.opts.every((option) => typeof option === "string")
                    && Number.isInteger(item.ans)
                    && item.ans >= 0
                    && item.ans < item.opts.length
                ));

            if (!validQuestions) {
                throw new Error(`Invalid question data for language "${key}"`);
            }
        }

        questions = data;
        elements.startButton.disabled = false;
        elements.startButton.addEventListener("click", startGame);
        elements.restartButton.addEventListener("click", startGame);
        elements.next.addEventListener("click", finishGame);
        setLanguage(language);
    } catch (error) {
        console.error("Unable to load quiz questions:", error);
        loadFailure = true;
        setLanguage(language);
        elements.startButton.disabled = true;
    }
}

elements.languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.language !== language && !button.disabled) {
            setLanguage(button.dataset.language);
        }
    });
});

elements.startButton.disabled = true;
setLanguage(language);
loadQuestions();
