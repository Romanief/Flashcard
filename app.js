let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentCard = null;
let correctTotal = 0;
let wrongTotal = 0;

const form = document.getElementById('card-form');
const frontInput = document.getElementById('front');
const backInput = document.getElementById('back');
const cardList = document.getElementById('card-list');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const cardElement = document.getElementById('card');
const scoreDisplay = document.getElementById('score');
const progress = document.getElementById('progress');
const modal = document.getElementById('manage-modal');
const openManage = document.getElementById('open-manage');
const closeModal = document.getElementById('close-modal');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addFlashcard(frontInput.value, backInput.value);
  frontInput.value = '';
  backInput.value = '';
});

document.getElementById('flip').addEventListener('click', () => {
  cardElement.classList.toggle('flipped');
});

document.getElementById('correct').addEventListener('click', () => {
  if (currentCard) {
    currentCard.correctStreak++;
    if (currentCard.correctStreak >= 5) {
      currentCard.learned = true;
    }
    correctTotal++;
    saveFlashcards();
    nextFlashcard();
  }
});

document.getElementById('wrong').addEventListener('click', () => {
  if (currentCard) {
    currentCard.correctStreak = 0;
    currentCard.wrongCount++;
    wrongTotal++;
    saveFlashcards();
    nextFlashcard();
  }
});

openManage.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    nextFlashcard();
  }
});

function addFlashcard(front, back) {
  const newCard = {
    id: Date.now(),
    front,
    back,
    correctStreak: 0,
    learned: false,
    wrongCount: 0
  };
  flashcards.push(newCard);
  saveFlashcards();
  renderFlashcards();
}

function removeFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  saveFlashcards();
  renderFlashcards();
}

function renderFlashcards() {
  cardList.innerHTML = '';
  flashcards.forEach(card => {
    const li = document.createElement('li');
    li.textContent = `${card.front} - ${card.back}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => removeFlashcard(card.id);
    li.appendChild(deleteBtn);
    cardList.appendChild(li);
  });
}

function nextFlashcard() {
  const candidates = flashcards.filter(card => !card.learned);
  if (candidates.length === 0) {
    cardFront.textContent = 'All flashcards mastered! 🎉';
    cardBack.textContent = '';
    return;
  }
  candidates.sort((a, b) => (b.wrongCount ?? 0) - (a.wrongCount ?? 0));
  const weighted = candidates.slice(0, Math.min(5, candidates.length));
  currentCard = weighted[Math.floor(Math.random() * weighted.length)];

  cardFront.textContent = currentCard.front;
  cardBack.textContent = currentCard.back;
  cardElement.classList.remove('flipped');
  updateScore();
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${correctTotal} correct, ${wrongTotal} wrong`;
  const total = correctTotal + wrongTotal || 1;
  progress.style.width = `${(correctTotal / total) * 100}%`;
}

function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

renderFlashcards();
