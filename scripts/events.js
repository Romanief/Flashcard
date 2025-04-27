import {
  addFlashcard,
  removeFlashcard,
  markCorrect,
  markWrong,
  getNextCard,
  getFlashcards,
  toggleReviseMode
} from './flashcards.js';

import {
  renderFlashcardsList,
  updateScore,
  showCard,
} from './ui.js';

import { showNotification } from './ui.js';

import { saveFlashcards, loadFlashcards } from './storage.js';

export function bindAppEvents() {
  // Activate revise mode
  const reviseBtn = document.getElementById('revise-mode');
  reviseBtn.addEventListener('click', () => {
    const inRevise = toggleReviseMode();
    reviseBtn.textContent = inRevise ? 'Exit Revise Mode' : 'Revise Mode';
    const next = getNextCard();
    showCard(next);
  });

  // On form submit: add then save *current* flashcards
  document.getElementById('card-form')
    .addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.front.value.trim();
      const b = e.target.back.value.trim();
      if (!f || !b) return alert('Fill both fields!');
      addFlashcard(f, b);
      saveFlashcards(getFlashcards());       // ← save the up-to-date array
      renderFlashcardsList();
      e.target.reset();
    });

  // Mark correct
  document.getElementById('correct')
    .addEventListener('click', () => {
      markCorrect();
      saveFlashcards(getFlashcards());       // ← save the up-to-date array
      const next = getNextCard();
      showCard(next);
      updateScore();
    });

  // Mark wrong
  document.getElementById('wrong')
    .addEventListener('click', () => {
      markWrong();
      saveFlashcards(getFlashcards());       // ← save the up-to-date array
      const next = getNextCard();
      showCard(next);
      updateScore();
    });

  // Remove via custom event
  window.addEventListener('card:remove', e => {
    removeFlashcard(e.detail);
    saveFlashcards(getFlashcards());       // ← save the up-to-date array
    renderFlashcardsList();
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

  // Manage toast pop up
  document.getElementById('correct')
  .addEventListener('click', () => {
    markCorrect();
    saveFlashcards(getFlashcards());
    
    // 🎉 show the toast!
    showNotification('✨ Well done! ✨');
    
    const next = getNextCard();
    showCard(next);
    updateScore();
  });
}
