const playerSectionRef = document.querySelector("#setup-section");
const quizContainerRef = document.querySelector(".quiz-container"); /** not yet used */
const usernameRef = document.querySelector("#player-name"); /** not yet used */
const difficultyRef = document.querySelector("[data-difficulty]");
const difficultyButtonRef = document.querySelectorAll(".btn-difficulty");
const easyButtonRef = document.querySelector("#easy-btn"); /** not yet used */
const mediumButtonRef = document.querySelector("#medium-btn"); /** not yet used */
const hardButtonRef = document.querySelector("#hard-btn"); /** not yet used */
const startButtonRef = document.querySelector(".start-button");
const loading = document.querySelector("loading"); /** to be added */
const questionSectionRef = document.querySelector("#question-section");
const questionNumberRef = document.querySelector("#question-number"); /** not yet used */
const scoreboardRef = document.querySelector("#scoreboard"); /** not yet used */
const scoreSection = document.querySelector("#score-section"); /** not yet in html or js */
const timerRef = document.querySelector("#timer"); /** not yet used */
const secondsRef = document.querySelector("#seconds"); /** not yet used */
const questionRef = document.querySelector("#question"); /** not yet used */
const answerButtonsRef = document.querySelector("#answer-buttons"); /** not yet used */
const correctAnswersRef = document.querySelector("#correct-answers"); /** not yet used */
const incorrectAnswersRef = document.querySelector("#incorrect-answers"); /** not yet used */
const result = document.querySelector("#results"); /** not yet in html or js */
const finalResultRef = document.querySelector("#final-result"); /** not yet used */
const resultsSectionRef = document.querySelector("#results-section"); /** not yet used */
const newGameRef = document.querySelector("#new-game-button"); /** not yet used */

/** Hide/Show sections */
const hideSection = (section) => section.classList.add("hide");
const showSection = (section) => section.classList.remove("hide");

/** Set question difficulty */
difficultyButtonRef
    .addEventListener("click", function() {
        let selectedDifficulty = difficultyRef.dataset;
        console.log(selectedDifficulty)
})

/** Fetching API data */
startButtonRef
  .addEventListener("click", function () {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=17&difficulty=${selectedDifficulty}&type=multiple`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Questions could not be loaded at this time");
        }
        hideSection(playerSectionRef);
        showSection(questionSectionRef);
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
      difficultyRef: apiQuestion.difficultyRef,
      question: apiQuestion.question,
      answers: answers,
    };
  });
}

/** Error handling for API */
function errorHandling() {
  alert("Questions could not be loaded at this time, please try again later.");
}
