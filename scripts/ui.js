// scripts/ui.js

import { isReviseMode, getNextCard, correctTotal, wrongTotal } from './flashcards.js';
import { openModal } from './modal.js';

// DOM references
const cardFront = document.getElementById('card-front');
const cardBack  = document.getElementById('card-back');
const cardEl    = document.getElementById('card');
const scoreDisp = document.getElementById('score');
const progress  = document.getElementById('progress');
const listEl    = document.getElementById('card-list');

// Toast messages and background options
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

const toastBackgrounds = [
  '#14b8a6',                                        // cool teal
  '#8b5cf6',                                        // vibrant violet
  '#f59e0b',                                        // warm amber
  'linear-gradient(135deg, #0ea5e9, #3b82f6)',      // deep ocean gradient
  'linear-gradient(135deg, #fbcfe8, #fcd34d)'       // pastel sunset
];

let toastTimeout;

/**
 * Renders the flashcards list in the Manage modal.
 */
export function renderFlashcardsList() {
  const flashcards = getFlashcards();
  listEl.innerHTML = '';
  flashcards.forEach(card => {
    const li = document.createElement('li');
    li.textContent = `${card.front} - ${card.back}`;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => window.dispatchEvent(
      new CustomEvent('card:remove', { detail: card.id })
    );
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

/**
 * Updates the score display and progress bar.
 */
export function updateScore() {
  const total = (correctTotal + wrongTotal) || 1;
  scoreDisp.textContent = `Score: ${correctTotal} correct, ${wrongTotal} wrong`;
  progress.style.width = `${(correctTotal / total) * 100}%`;
}

/**
 * Shows a temporary toast notification with random message & background.
 */
export function showNotification() {
  const notif = document.getElementById('notification');

  // Clear any pending hide timer
  clearTimeout(toastTimeout);

  // Reset animation state
  notif.classList.remove('show');
  // Force reflow to restart CSS transition
  void notif.offsetWidth;

  // Pick random message and background
  const msgIndex = Math.floor(Math.random() * toastMessages.length);
  const bgIndex  = Math.floor(Math.random() * toastBackgrounds.length);

  notif.textContent       = toastMessages[msgIndex];
  notif.style.background  = toastBackgrounds[bgIndex];

  // Trigger show animation
  notif.classList.add('show');

  // Hide after 2 seconds
  toastTimeout = setTimeout(() => {
    notif.classList.remove('show');
  }, 800);
}

/**
 * Displays the given card or a "mastered" message with click-to-add behavior.
 * @param {Object|null} card
 */
export function showCard(card) {
  if (!card) {
    cardFront.textContent = 'All flashcards mastered! 🎉';
    cardBack.textContent  = 'Click here to add more';

    // Ensure no stuck flip state
    cardEl.classList.remove('flipped');

    // Make the card look clickable and bind click
    cardEl.style.cursor = 'pointer';
    cardEl.onclick      = openModal;
    return;
  }

  // Normal card display
  cardEl.onclick = null;
  cardEl.style.cursor = 'default';
  if (!card) {
    if (isReviseMode()) {
      cardFront.textContent = 'No learned flashcards to revise! ✨';
    } else {
      cardFront.textContent = 'All flashcards mastered! 🎉';
    }
    cardBack.textContent = '';
    return;
  }
  cardFront.textContent = card.front;
  cardBack.textContent  = card.back;
  cardEl.classList.remove('flipped');
}
