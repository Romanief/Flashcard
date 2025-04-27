let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentCard = null;
let correctTotal = 0;
let wrongTotal = 0;

// DOM elements
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

// Initialize the app
function init() {
  renderFlashcards();
  bindEventListeners();
}

// Bind all event listeners
function bindEventListeners() {
  form.addEventListener('submit', handleFormSubmit);
  openManage.addEventListener('click', openManageModal);
  closeModal.addEventListener('click', closeManageModal);
  window.addEventListener('click', closeModalOnClickOutside);
  window.addEventListener('keydown', handleKeydownEvents);
  document.getElementById('flip').addEventListener('click', flipCard);
  document.getElementById('correct').addEventListener('click', markCardCorrect);
  document.getElementById('wrong').addEventListener('click', markCardWrong);
}

// Handle adding a new flashcard
function handleFormSubmit(e) {
  e.preventDefault();
  const front = frontInput.value.trim();
  const back = backInput.value.trim();
  
  if (front && back && !flashcards.some(card => card.front === front && card.back === back)) {
    addFlashcard(front, back);
  } else {
    alert('Please enter valid and unique front and back values.');
  }

  frontInput.value = '';
  backInput.value = '';
}

// Add a flashcard
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

// Save flashcards to localStorage
function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Render the flashcards list in the modal
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

// Remove a flashcard
function removeFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  saveFlashcards();
  renderFlashcards();
}

// Open manage modal
function openManageModal() {
  modal.classList.remove('hidden');
}

// Close manage modal
function closeManageModal() {
  modal.classList.add('hidden');
}

// Close modal if clicked outside of it
function closeModalOnClickOutside(e) {
  if (e.target === modal) {
    closeManageModal();
  }
}

// Flip the card
function flipCard() {
  cardElement.classList.toggle('flipped');
}

// Mark a card as correct
function markCardCorrect() {
  if (currentCard) {
    currentCard.correctStreak++;
    if (currentCard.correctStreak >= 5) {
      currentCard.learned = true;
    }
    correctTotal++;
    saveFlashcards();
    nextFlashcard();
  }
}

// Mark a card as wrong
function markCardWrong() {
  if (currentCard) {
    currentCard.correctStreak = 0;
    currentCard.wrongCount++;
    wrongTotal++;
    saveFlashcards();
    nextFlashcard();
  }
}

// Handle keyboard events
function handleKeydownEvents(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    nextFlashcard();
  }
  if (e.code === 'ArrowUp') {
    markCardCorrect();
  }
  if (e.code === 'ArrowDown') {
    markCardWrong();
  }
  if (e.code === 'KeyF') {
    flipCard();
  }
}

// Go to the next flashcard
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

// Update the score and progress bar
function updateScore() {
  scoreDisplay.textContent = `Score: ${correctTotal} correct, ${wrongTotal} wrong`;
  const total = correctTotal + wrongTotal || 1;
  progress.style.width = `${(correctTotal / total) * 100}%`;
}

// Initialize the app
init();
