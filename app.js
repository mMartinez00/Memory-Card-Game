const cards = document.querySelectorAll(".card");
const images = document.querySelectorAll(".image");
const enter = document.getElementById("enter-btn");
const move = document.getElementById("move");
const points_el = document.getElementById("point");
const count = document.getElementById("count-down");
const select = document.getElementById("difficulty");
const modal = document.getElementById("modal");
let points = 0;
let moves = 0;
let hasFlippedCard = false;
let lockGame = false;
let firstCard;
let secondCard;
let interval;
const API_KEY = config.API_KEY;

enter.addEventListener("click", startGame);

// Fetch photos from Pexel API
async function getPhotos() {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=nature&per_page=6`,
    {
      headers: {
        Authorization: `${API_KEY}`,
      },
    }
  );

  const data = await res.json();

  return data;
}

getPhotos().then((data) => insertImages(data));

function insertImages(data) {
  const src = data.photos.map((photo) => {
    let url = photo.src.medium;

    return url;
  });

  // 6 photo sources were fetched from Pexels. To fill each card with a photo we doubled each source
  const double_src = src.concat(src);

  // Shuffle the sources before setting the image.src to the source provieded by Pexel.
  const shuffled_src = shuffle(double_src);

  images.forEach((image, index) => {
    image.src = shuffled_src[index];
  });
}

// Alorithm to shuffle Array
function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function startGame() {
  // Function to start the timer
  countDown();

  cards.forEach((card) => {
    card.addEventListener("click", flipCard);
  });
}

function countDown() {
  let time;

  switch (select.value) {
    case "easy":
      time = 60;
      startTimer(time);
      break;
    case "medium":
      time = 45;
      startTimer(time);
      break;
    case "hard":
      time = 30;
      startTimer(time);
      break;
  }
}

function startTimer(time) {
  interval = setInterval(() => {
    time--;

    if (time === 0) {
      count.innerText = 0;
      clearInterval(interval);

      cards.forEach((card) => card.removeEventListener("click", flipCard));
    }

    count.innerText = time;
  }, 1000);
}

function flipCard() {
  if (lockGame) return;
  if (this === firstCard) return;

  this.children[0].classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  hasFlippedCard = false;
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch =
    firstCard.children[0].children[1].children[0].src ===
    secondCard.children[0].children[1].children[0].src;

  isMatch ? disableCard() : unflipCard();
}

function disableCard() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  addPoints();
  addMove();
  resetGame();
}

function unflipCard() {
  lockGame = true;

  setTimeout(() => {
    firstCard.children[0].classList.remove("flip");
    secondCard.children[0].classList.remove("flip");

    addMove();
    resetGame();
  }, 1300);
}

function resetGame() {
  [hasFlippedCard, lockGame] = [false, false][(firstCard, secondCard)] = [
    null,
    null,
  ];
}

function addMove() {
  moves++;

  move.innerText = moves;
}

function addPoints() {
  points++;

  points_el.innerText = points;
}
