import BLOCKS from "./blocks.js";

const playground = document.querySelector(".playground ul");
const gameStart = document.querySelector(".game_start");
const gameText = document.querySelector(".game_text");
const endscore = document.querySelector(".endscore");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game_text button");
const startButton = document.querySelector(".game_start button");

const GameRows = 20;
const GameCols = 10;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "",
  direction: 0,
  top: 0,
  left: 3,
};

function init() {
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < GameRows; i++) {
    prependNewLine();
  }
  generateNewBlock();
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < 10; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

function renderBlocks(moveType = "") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });

  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAbailavle = checkEmpty(target);
    if (isAbailavle) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };
      if (moveType === "retry") {
        clearInterval(downInterval);
        showGameoverText();
      }
      setTimeout(() => {
        renderBlocks("retry");
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function showGameoverText() {
  gameText.style.display = "flex";
  endscore.textContent = "당신의 점수는 " + score + "점 입니다.";
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}
function checkMatch() {
  score = score + 10;
  scoreDisplay.innerHTML = score;
  const childNodes = playground.childNodes;
  childNodes.forEach((child) => {
    let matched = true;
    child.children[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });
    if (matched) {
      child.remove();
      prependNewLine();
      score = score + 100;
      scoreDisplay.innerHTML = score;
    }
  });
  generateNewBlock();
}
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);

  const blockArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  renderBlocks();
}

function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
});

restartButton.addEventListener("click", () => {
  playground.innerHTML = "";
  init();
  gameText.style.display = "none";
  score = 0;
});

startButton.addEventListener("click", () => {
  playground.innerHTML = "";
  init();
  gameText.style.display = "none";
  gameStart.style.display = "none";
  score = 0;
});
