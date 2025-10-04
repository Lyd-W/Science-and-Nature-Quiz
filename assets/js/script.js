const playerSection = document.querySelector("#setup-section");
const quizContainer = document.querySelector(".quiz-container");
const username = document.querySelector("#player-name");
const difficulty = document.querySelector(".data-difficulty");
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

const hideSection = (section) => section.classList.add("hide");
const showSection = (section) => section.classList.remove("hide");

startButton.onclick = function(fetchData){
async function fetchData() {
    try{
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=17&difficulty=${difficulty}&type=multiple`)
    if (!response.ok){
        throw new Error("Questions could not be loaded at this time");
    }
    const data = await response.blob();
    console.log(data);
    }
    catch(error){
        console.error(error);
    }
}
}