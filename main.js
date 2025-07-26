class FindTheNumberGame {
  constructor() {
    this.grid = document.getElementById("grid");
    this.targetDisplay = document.getElementById("target-number");
    this.timerSpan = document.getElementById("timer");
    this.scoreSpan = document.getElementById("score");
    this.levelSpan = document.getElementById("level");
    this.bonusDisplay = document.getElementById("bonus");
    this.streakDisplay = document.getElementById("streak");
    this.score = 0;
    this.level = 1;
    this.timeLeft = 60;
    this.bonus = 1;
    this.streak = 0;
    this.timerInterval = null;

    this.generateRound();
    this.startTimer();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

generateRound() {
  this.grid.innerHTML = "";

  let rows = 2, cols = 3;
  if (this.level >= 3) {
    rows = 3;
    cols = 3;
  }
  if (this.level >= 5) {
    rows = 4;
    cols = 4;
  }

  const totalNumbers = rows * cols;
  const numbers = new Set();
  while (numbers.size < totalNumbers) {
    numbers.add(this.getRandomInt(1, 999));
  }

  this.grid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  this.grid.style.gridTemplateRows = `repeat(${rows}, 100px)`;

  const numberArray = [...numbers];
  this.target = numberArray[this.getRandomInt(0, numberArray.length - 1)];
  this.targetDisplay.textContent = this.target;
  this.levelSpan.textContent = `1-${this.level}`;

  numberArray.forEach((num) => {
    const div = document.createElement("div");
    div.className = "number-box";
    div.textContent = num;
    div.addEventListener("click", () => this.handleClick(div, num));
    this.grid.appendChild(div);
  });
}


  handleClick(el, number) {
    if (number === this.target) {
      el.classList.add("correct");
      this.score += 10 * this.bonus;
      this.streak++;
      this.bonus = 1 + Math.floor(this.streak / 2);

      this.scoreSpan.textContent = this.score;
      this.level++;
      this.bonusDisplay.textContent = this.bonus;
      this.streakDisplay.textContent = this.streak;
      setTimeout(() => this.generateRound(), 800);
    } else {
      el.classList.add("incorrect");
      this.streak = 0;
      this.bonus = 1;
      this.bonusDisplay.textContent = this.bonus;
      this.streakDisplay.textContent = this.streak;
      setTimeout(() => el.classList.remove("incorrect"), 500);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerSpan.textContent = `00:${this.timeLeft < 10 ? "0" : ""}${this.timeLeft}`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.showGameOverScreen();
      }
    }, 1000);
  }

  showGameOverScreen() {
    const overlay = document.createElement("div");
    overlay.className = "game-over";
    overlay.innerHTML = `
      <div class="game-over-content">
        <h2>⏱ Время вышло!</h2>
        <p>Ваш счёт: <strong>${this.score}</strong></p>
        <button id="restart-btn">Начать заново</button>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      document.getElementById("restart-btn").addEventListener("click", () => {
        overlay.remove();
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.scoreSpan.textContent = "0";
        this.levelSpan.textContent = "1-1";
        this.timerSpan.textContent = "01:00";

        this.generateRound();
        this.startTimer();
      });
    }, 100);
  }
}

window.onload = () => new FindTheNumberGame();
