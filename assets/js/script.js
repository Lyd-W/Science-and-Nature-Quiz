const playerSection = document.querySelector("#setup-section");
const quizContainer = document.querySelector(".quiz-container");
const username = document.querySelector("#player-name");
const difficulty = document.querySelector("[data-difficulty]");
const difficultyButton = document.querySelector(".btn-difficulty");
const easyButton = document.querySelector("#easy-btn");
const mediumButton = document.querySelector("#medium-btn");
const hardButton = document.querySelector("#hard-btn");
const startButton = document.querySelector(".start-button");
const loading = document.querySelector("loading"); /** to be added */
const questionSection = document.querySelector("#question-section");
const questionNumber = document.querySelector("#question-number");
const scoreboard = document.querySelector("#scoreboard");
const scoreSection = document.querySelector("#score-section");
const timer = document.querySelector("#timer");
const seconds = document.querySelector("#seconds");
const question = document.querySelector("#question");
const answerButtons = document.querySelector("#answer-buttons");
const correctAnswers = document.querySelector("#correct-answers");
const incorrectAnswers = document.querySelector("#incorrect-answers");
const result = document.querySelector("#results");
const finalResult = document.querySelector("#final-result");
const resultsSection = document.querySelector("#results-section");
const newGame = document.querySelector("#new-game-button");

/** Hide/Show sections */
const hideSection = (section) => section.classList.add("hide");
const showSection = (section) => section.classList.remove("hide");

/** Set question difficulty */
difficultyButton
    .addEventListener("click", function() {
        let selectedDifficulty = difficulty.dataset;
        console.log(selectedDifficulty)
})

/** Fetching API data */
startButton
  .addEventListener("click", function () {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=17&difficulty=${selectedDifficulty}&type=multiple`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Questions could not be loaded at this time");
        }
        hideSection(playerSection);
        showSection(questionSection);
        return response.json();
      })
      .then((apiData) => {
    const rearranged = rearrangeAnswers(apiData.results);
    console.log("Rearranged answers:", rearranged);
  })

  .catch((error) => {
    errorHandling(error);
    console.error(error);
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

    console.log(results);
    return {
      difficulty: apiQuestion.difficulty,
      question: apiQuestion.question,
      answers: answers,
    };
  });
}

/** Error handling for API */
function errorHandling() {
  alert("Questions could not be loaded at this time, please try again later.");
}
