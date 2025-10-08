const playerSectionRef = document.querySelector("#setup-section");
const quizContainerRef = document.querySelector(".quiz-container");
const usernameRef = document.querySelector("#username");
const difficultyButtonRef = Array.from(document.querySelectorAll(".btn-difficulty"));
const startButtonRef = document.querySelector(".start-button");
const loading = document.querySelector("loading"); /** to be added */
const questionSectionRef = document.querySelector("#question-section");
const questionNumberRef = document.querySelector("#question-number"); /** not yet used */
const scoreboardRef = document.querySelector("#scoreboard"); /** not yet used */
const scoreSection = document.querySelector("#score-section"); /** not yet in html or js */
const timerRef = document.querySelector("#timer"); /** not yet used */
const secondsRef = document.querySelector("#seconds"); /** not yet used */
const questionRef = document.querySelector("#question"); /** not yet used */
const answerButtonsRef = Array.from(document.querySelectorAll(".btn-a"));
const correctAnswersRef = document.querySelector("#correct-answers"); /** not yet used */
const incorrectAnswersRef = document.querySelector("#incorrect-answers"); /** not yet used */
const result = document.querySelector("#results"); /** not yet in html or js */
const finalResultRef = document.querySelector("#final-result"); /** not yet used */
const resultsSectionRef = document.querySelector("#results-section"); /** not yet used */
const newGameRef = document.querySelector("#new-game-button"); /** not yet used */
let selectedDifficulty = null;

/** Hide/Show sections */
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

/** Quiz setup section */
startButtonRef.addEventListener("click", (event) => {
  event.preventDefault();
  if (usernameRef.value !== ("") && selectedDifficulty !== null) getQuestions();
});

/** Fetching API data and error handling for API */
function getQuestions() {
  fetch(
    `https://opentdb.com/api.php?amount=10&category=17&difficulty=${selectedDifficulty}&type=multiple`
  )
   .then((response) => {
      if (!response.ok) {
        throw new Error("Questions could not be loaded at this time");
      }
      hideSection(playerSectionRef);
      hideSection(quizContainerRef);
      showSection(questionSectionRef);
      return response.json();
    })
    .then((apiData) => {
      const rearranged = rearrangeAnswers(apiData.results);
      let currentQuestionNumber = 0;

      /** Display question and randomised answers */
      function showQuestion(currentQuestion){
      document.getElementById ("question").innerText = currentQuestion.question;
      document.getElementById ("answer1").innerText = currentQuestion.answers[0];
      document.getElementById ("answer2").innerText = currentQuestion.answers[1];
      document.getElementById ("answer3").innerText = currentQuestion.answers[2];
      document.getElementById ("answer4").innerText = currentQuestion.answers[3];
      }

      showQuestion(rearranged[currentQuestionNumber])

      answerButtonsRef.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          let selectedAnswer = button.innerText;
          const correctAnswer = rearranged[0].correct_answer;
          const correctButton = answerButtonsRef.find(
                    (button) => button.innerText === correctAnswer
                );

/** Highlight correct/incorrect answers */
            if (selectedAnswer === correctAnswer) {
                button.style.backgroundColor = "green";
            } else {
                button.style.backgroundColor = "red";
                
                if (correctButton) correctButton.style.backgroundColor = "green";
            }

/** Increase Question Number by 1, display next question */
currentQuestionNumber++;
showQuestion(rearranged[currentQuestionNumber]);
                });
            });
        })
    
    .catch((error) => {
      errorHandling(error);
      console.error(error);
    });

function errorHandling(message) {
  alert(
    "Questions could not be loaded at this time, please try again later.",
    message
)};
};

