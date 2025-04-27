import { getFlashcards, correctTotal, wrongTotal } from './flashcards.js';

const cardFront = document.getElementById('card-front');
const cardBack  = document.getElementById('card-back');
const cardEl    = document.getElementById('card');
const scoreDisp = document.getElementById('score');
const progress  = document.getElementById('progress');
const listEl    = document.getElementById('card-list');

export function renderFlashcardsList() {
  listEl.innerHTML = '';
  getFlashcards().forEach(card => {
    const li = document.createElement('li');
    li.textContent = `${card.front} - ${card.back}`;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => window.dispatchEvent(new CustomEvent('card:remove', { detail: card.id }));
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

export function updateScore() {
  const total = (correctTotal + wrongTotal) || 1;
  scoreDisp.textContent = `Score: ${correctTotal} correct, ${wrongTotal} wrong`;
  progress.style.width = `${(correctTotal/total)*100}%`;
}

export function showCard(card) {
  if (!card) {
    cardFront.textContent = 'All flashcards mastered! 🎉';
    cardBack.textContent = '';
    return;
  }
  cardFront.textContent = card.front;
  cardBack.textContent = card.back;
  cardEl.classList.remove('flipped');
}

export function flipCardUI() {
  cardEl.classList.toggle('flipped');
}