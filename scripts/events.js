import {
  addFlashcard, removeFlashcard, markCorrect,
  markWrong, getNextCard
} from './flashcards.js';
import {
  renderFlashcardsList, updateScore, showCard, flipCardUI
} from './ui.js';
import { saveFlashcards, loadFlashcards } from './storage.js';

export function bindAppEvents() {
  // Form submit
  document.getElementById('card-form')
    .addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.front.value.trim();
      const b = e.target.back.value.trim();
      if (!f || !b) return alert('Fill both fields!');
      addFlashcard(f, b);
      saveFlashcards(loadFlashcards());
      renderFlashcardsList();
      e.target.reset();
    });

  // Card actions
  document.getElementById('flip').addEventListener('click', flipCardUI);
  document.getElementById('correct').addEventListener('click', () => {
    markCorrect();
    saveFlashcards(loadFlashcards());
    const next = getNextCard();
    showCard(next);
    updateScore();
  });
  document.getElementById('wrong').addEventListener('click', () => {
    markWrong();
    saveFlashcards(loadFlashcards());
    const next = getNextCard();
    showCard(next);
    updateScore();
  });

  // Keyboard shortcuts
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      const next = getNextCard();
      showCard(next);
      updateScore();
    }
    if (e.code === 'ArrowUp') document.getElementById('correct').click();
    if (e.code === 'ArrowDown') document.getElementById('wrong').click();
    if (e.code === 'KeyF') document.getElementById('flip').click();
  });

  // Custom remove event
  window.addEventListener('card:remove', e => {
    removeFlashcard(e.detail);
    saveFlashcards(loadFlashcards());
    renderFlashcardsList();
  });
}