const playerSectionRef = document.querySelector("#setup-section");
const quizContainerRef = document.querySelector(".quiz-container");
const usernameRef = document.querySelector("#username");
const difficultyButtonRef = Array.from(document.querySelectorAll(".btn-difficulty"));
const startButtonRef = document.querySelector(".start-button");
const loaderRef = document.querySelector("#loader");
const questionSectionRef = document.querySelector("#question-section");
const scoreboardRef = document.querySelector("#scoreboard"); /** not yet used */
const scoreSection = document.querySelector("#score-section"); /** not yet in html or js */
const timerRef = document.querySelector("#timer"); /** not yet used */
const secondsRef = document.querySelector("#seconds"); /** not yet used */
const answerButtonsRef = Array.from(document.querySelectorAll(".btn-a"));
const result = document.querySelector("#results"); /** not yet in html or js */
const finalResultRef = document.querySelector("#final-result"); /** not yet used */
const resultsSectionRef = document.querySelector("#results-section");
const newGameRef = document.querySelector("#new-game-button"); /** not yet used */

let selectedDifficulty = null;
let rearranged = [];
let currentQuestionNumber = 0;
let questionNumberDisplay = 0;

/** Hide/show sections */
const hideSection = (section) => section.classList.add("hide");
const showSection = (section) => section.classList.remove("hide");

/** Set question difficulty */
difficultyButtonRef.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    difficultyButtonRef.forEach((button) => button.classList.remove("active"));
    button.classList.add("active");
    selectedDifficulty = event.target.dataset.difficulty;
  });
});

/** Rearrange answer order to random */
function rearrangeAnswers(results) {
  return results.map((apiQuestion) => {
    const answers = [
      ...apiQuestion.incorrect_answers,
      apiQuestion.correct_answer,
    ];
    answers.sort(() => Math.random() - 0.5);

    return {
      difficultyRef: apiQuestion.difficultyRef,
      question: apiQuestion.question,
      answers: answers,
      correct_answer: apiQuestion.correct_answer,
    };
  });
}

/** Fetch API data */
function getQuestions() {
  return fetch(
    `https://opentdb.com/api.php?amount=10&category=17&difficulty=${selectedDifficulty}&type=multiple`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Questions could not be loaded at this time");
    }
    return response.json();
  });
}

/** Loader */
function loader() {
    hideSection(playerSectionRef);
    hideSection(quizContainerRef);
    showSection(loaderRef);
}

/** Display Quiz Area */
function setQuizArea() {
    setTimeout(() => {
    hideSection(loaderRef);
    showSection(questionSectionRef);
    }, 100
)}

/** Display question and randomised answers */
function showQuestion(currentQuestion) {
  answerButtonsRef.forEach((button) => (button.style.backgroundColor = ""));
  document.getElementById("question-number").innerText =
    "Question " + ++questionNumberDisplay;
  document.getElementById("question").innerText = currentQuestion.question;
  document.getElementById("answer1").innerText = currentQuestion.answers[0];
  document.getElementById("answer2").innerText = currentQuestion.answers[1];
  document.getElementById("answer3").innerText = currentQuestion.answers[2];
  document.getElementById("answer4").innerText = currentQuestion.answers[3];
}

/** Handle clicking of answers */
/** Set selected and correct answer */
function answerClickHandling(event) {
    answerButtonsRef.forEach((button) => (button.disabled = true));
  let selectedAnswer = event.target.innerText;
  const correctAnswer = rearranged[currentQuestionNumber].correct_answer;
  const correctButton = answerButtonsRef.find(
    (button) => button.innerText === correctAnswer
  );

  /** Highlight correct/incorrect answers */
  if (selectedAnswer === correctAnswer) {
    event.target.style.backgroundColor = "green";
  } else {
    event.target.style.backgroundColor = "red";

    if (correctButton) correctButton.style.backgroundColor = "green";
  }

  /** Increase Question Number by 1, display next question after 1 second delay. End quiz after 10 questions*/
  setTimeout(() => {
    currentQuestionNumber++;
    if (currentQuestionNumber > 9) {
      endQuiz();
    } else {
        answerButtonsRef.forEach((button) => (button.disabled = false));
      showQuestion(rearranged[currentQuestionNumber]);
    }
  }, 1250);
}

/** Error Handling */
function errorHandling(message) {
  alert(
    "Questions could not be loaded at this time. Please try again later.",
    message
  );
}

/** Display Results Section */
function endQuiz() {
  hideSection(questionSectionRef);
  showSection(resultsSectionRef);
}

/** Flow to manage quiz section */
function startQuiz() {
  try {
    loader();
    getQuestions().then((apiData) => {
      rearranged = rearrangeAnswers(apiData.results);
    setQuizArea();
      showQuestion(rearranged[currentQuestionNumber]);
      answerButtonsRef.forEach((button) => {
        button.removeEventListener("click", answerClickHandling);
        button.addEventListener("click", answerClickHandling);
      });
    });
  } catch (error) {
    errorHandling(error.message);
  }
}

/** Run quiz when start button is clicked */
startButtonRef.addEventListener("click", (event) => {
  event.preventDefault();
  if (usernameRef.value !== "" && selectedDifficulty !== null) {
    startQuiz();
  }
});