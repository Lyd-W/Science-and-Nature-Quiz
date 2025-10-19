const playerSectionRef = document.querySelector("#setup-section");
const quizContainerRef = document.querySelector(".quiz-container");
const usernameRef = document.querySelector("#username");
const difficultyButtonRef = Array.from(document.querySelectorAll(".btn-difficulty"));
const startButtonRef = document.querySelector(".start-button");
const loaderRef = document.querySelector("#loader");
const questionSectionRef = document.querySelector("#question-section");
const questionRef = document.querySelector ("#question");
const questionNumberRef = document.querySelector ("#question-number");
const answerButtonsRef = Array.from(document.querySelectorAll(".btn-a"));
const correctAnswersRef = document.querySelector ("#correct-answers")
const incorrectAnswersRef = document.querySelector("#incorrect-answers")
const secondsRef = document.querySelector("#seconds");
const resultsSectionRef = document.querySelector("#results-section");
const finalScoreRef = document.querySelector("#final-score");
const newGameRef = document.querySelector("#new-game-button");

let selectedDifficulty = null;
let rearranged = [];
let currentQuestionNumber = 0;
let questionNumberDisplay = 0;
let correctScore = 0;
let incorrectScore = 0;
let timer;
let timeRemaining = 30;

/** 
 * Hides/shows sections 
 */
const hideSection = (section) => section.classList.add("hide");
const showSection = (section) => section.classList.remove("hide");

/** 
 * Sets question difficulty 
 */
difficultyButtonRef.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    difficultyButtonRef.forEach((button) => button.classList.remove("active"));
    button.classList.add("active");
    selectedDifficulty = event.target.dataset.difficulty;
  });
});

/** 
 * Randomises answer order
 */
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

/** 
 * Fetches data from OpenTDB 
 * @returns questions from API
 */
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

/**
 * Shows a loading animation
*/
function loader() {
  hideSection(playerSectionRef);
  hideSection(quizContainerRef);
  showSection(loaderRef);
}

/** 
 * Displays quiz area 
 */
function setQuizArea() {
  setTimeout(() => {
    hideSection(loaderRef);
    showSection(questionSectionRef);
  }, 100);
}

/** 
 * Displays question with randomised answers 
 */
function showQuestion(currentQuestion) {
  clearInterval(timer)
  resetListeners();
  timeRemaining = 30;
  secondsRef.innerText = timeRemaining;
  questionNumberRef.innerText = `Question ${++questionNumberDisplay}`;
  questionRef.innerText = currentQuestion.question;
  answerButtonsRef.forEach((button, index) => {button.style.backgroundColor = "";
  button.innerText = currentQuestion.answers[index];
  });
  startTimer();
}

/**
 * Starts a countdown timer and updates remaining time
 */
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
    secondsRef.innerText = timeRemaining;
    timeRemaining--;
    if (timeRemaining < 0){
        clearInterval(timer);
        noAnswer();
      }
    }, 1000)
}
    
/** Handles clicking of answers */
/** 
 * Identifies selected and correct answer
 */
function answerClickHandling(event) {
  clearInterval(timer);
  answerButtonsRef.forEach((button) => (button.disabled = true));
  let selectedAnswer = event.target.innerText;
  const correctAnswer = rearranged[currentQuestionNumber].correct_answer;
  const correctButton = answerButtonsRef.find(
  (button) => button.innerText === correctAnswer
  );

  /** 
   * Green highlight for correct answers
   * Red highlight for incorrect answers
   */
  if (selectedAnswer === correctAnswer) {
    event.target.style.backgroundColor = "green";
    correctScore ++;
    correctAnswersRef.innerText = correctScore;
  } else {
    event.target.style.backgroundColor = "red";
    incorrectScore ++;
    incorrectAnswersRef.innerText = incorrectScore;
    correctButton.style.backgroundColor = "green"; 
  }
setTimeout(nextQuestion, 1250);
}

/**
 * Handles no answer selected
 */
function noAnswer() {
  clearInterval(timer);
  answerButtonsRef.forEach((button) => (button.disabled = true));
  const correctAnswer = rearranged[currentQuestionNumber].correct_answer;
  const correctButton = answerButtonsRef.find(
  (button) => button.innerText === correctAnswer
  );
  correctButton.style.backgroundColor = "green"; 
  incorrectScore ++;
  incorrectAnswersRef.innerText = incorrectScore;
  setTimeout(nextQuestion, 1250);
}

/** 
   * Increases question number by 1 
   * Displays next question after a 1.25 second delay 
   * Ends the quiz after question 10
   */
function nextQuestion() {
    currentQuestionNumber++;
    if (currentQuestionNumber > 9) {
      endQuiz();
    } else {
      answerButtonsRef.forEach((button) => (button.disabled = false));
      showQuestion(rearranged[currentQuestionNumber]);
    }
}

/**
 * Resets event listeners
 */
function resetListeners() {
answerButtonsRef.forEach((button) => {
        button.removeEventListener("click", answerClickHandling);
        button.addEventListener("click", answerClickHandling);
});
}

/** 
 * Error handling message
 */
function errorHandling(message) {
  alert(
    "Questions could not be loaded at this time. Please try again later.",
    message
  );
}

/** 
 * Displays the final results section 
 */
function endQuiz() {
  hideSection(questionSectionRef);
  showSection(resultsSectionRef);
  finalScoreRef.innerText = correctScore;
}

/** 
 * Starts new game process 
 */
function startNewGame() {
        hideSection(resultsSectionRef);
        showSection(playerSectionRef);
        showSection(quizContainerRef);
        usernameRef.value = "";

        difficultyButtonRef.forEach((button) => button.classList.remove("active"));

        answerButtonsRef.forEach((button) => {
            button.disabled = false;
            button.style.backgroundColor = "";
            button.innerText = "";
        })

        currentQuestionNumber = 0;
        correctScore = 0;
        incorrectScore = 0;
        selectedDifficulty = null;
        rearranged = [];
        questionNumberDisplay = 0;
        timeRemaining = 30;

        correctAnswersRef.innerText = 0;
        incorrectAnswersRef.innerText = 0;
        questionNumberRef.innerText = "";
        questionRef.innerText = "";
        secondsRef.innerText = "";
        clearInterval(timer);

}

newGameRef.addEventListener("click", (event) => {
    startNewGame();
})

/** 
 * Orders quiz functions 
 */
function startQuiz() {
  try {
    loader();
    getQuestions().then((apiData) => {
      rearranged = rearrangeAnswers(apiData.results);
      setQuizArea();
      showQuestion(rearranged[currentQuestionNumber]);
      });
    }
   catch (error) {
    errorHandling(error.message);
  }
}

/** 
 * Runs quiz when start button is clicked 
 */
startButtonRef.addEventListener("click", (event) => {
  event.preventDefault();
  if (usernameRef.value !== "" && selectedDifficulty !== null) {
    startQuiz();
  }
});