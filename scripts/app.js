import { loadFlashcards }      from './storage.js';
import { initFlashcards, getNextCard }      from './flashcards.js';
import { bindModalEvents }     from './modal.js';
import { bindAppEvents }       from './events.js';
import { renderFlashcardsList, updateScore, showCard } from './ui.js';

function init() {
  // 1. Load from localStorage
  const loaded = loadFlashcards();
  initFlashcards(loaded);

  // 2. Render and wire up everything
  renderFlashcardsList();
  bindModalEvents();
  bindAppEvents();

  // 3. Show the first card & score
  const first = getNextCard();
  showCard(first);
  updateScore();
}

// Make sure the DOM is ready before we touch any elements
window.addEventListener('DOMContentLoaded', init);