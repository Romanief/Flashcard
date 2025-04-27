import { getFlashcards, correctTotal, wrongTotal } from './flashcards.js';

const cardFront = document.getElementById('card-front');
const cardBack  = document.getElementById('card-back');
const cardEl    = document.getElementById('card');
const scoreDisp = document.getElementById('score');
const progress  = document.getElementById('progress');
const listEl    = document.getElementById('card-list');

// toasts for showNotification function
const toastMessages = [
  '✨ Well done! ✨',
  '🎉 You nailed it! 🎉',
  '🚀 You’re blasting off! 🚀',
  '💯 Perfect answer! 💯',
  '🌟 Superstar move! 🌟',
  '👍 You got it! 👍',
  '🥳 Keep it up! 🥳',
  '🔥 On fire! 🔥',
  '🥇 First place brain! 🥇',
  '👏 Bravo! 👏'
];

// 5 background options
const toastBackgrounds = [
  '#14b8a6',                                            // cool teal
  '#8b5cf6',                                            // vibrant violet
  '#f59e0b',                                            // warm amber
  'linear-gradient(135deg, #0ea5e9, #3b82f6)',      // deep ocean
  'linear-gradient(135deg, #fbcfe8, #fcd34d)'       // pastel sunset
];

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

// Shows a temporary toast notification (randomly selected).
export function showNotification() {
  const notif = document.getElementById('notification');

  // pick a random message
  const msgIndex = Math.floor(Math.random() * toastMessages.length);
  // pick a random background
  const bgIndex  = Math.floor(Math.random() * toastBackgrounds.length);

  notif.textContent = toastMessages[msgIndex];
  notif.style.background = toastBackgrounds[bgIndex];

  // show it
  notif.classList.add('show');

  // hide after 2s
  setTimeout(() => {
    notif.classList.remove('show');
  }, 2000);
}