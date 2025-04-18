const questions = [
  {
    question: "Who developed Python Programming Language?",
    answers: [
      {text: "Wick van Rossum", correct: false },
      {text: "Rasmus Lerdorf", correct: false },
      {text: "Guido van Rossum", correct: true },
      {text: "Niene Stom", correct: false }
    ]
  },
  {
    question: "Which component is used to compile, debug and execute the java programs?",
    answers: [
      {text: "JRE", correct: false },
      {text: "JIT", correct: false },
      {text: "JDK", correct: true },
      {text: "JVM", correct: false }
    ]
  },
  {
    question: "Which environment variable is used to set the java path?",
    answers: [
      {text: "MAVEN_Path", correct: false },
      {text: "JavaPATH", correct: false },
      {text: "JAVA", correct: false },
      {text: "JAVA_HOME", correct: true }
    ]
  },
  {
    question: "Arrays in JavaScript are defined by which of the following statements?",
    answers: [
      {text: "It is an ordered list of values", correct: true },
      {text: "It is an ordered list of objects", correct: false },
      {text: "It is an ordered list of string", correct: false },
      {text: "It is an ordered list of functions", correct: false }
    ]
  },
  {
    question: "Where is Client-side JavaScript code is embedded within HTML documents?",
    answers: [
      {text: "A URL that uses the special javascript:code", correct: false },
      {text: "A URL that uses the special javascript:protocol", correct: true },
      {text: "A URL that uses the special javascript:encoding", correct: false },
      {text: "A URL that uses the special javascript:stack", correct: false }
    ]
  }
];

const questionElement = document.querySelector(".ques");
const answerButtons = document.querySelector(".ansbtn");
const nextButtons = document.querySelector(".next");
const quesCount = document.querySelector(".qcount");
const scorRes = document.querySelector(".scoreRes");
const heading = document.querySelector("heading");
const resetBtn = document.querySelector("resetbtn")

let currentQuesIndex = 0;
let scoreCount = 0;



///// for fireworks //////

let canvas, ctx, width, height;
let fireworks = [];
let particles = [];
let fireworksRunning = false;
let animationId;

///// for fireworks //////


function startQuiz() {
  currentQuesIndex = 0;
  scoreCount = 0;
  nextButtons.innerHTML = "Next";
  showQuestions();
  closePopup();
  answerButtons.classList.remove("blur");
  nextButtons.classList.remove("blur");  
  questionElement.classList.remove("blur");
  stopFireworks();
}




function showQuestions() {
  resetState();
  let currentQuestion = questions[currentQuesIndex];
  let questionNumber = currentQuesIndex + 1;
  questionElement.innerHTML = questionNumber + ". " + currentQuestion.question;
  quesCount.innerHTML = `${currentQuesIndex + 1} of ${questions.length}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn")
    answerButtons.appendChild(button);
    if(answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer)
  });
}

function resetState() {
  nextButtons.style.display = "none";
  while(answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if(isCorrect) {
    selectedBtn.classList.add("correct");
    scoreCount++;
  }else {
    selectedBtn.classList.add("wrong");
  }
  Array.from(answerButtons.children).forEach(button => {
    if(button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButtons.style.display = "block";
}

function handleNextButton() {
  currentQuesIndex++;
  if(currentQuesIndex < questions.length) {
    showQuestions();
  }else {
    openPopup();
    startFireworks();
    // resetBtn.style.zIndex = 1;
    answerButtons.classList.add("blur");
    nextButtons.classList.add("blur");  
    questionElement.classList.add("blur");
    // heading.classList.add("blur");
    scorRes.innerHTML = `Number Of Ques: ${questions.length}</br> Correct: ${scoreCount}`;
  }
  if(currentQuesIndex === 4) {
    nextButtons.innerHTML = "View Score"
  }
}



const popUp = document.getElementById("popup")

function openPopup() {  
  popUp.classList.add("open-popup");
}
function closePopup() {  
  popUp.classList.remove("open-popup")
}
nextButtons.addEventListener("click", () => {
  if(currentQuesIndex < questions.length) {
    handleNextButton();      
  }else{
    
  }
})


startQuiz();




/// fireworks ///


"use strict";



function startFireworks() {
  if (fireworksRunning) return;
  fireworksRunning = true;

  canvas = document.getElementById("canvas");
  canvas.style.zIndex = 2;
  setSize(canvas);
  ctx = canvas.getContext("2d");

  fireworks.push(new Firework(Math.random() * (width - 200) + 100));
  window.addEventListener("resize", windowResized);
  document.addEventListener("click", onClick);

  animationId = requestAnimationFrame(loop);
}

function stopFireworks() {
  if (!fireworksRunning) return;
  fireworksRunning = false;

  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", windowResized);
  document.removeEventListener("click", onClick);

  ctx.clearRect(0, 0, width, height);
  fireworks = [];
  particles = [];
}

function loop() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < fireworks.length; i++) {
    let done = fireworks[i].update();
    fireworks[i].draw();
    if (done) fireworks.splice(i, 1);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].lifetime > 80) particles.splice(i, 1);
  }

  if (Math.random() < 1 / 60) {
    fireworks.push(new Firework(Math.random() * (width - 200) + 100));
  }

  animationId = requestAnimationFrame(loop);
}

class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.vel = randomVec(3); // stronger explosion
    this.lifetime = 0;
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.y += 0.02;
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;
    this.lifetime++;
  }

  draw() {
    ctx.globalAlpha = Math.max(1 - this.lifetime / 80, 0);
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 3, 3); // bigger sparks
  }
}

class Firework {
  constructor(x) {
    this.x = x;
    this.y = height;
    this.isBlown = false;
    this.col = randomCol();
  }

  update() {
    this.y -= 4;
    if (this.y < 350 - Math.sqrt(Math.random() * 500) * 40) {
      this.isBlown = true;
      for (let i = 0; i < 80; i++) { // more particles
        particles.push(new Particle(this.x, this.y, this.col));
      }
    }
    return this.isBlown;
  }

  draw() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 3, 3);
  }
}

function randomCol() {
  const letter = '0123456789ABCDEF';
  const nums = [];

  for (let i = 0; i < 3; i++) {
    nums[i] = Math.floor(Math.random() * 256);
  }

  let brightest = Math.max(...nums);
  brightest /= 255;
  for (let i = 0; i < 3; i++) {
    nums[i] = Math.min(255, nums[i] / brightest);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += letter[Math.floor(nums[i] / 16)];
    color += letter[Math.floor(nums[i] % 16)];
  }

  return color;
}

function randomVec(max) {
  const dir = Math.random() * Math.PI * 2;
  const spd = Math.random() * max;
  return {
    x: Math.cos(dir) * spd,
    y: Math.sin(dir) * spd
  };
}

function setSize(canv) {
  width = innerWidth;
  height = innerHeight;
  canv.style.width = width + "px";
  canv.style.height = height + "px";

  canv.width = width * window.devicePixelRatio;
  canv.height = height * window.devicePixelRatio;
  canv.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
}

function onClick(e) {
  fireworks.push(new Firework(e.clientX));
}

function windowResized() {
  setSize(canvas);
  ctx.clearRect(0, 0, width, height);
}



